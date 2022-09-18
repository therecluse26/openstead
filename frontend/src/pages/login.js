import React, { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'
import { Button } from 'primereact/button'
import { Controller, useForm } from 'react-hook-form'
import { classNames } from 'primereact/utils'
import { Password } from 'primereact/password'
import { useAuth } from '@/hooks/auth'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState(null)
    const defaultValues = {
        email: '',
        password: '',
        remember_me: false,
    }
    const {
        control,
        formState: { errors },
        handleSubmit,
        setError,
        setValue,
    } = useForm({ defaultValues })

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/',
    })

    const onSubmit = data => {
        login({
            email: data.email,
            password: data.password,
            remember: data.remember_me,
            setError,
            setStatus,
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
        <div className="login-form">
            <div className="flex justify-content-center">
                <div className="card">
                    <h5 className="text-center">Openstead</h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-envelope" />
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
                                    onChange={([selectedValue]) => {
                                        setValue(email, selectedValue)
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
                                    value={password}
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

                        <div className="field-checkbox">
                            <Controller
                                name="remember_me"
                                control={control}
                                onChange={([selectedValue]) => {
                                    setValue('remember_me', selectedValue)
                                }}
                                render={({
                                    field: { name, value, onChange },
                                    fieldState,
                                }) => (
                                    <Checkbox
                                        inputId={name}
                                        // onChange={e =>
                                        //     field.onChange(e.checked)
                                        // }
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
                                Remember me
                            </label>
                        </div>

                        <Button type="submit" label="Login" className="mt-2" />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
