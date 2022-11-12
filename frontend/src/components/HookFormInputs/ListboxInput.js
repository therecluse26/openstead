import { Controller } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { ListBox } from 'primereact/listbox'
import { classNames } from 'primereact/utils'

const ListboxInput = ({
    className,
    options,
    optionsEndpoint = false,
    control,
    name,
    rules,
    label,
    invalidateOnChange,
    optionLabel,
    customOnChange,
    multiple = true,
    filter = true,
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
                                    return { label: t.label, value: t.key }
                                }),
                            )
                        } else {
                            setSelectOptions(
                                data?.map(t => {
                                    return { label: t.label, value: t.key }
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
        <>
            {label && <p>{label}</p>}
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { onChange, value, name }, fieldState }) => (
                    <ListBox
                        id={name}
                        value={value}
                        options={selectOptions}
                        dataKey={'key'}
                        onChange={e => {
                            customOnChange
                                ? customOnChange(e, onChange)
                                : onChange(e)
                        }}
                        multiple={multiple}
                        filter={filter}
                        optionLabel={optionLabel ?? ''}
                        className={classNames(className, {
                            'p-invalid': fieldState.invalid,
                        })}
                        listStyle={{ maxHeight: '200px' }}
                    />
                )}
            />
        </>
    )
}

export default ListboxInput
