import ApplicationLogo from '@/components/AppBase/ApplicationLogo'
import AuthCard from '@/components/Authentication/AuthCard'
import AuthSessionStatus from '@/components/Authentication/AuthSessionStatus'
import Button from '@/components/Button'
import GuestLayout from '@/components/AppBase/Layouts/GuestLayout'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import React, { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import type { NextPage } from 'next'
import type { FormEvent } from 'react'

interface ValidationErrors {
    email?: string[]
}

const ForgotPassword: NextPage = () => {
    const { forgotPassword } = useAuth({ middleware: 'guest' })

    const [email, setEmail] = useState<string>('')
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [status, setStatus] = useState<string | null>(null)

    const submitForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        forgotPassword({ email, setErrors, setStatus })
    }

    return (
        <GuestLayout>
            <AuthCard
                logo={
                    <Link href="/frontend/src/pages">
                        <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                    </Link>
                }>
                <div className="mb-4 text-sm text-gray-600">
                    Forgot your password? No problem. Just let us know your
                    email address and we will email you a password reset link
                    that will allow you to choose a new one.
                </div>

                {/* Session Status */}
                <AuthSessionStatus className="mb-4" status={status} />

                <form onSubmit={submitForm}>
                    {/* Email Address */}
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <InputText
                            id="email"
                            type="email"
                            name="email"
                            value={email}
                            className="block mt-1 w-full"
                            onChange={event => setEmail(event.target.value)}
                            required
                            autoFocus
                        />

                        <InputError messages={errors.email} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        <Button>Email Password Reset Link</Button>
                    </div>
                </form>
            </AuthCard>
        </GuestLayout>
    )
}

export default ForgotPassword
