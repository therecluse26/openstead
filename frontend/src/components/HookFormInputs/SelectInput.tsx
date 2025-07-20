import { Controller, Control, RegisterOptions } from 'react-hook-form'
import { classNames } from 'primereact/utils'
import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { getOptionsFromUrl } from '@/components/EditableFields/EditableFieldService'
import { SelectOption } from '@/types/Common'

interface SelectInputProps {
    optionLabel?: string
    optionValue?: string
    dataLabelKey?: string
    dataValueKey?: string
    options?: SelectOption[]
    optionsEndpoint?: string | false
    control: Control<any>
    name: string
    rules?: RegisterOptions
    label: string
    invalidateOnChange?: any
    groupSetter?: (group: any) => void
    selected?: any
}

const SelectInput: React.FC<SelectInputProps> = ({
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
    selected = null,
}) => {
    const [selectOptions, setSelectOptions] = useState<
        SelectOption[] | undefined
    >(options)

    const findGroup = (value: any): any => {
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
                    <>
                        <Dropdown
                            id={name}
                            value={selected ? selected : value}
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
                    </>
                )}
            />
            <label htmlFor={name}>{label}</label>
        </span>
    )
}

export default SelectInput
