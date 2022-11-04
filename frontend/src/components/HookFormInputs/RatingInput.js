import { Controller } from 'react-hook-form'
import React from 'react'
import { Rating } from 'primereact/rating'

const TextInput = ({ control, name, rules, label }) => {
    return (
        <span className="p-float-label">
            <p>{label}</p>

            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { onChange, value, name } }) => (
                    <Rating id={name} value={value ?? ''} onChange={onChange} />
                )}
            />
        </span>
    )
}

export default TextInput
