import { Controller, Control, RegisterOptions } from 'react-hook-form'
import { classNames } from 'primereact/utils'
import React from 'react'
import { InputNumber } from 'primereact/inputnumber'

interface NumberInputProps {
    control: Control<any>
    name: string
    rules?: RegisterOptions
    label: string
    mode?: string
    step?: number
    showButtons?: boolean
    min?: number
    max?: number
}

const NumberInput: React.FC<NumberInputProps> = ({
    control,
    name,
    rules,
    label,
    mode,
    step,
    showButtons,
    min,
    max,
}) => {
    return (
        <span className="p-float-label">
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { onChange, value, name }, fieldState }) => (
                    <InputNumber
                        id={name}
                        value={value}
                        defaultValue={value}
                        mode={mode}
                        className={classNames({
                            'p-invalid': fieldState.error,
                        })}
                        onValueChange={onChange}
                        showButtons={showButtons}
                        step={step}
                        min={min ?? 0}
                        max={max ?? null}
                        buttonLayout="horizontal"
                        incrementButtonIcon="ti ti-plus"
                        decrementButtonIcon="ti ti-minus"
                    />
                )}
            />
            <label htmlFor={name}>{label}</label>
        </span>
    )
}

export default NumberInput
