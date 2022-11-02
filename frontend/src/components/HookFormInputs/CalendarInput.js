import { Controller } from 'react-hook-form'
import { classNames } from 'primereact/utils'
import React from 'react'
import { Calendar } from 'primereact/calendar'

const TextInput = ({ control, name, rules, label, showTime }) => {
    return (
        <span className="p-float-label">
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { onChange, value, name }, fieldState }) => (
                    <Calendar
                        id={name}
                        value={value}
                        showTime={showTime}
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
