import ApplicationLogo from '@/components/AppBase/ApplicationLogo'
import AuthCard from '@/components/Authentication/AuthCard'
import AuthSessionStatus from '@/components/Authentication/AuthSessionStatus'
import Button from '@/components/Button'
import GuestLayout from '@/components/AppBase/Layouts/GuestLayout'

import { InputText } from 'primereact/inputtext'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import type { NextPage } from 'next'
import type { FormEvent, ChangeEvent } from 'react'

interface ValidationErrors {
    email?: string[]
    password?: string[]
    password_confirmation?: string[]
}

const PasswordReset: NextPage = () => {
    const router = useRouter()
    const { token } = router.query

    const { resetPassword } = useAuth({ middleware: 'guest' })

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('')
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [status, setStatus] = useState<string | null>(null)

    const submitForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        resetPassword({
            email,
            password,
            password_confirmation: passwordConfirmation,
            token: token as string,
            setErrors,
            setStatus,
        })
    }

    useEffect(() => {
        setEmail(router.query.email || '')
    }, [router.query.email])

    return (
        <GuestLayout>
            <AuthCard
                logo={
                    <Link href="/">
                        <a>
                            <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                        </a>
                    </Link>
                }>
                {/* Session Status */}
                <AuthSessionStatus className="mb-4" status={status} />

                <form onSubmit={submitForm}>
                    {/* Email Address */}
                    <div>
                        <Label htmlFor="email">Email</Label>

                        <InputText
                            id="email"
                            type="email"
                            value={email}
                            className="block mt-1 w-full"
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                setEmail(event.target.value)
                            }
                            required
                            autoFocus
                        />

                        <InputError messages={errors.email} className="mt-2" />
                    </div>

                    {/* Password */}
                    <div className="mt-4">
                        <Label htmlFor="password">Password</Label>
                        <InputText
                            id="password"
                            type="password"
                            value={password}
                            className="block mt-1 w-full"
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                setPassword(event.target.value)
                            }
                            required
                        />

                        <InputError
                            messages={errors.password}
                            className="mt-2"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="mt-4">
                        <Label htmlFor="passwordConfirmation">
                            Confirm Password
                        </Label>

                        <InputText
                            id="passwordConfirmation"
                            type="password"
                            value={passwordConfirmation}
                            className="block mt-1 w-full"
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                setPasswordConfirmation(event.target.value)
                            }
                            required
                        />

                        <InputError
                            messages={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        <Button>Reset Password</Button>
                    </div>
                </form>
            </AuthCard>
        </GuestLayout>
    )
}

export default PasswordReset
