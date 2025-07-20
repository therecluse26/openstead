import useSWR from 'swr'
import axios, { AxiosResponse } from '@/lib/axios'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTenantStore } from '../components/Tenants/TenantStore'
import { User } from '@/types/User'
import { ApiResponse } from '@/types/Common'

export const csrf = () => axios.get('/sanctum/csrf-cookie')

interface UseAuthProps {
    middleware?: 'auth' | 'guest'
    redirectIfAuthenticated?: string
}

interface AuthFormData {
    setError: (field: string, error: { type?: string; message: string }) => void
    callback?: () => void
    [key: string]: any
}

interface ForgotPasswordData {
    setErrors: (errors: Record<string, string[]>) => void
    setStatus: (status: string | null) => void
    email: string
}

interface ResetPasswordData {
    setErrors: (errors: Record<string, string[]>) => void
    setStatus: (status: string | null) => void
    [key: string]: any
}

interface ResendEmailVerificationData {
    setStatus: (status: string) => void
}

export const useAuth = ({
    middleware,
    redirectIfAuthenticated,
}: UseAuthProps = {}) => {
    const router = useRouter()

    const { setCurrentTenant } = useTenantStore()

    const { data: user, error, mutate } = useSWR<User>('/api/user', () =>
        axios
            .get<ApiResponse<User>>('/api/user')
            .then((res: AxiosResponse<ApiResponse<User>>) => {
                return res.data.data
            })
            .catch((error: any) => {
                if (error.response.status !== 409) throw error
                router.push('/verify-email')
            }),
    )

    const register = async ({
        setError,
        callback,
        ...props
    }: AuthFormData): Promise<void> => {
        await csrf()
        axios
            .post<ApiResponse<{ tenant_id: number }>>('/register', props)
            .then((data: AxiosResponse<ApiResponse<{ tenant_id: number }>>) => {
                const tenantId = data?.data?.data?.tenant_id

                if (!tenantId) {
                    throw new Error('User is not associated with a tenant')
                }

                setCurrentTenant(tenantId)

                return mutate()
            })
            .catch((error: any) => {
                if (error.response === undefined) {
                    alert(error)
                    return
                }

                if (error.response.status !== 422) throw error

                for (let [key, err] of Object.entries(
                    error.response.data.errors as Record<string, string[]>,
                )) {
                    setError(key, {
                        type: 'string',
                        message: (err as string[])[0],
                    })
                }
            })
            .finally(() => {
                if (callback) {
                    callback()
                }
            })
    }

    const login = async ({
        setError,
        callback,
        ...props
    }: AuthFormData): Promise<void> => {
        await csrf()
        axios
            .post<ApiResponse<{ tenant_id: number }>>('/login', props)
            .then((data: AxiosResponse<ApiResponse<{ tenant_id: number }>>) => {
                const tenantId = data?.data?.data?.tenant_id

                if (!tenantId) {
                    throw new Error('User is not associated with a tenant')
                }

                setCurrentTenant(tenantId)

                return mutate()
            })
            .catch((error: any) => {
                if (error.response === undefined) {
                    setError('email', {
                        type: 'string',
                        message: 'An unknown error occurred',
                    })
                    return
                }

                if (error.response.data.error) {
                    setError('email', {
                        type: 'string',
                        message: error.response.data.error,
                    })
                    return
                }

                if (!error.response.data.errors) {
                    setError('email', {
                        type: 'string',
                        message: 'An unknown error occurred',
                    })
                    return
                }

                if (error.response.status === 401) {
                    setError('email', {
                        type: 'string',
                        message: 'Invalid credentials',
                    })
                    return
                }

                for (const [key, value] of Object.entries(
                    error.response.data.errors as Record<string, string[]>,
                )) {
                    setError(key, { message: (value as string[])[0] })
                }
            })
            .finally(() => {
                if (callback) {
                    callback()
                }
            })
    }

    const forgotPassword = async ({
        setErrors,
        setStatus,
        email,
    }: ForgotPasswordData): Promise<void> => {
        await csrf()
        setErrors({})
        setStatus(null)

        axios
            .post<ApiResponse<{ status: string }>>('/forgot-password', {
                email,
            })
            .then((response: AxiosResponse<ApiResponse<{ status: string }>>) =>
                setStatus(response.data.data.status),
            )
            .catch((error: any) => {
                if (error.response === undefined) {
                    alert(error)
                    return
                }

                if (error.response.status !== 422) throw error

                setErrors(
                    error.response.data.errors as Record<string, string[]>,
                )
            })
    }

    const resetPassword = async ({
        setErrors,
        setStatus,
        ...props
    }: ResetPasswordData): Promise<void> => {
        await csrf()
        setErrors({})
        setStatus(null)

        axios
            .post<ApiResponse<{ status: string }>>('/reset-password', {
                token: router.query.token,
                ...props,
            })
            .then((response: AxiosResponse<ApiResponse<{ status: string }>>) =>
                router.push('/login?reset=' + btoa(response.data.data.status)),
            )
            .catch((error: any) => {
                if (error.response === undefined) {
                    alert(error)
                    return
                }

                if (error.response.status !== 422) throw error

                setErrors(
                    error.response.data.errors as Record<string, string[]>,
                )
            })
    }

    const resendEmailVerification = ({
        setStatus,
    }: ResendEmailVerificationData): Promise<void> => {
        return axios
            .post<ApiResponse<{ status: string }>>(
                '/email/verification-notification',
            )
            .then((response: AxiosResponse<ApiResponse<{ status: string }>>) =>
                setStatus(response.data.data.status),
            )
    }

    const logout = async (): Promise<void> => {
        if (!error) {
            await axios
                .post<ApiResponse<any>>('/logout')
                .then(() => {
                    setCurrentTenant(null)

                    return mutate()
                })
                .catch((error: any) => {
                    if (error.response === undefined) {
                        alert(error)
                        return
                    }
                })
        }

        window.location.pathname = '/login'
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user) {
            router.push(redirectIfAuthenticated)
        }
        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at
        ) {
            router.push(redirectIfAuthenticated)
        }

        if (middleware === 'auth' && error) {
            logout()
        }
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    }
}
