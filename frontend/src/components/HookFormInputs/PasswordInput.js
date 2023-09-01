import { Controller } from 'react-hook-form'
import { Password } from 'primereact/password'

import { classNames } from 'primereact/utils'
import React from 'react'

const PasswordInput = ({
    control,
    name,
    rules,
    label,
    defaultValue,
    hidden = false,
}) => {
    return (
        <span className="p-float-label">
            <Controller
                name={name}
                control={control}
                rules={rules}
                defaultValue={defaultValue}
                render={({ field: { onChange, value, name }, fieldState }) => (
                    <Password
                        id={name}
                        value={value ?? ''}
                        className={classNames({
                            'p-invalid': fieldState.error,
                        })}
                        onChange={onChange}
                        hidden={hidden}
                        toggleMask
                    />
                )}
            />
            <label htmlFor={name}>{label}</label>
        </span>
    )
}

export default PasswordInput
