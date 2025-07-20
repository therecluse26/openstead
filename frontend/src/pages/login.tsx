import React from 'react'
import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'
import { Button } from 'primereact/button'
import { Controller, useForm, FieldErrors } from 'react-hook-form'
import { classNames } from 'primereact/utils'
import { Password } from 'primereact/password'
import { useAuth } from '@/hooks/auth'
import GuestLayout from '@/components/AppBase/Layouts/GuestLayout'
import Link from 'next/link'
import type { NextPage } from 'next'

interface LoginFormData {
    email: string
    password: string
    remember_me: boolean
}

const Login: NextPage = () => {
    const [loggingIn, setLoggingIn] = React.useState<boolean>(false)

    const defaultValues: LoginFormData = {
        email: '',
        password: '',
        remember_me: false,
    }
    const {
        control,
        formState: { errors },
        handleSubmit,
        setError,
    } = useForm<LoginFormData>({ defaultValues })

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/',
    })

    const onSubmit = (data: LoginFormData) => {
        setLoggingIn(true)
        login({
            email: data.email,
            password: data.password,
            remember: data.remember_me,
            setError,
            callback: () => setLoggingIn(false),
        })
    }

    const getFormErrorMessage = (name: keyof LoginFormData) => {
        return (
            errors[name] && (
                <small className="p-error">{errors[name]?.message}</small>
            )
        )
    }

    return (
        <GuestLayout>
            <h3 className="text-center">Openstead</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                <div className="field">
                    <span className="p-float-label p-input-icon-right">
                        <i className="ti ti-mail" />
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: 'Email is required.',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: 'Invalid email address',
                                },
                            }}
                            render={({
                                field: { onChange, value, name },
                                fieldState,
                            }) => (
                                <InputText
                                    id={name}
                                    value={value}
                                    className={classNames({
                                        'p-invalid': fieldState.invalid,
                                    })}
                                    onChange={onChange}
                                />
                            )}
                        />
                        <label
                            htmlFor="email"
                            className={classNames({
                                'p-error': !!errors.email,
                            })}>
                            Email
                        </label>
                    </span>
                    {getFormErrorMessage('email')}
                </div>
                <div className="field">
                    <span className="p-float-label">
                        <Controller
                            name="password"
                            control={control}
                            rules={{
                                required: 'Password is required.',
                            }}
                            render={({
                                field: { onChange, value, name },
                                fieldState,
                            }) => (
                                <Password
                                    id={name}
                                    value={value}
                                    toggleMask
                                    icon={<i className="ti ti-key" />}
                                    className={classNames({
                                        'p-invalid': fieldState.invalid,
                                    })}
                                    onChange={onChange}
                                    feedback={false}
                                />
                            )}
                        />
                        <label
                            htmlFor="password"
                            className={classNames({
                                'p-error': errors.password,
                            })}>
                            Password
                        </label>
                    </span>
                    {getFormErrorMessage('password')}
                </div>

                <div className="field">
                    <div className="field-checkbox">
                        <Controller
                            name="remember_me"
                            control={control}
                            render={({
                                field: { name, value, onChange },
                                fieldState,
                            }) => (
                                <Checkbox
                                    inputId={name}
                                    value={value}
                                    onChange={onChange}
                                    checked={value}
                                    className={classNames({
                                        'p-invalid': fieldState.invalid,
                                    })}
                                />
                            )}
                        />
                        <label
                            htmlFor="remember_me"
                            className={classNames({
                                'p-error': errors.accept,
                            })}>
                            &nbsp;Remember me
                        </label>
                    </div>
                </div>

                {loggingIn ? (
                    <>
                        <Button
                            icon="loading-spinner"
                            className="mt-2 w-full"
                        />
                    </>
                ) : (
                    <>
                        <div className="field">
                            <Link href="/register">
                                Or Register a New Account
                            </Link>
                        </div>

                        <Button type="submit" label="Login" className="mt-2" />
                    </>
                )}
            </form>
        </GuestLayout>
    )
}

export default Login
