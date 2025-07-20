import { Controller, Control, RegisterOptions } from 'react-hook-form'
import { classNames } from 'primereact/utils'
import React from 'react'
import { Calendar } from 'primereact/calendar'

interface CalendarInputProps {
    control: Control<any>
    name: string
    rules?: RegisterOptions
    label: string
    showTime?: boolean
}

const CalendarInput: React.FC<CalendarInputProps> = ({
    control,
    name,
    rules,
    label,
    showTime,
}) => {
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

export default CalendarInput
