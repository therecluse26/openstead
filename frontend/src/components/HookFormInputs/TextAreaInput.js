import { Controller } from 'react-hook-form'
import { classNames } from 'primereact/utils'
import React from 'react'
import { InputTextarea } from 'primereact/inputtextarea'

const TextAreaInput = ({
    control,
    name,
    rules,
    label,
    rows = 8,
    cols = 30,
    autoResize = false,
}) => {
    return (
        <span className="p-float-label">
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { onChange, value, name }, fieldState }) => (
                    <InputTextarea
                        id={name}
                        value={value ?? ''}
                        className={classNames({
                            'p-invalid': fieldState.error,
                        })}
                        onChange={onChange}
                        rows={rows}
                        cols={cols}
                        autoResize={autoResize}
                    />
                )}
            />
            <label htmlFor={name}>{label}</label>
        </span>
    )
}

export default TextAreaInput
