import { Controller } from 'react-hook-form'
import { classNames } from 'primereact/utils'
import React from 'react'
import RichEditor from '../RichEditor'

const RichTextInput = ({
    control,
    name,
    rules,
    label,
    defaultValue,
    hidden = false,
}) => {
    return (
        <>
            <span className="p-float-label">
                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    defaultValue={defaultValue}
                    render={({
                        field: { onChange, value, name },
                        fieldState,
                    }) => (
                        <RichEditor
                            id={name}
                            text={value ?? ''}
                            className={classNames({
                                'p-invalid': fieldState.error,
                            })}
                            onTextChange={onChange}
                            hidden={hidden}
                        />
                    )}
                />
                <label htmlFor={name}>{label}</label>
            </span>
        </>
    )
}

export default RichTextInput
