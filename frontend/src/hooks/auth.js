import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export const csrf = () => axios.get('/sanctum/csrf-cookie')

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()

    const { data: user, error, mutate } = useSWR('/api/user', () =>
        axios
            .get('/api/user')
            .then(res => {
                return res.data
            })
            .catch(error => {
                if (error.response.status !== 409) throw error
                router.push('/verify-email')
            }),
    )

    const register = async ({ setError, callback, ...props }) => {
        await csrf()
        axios
            .post('/register', props)
            .then(data => {
                const tenantId = data?.data?.tenant_id

                if (!tenantId) {
                    throw new Error('User is not associated with a tenant')
                }

                localStorage.setItem('tenantId', tenantId)

                return mutate()
            })
            .catch(error => {
                if (error.response === undefined) {
                    alert(error)
                    return
                }

                if (error.response.status !== 422) throw error

                for (let [key, err] of Object.entries(
                    error.response.data.errors,
                )) {
                    setError(key, { type: 'string', message: err[0] })
                }
            })
            .finally(() => {
                if (callback) {
                    callback()
                }
            })
    }

    const login = async ({ setError, callback, ...props }) => {
        await csrf()
        axios
            .post('/login', props)
            .then(data => {
                const tenantId = data?.data?.tenant_id

                if (!tenantId) {
                    throw new Error('User is not associated with a tenant')
                }

                localStorage.setItem('tenantId', tenantId)

                return mutate()
            })
            .catch(error => {
                if (!error.response.data.errors) {
                    alert(error)
                    return
                }

                if (error.response === undefined) {
                    alert(error)
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
                    error.response.data.errors,
                )) {
                    setError(key, { message: value })
                }
            })
            .finally(() => {
                if (callback) {
                    callback()
                }
            })
    }

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf()
        setErrors([])
        setStatus(null)

        axios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response === undefined) {
                    alert(error)
                    return
                }

                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        await csrf()
        setErrors([])
        setStatus(null)

        axios
            .post('/reset-password', { token: router.query.token, ...props })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status)),
            )
            .catch(error => {
                if (error.response === undefined) {
                    alert(error)
                    return
                }

                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resendEmailVerification = ({ setStatus }) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        if (!error) {
            await axios
                .post('/logout')
                .then(() => {
                    localStorage.removeItem('tenantId')

                    return mutate()
                })
                .catch(error => {
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
