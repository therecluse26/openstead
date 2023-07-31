import { Controller } from 'react-hook-form'
import { classNames } from 'primereact/utils'
import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { getOptionsFromUrl } from '../Custom/Services/EditableFieldService'

const SelectInput = ({
    optionLabel = 'label',
    optionValue = 'value',
    dataLabelKey = 'label',
    dataValueKey = 'value',
    options,
    optionsEndpoint = false,
    control,
    name,
    rules,
    label,
    invalidateOnChange,
    groupSetter,
}) => {
    const [selectOptions, setSelectOptions] = useState(options)

    const findGroup = value => {
        return selectOptions?.find(o => o.value === value)?.group
    }

    useEffect(() => {
        if (optionsEndpoint) {
            getOptionsFromUrl(
                optionsEndpoint,
                optionLabel,
                optionValue,
                setSelectOptions,
                dataLabelKey,
                dataValueKey,
            )
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
                        optionLabel={optionLabel}
                        optionValue={optionValue}
                        options={selectOptions?.map(o => {
                            return {
                                [dataLabelKey]: o[optionLabel],
                                [dataValueKey]: o[optionValue],
                            }
                        })}
                        className={classNames({
                            'p-invalid': fieldState.invalid,
                        })}
                        onChange={({ value }) => {
                            onChange(value)
                            if (groupSetter) {
                                groupSetter(findGroup(value))
                            }
                        }}
                    />
                )}
            />
            <label htmlFor={name}>{label}</label>
        </span>
    )
}

export default SelectInput
