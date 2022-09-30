import { Controller } from 'react-hook-form'
import { classNames } from 'primereact/utils'
import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import axios from '@/lib/axios'

const SelectInput = ({
    options,
    optionsEndpoint,
    control,
    name,
    rules,
    label,
}) => {
    const [selectOptions, setSelectOptions] = useState(options)

    const getOptions = () => {
        return axios
            .get(optionsEndpoint)
            .then(res => res.data)
            .then(data => {
                setSelectOptions(
                    data.map(t => {
                        if (typeof t === 'object') {
                            return t
                        }
                        return { label: t, value: t }
                    }),
                )
            })
    }

    useEffect(() => {
        if (optionsEndpoint) {
            getOptions()
        }
    }, [optionsEndpoint])

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
