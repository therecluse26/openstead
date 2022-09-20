import React from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Controller, useForm } from 'react-hook-form'
import { classNames } from 'primereact/utils'
import { Password } from 'primereact/password'
import { useAuth } from '@/hooks/auth'
import GuestLayout from '@/components/Layouts/GuestLayout'
import Link from 'next/link'

const Register = () => {
    const defaultValues = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    }
    const {
        control,
        formState: { errors },
        handleSubmit,
        setError,
        watch,
    } = useForm({ defaultValues })

    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/',
    })

    const onSubmit = data => {
        register({
            name: data.name,
            email: data.email,
            password: data.password,
            password_confirmation: data.password_confirmation,
            setError,
        })
    }

    const getFormErrorMessage = name => {
        return (
            errors[name] && (
                <small className="p-error">{errors[name].message}</small>
            )
        )
    }

    return (
        <GuestLayout>
            <h3 className="text-center">Openstead</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                <div className="field">
                    <span className="p-float-label p-input-icon-right">
                        <i className="ti ti-user" />
                        <Controller
                            name="name"
                            control={control}
                            rules={{
                                required: 'Name is required.',
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
                            Name
                        </label>
                    </span>
                    {getFormErrorMessage('email')}
                </div>

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
                    <span className="p-float-label">
                        <Controller
                            name="password_confirmation"
                            control={control}
                            rules={{
                                required: 'Password confirmation is required.',
                                validate: val => {
                                    if (watch('password') != val) {
                                        return 'Your passwords do no match'
                                    }
                                },
                            }}
                            render={({
                                field: { onChange, value, name },
                                fieldState,
                            }) => (
                                <Password
                                    id={name}
                                    value={value}
                                    toggleMask
                                    icon={<i className="ti ti-copy" />}
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
                            Confirm Password
                        </label>
                    </span>
                    {getFormErrorMessage('password_confirmation')}
                </div>

                <div className="field">
                    <Link href="/login">
                        Have an Account? Click here to login
                    </Link>
                </div>

                <Button type="submit" label="Register" className="mt-2" />
            </form>
        </GuestLayout>
    )
}

export default Register
