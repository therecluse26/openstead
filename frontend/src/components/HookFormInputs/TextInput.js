import { Controller } from 'react-hook-form'
import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'
import React from 'react'

const TextInput = ({ control, name, rules, label, defaultValue }) => {
    return (
        <span className="p-float-label">
            <Controller
                name={name}
                control={control}
                rules={rules}
                defaultValue={defaultValue}
                render={({ field: { onChange, value, name }, fieldState }) => (
                    <InputText
                        id={name}
                        value={value ?? ''}
                        className={classNames({
                            'p-invalid': fieldState.error,
                        })}
                        onChange={onChange}
                    />
                )}
            />
            <label htmlFor={name}>{label}</label>
        </span>
    )
}

export default TextInput
