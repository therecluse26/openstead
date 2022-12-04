import { Controller } from 'react-hook-form'
import { classNames } from 'primereact/utils'
import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import axios from '@/lib/axios'

const SelectInput = ({
    optionLabel = 'label',
    options,
    optionsEndpoint = false,
    control,
    name,
    rules,
    label,
    invalidateOnChange,
}) => {
    const [selectOptions, setSelectOptions] = useState(options)

    const getOptions = async () => {
        if (optionsEndpoint) {
            return await axios
                .get(optionsEndpoint)
                .then(res => res.data)
                .then(data => {
                    if (typeof data !== 'undefined') {
                        if (
                            Object.prototype.hasOwnProperty.call(data, 'data')
                        ) {
                            setSelectOptions(
                                data?.data?.map(t => {
                                    return {
                                        label: t[optionLabel],
                                        value: t.key,
                                    }
                                }),
                            )
                        } else {
                            setSelectOptions(
                                data?.map(t => {
                                    return {
                                        label: t[optionLabel],
                                        value: t.key,
                                    }
                                }),
                            )
                        }
                    }
                })
                .catch(e => {
                    console.error(e)
                })
        }
    }

    useEffect(() => {
        if (optionsEndpoint) {
            getOptions()
        }
    }, [optionsEndpoint, invalidateOnChange])

    return (
        <span className="p-float-label">
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { onChange, value, name }, fieldState }) => (
                    <Dropdown
                        id={name}
                        value={value}
                        options={selectOptions?.map(o => {
                            return { label: o.label, value: o.value }
                        })}
                        className={classNames({
                            'p-invalid': fieldState.invalid,
                        })}
                        onChange={onChange}
                    />
                )}
            />
            <label htmlFor={name}>{label}</label>
        </span>
    )
}

export default SelectInput
