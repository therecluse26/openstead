import { Controller, Control, RegisterOptions } from 'react-hook-form'
import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'
import React from 'react'

interface TextInputProps {
    control: Control<any>
    name: string
    rules?: RegisterOptions
    label: string
    defaultValue?: string
    disabled?: boolean
    hidden?: boolean
}

const TextInput: React.FC<TextInputProps> = ({
    control,
    name,
    rules,
    label,
    defaultValue,
    disabled = false,
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
                    <InputText
                        id={name}
                        value={value ?? ''}
                        className={classNames({
                            'p-invalid': fieldState.error,
                        })}
                        onChange={onChange}
                        hidden={hidden}
                        disabled={disabled}
                    />
                )}
            />
            <label htmlFor={name}>{label}</label>
        </span>
    )
}

export default TextInput
