import { Controller } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import {
    MultiSelect,
    MultiSelectItemTemplateType,
    MultiSelectDisplayType,
} from 'primereact/multiselect'
import { getOptionsFromUrl } from '@/components/EditableFields/EditableFieldService'
import { classNames } from 'primereact/utils'

type MultiSelectProps = {
    control: any
    name: string
    rules: any
    label: string
    placeholder?: string
    value?: Array<any> // Selected values
    options?: Array<any> // Available options
    optionsEndpoint?: string
    optionValue?: string
    optionLabel?: string
    dataLabelKey?: string
    dataValueKey?: string
    itemTemplate?: MultiSelectItemTemplateType
    filter?: boolean
    display: MultiSelectDisplayType
    onChange?: (event: any) => void
}

const MultiselectInput = (props: MultiSelectProps) => {
    const [selectOptions, setSelectOptions] = useState(props.options)
    const display = props.display ?? 'chip'
    const optLabel = props.optionLabel ?? 'label'
    const optValue = props.optionValue ?? 'value'

    useEffect(() => {
        if (props.options) {
            setSelectOptions(props.options)
        }
    }, [props.options])

    useEffect(() => {
        if (props.optionsEndpoint) {
            getOptionsFromUrl(
                props.optionsEndpoint,
                optLabel,
                optValue,
                setSelectOptions,
                props.dataLabelKey,
                props.dataValueKey,
            )
        }
    }, [props.optionsEndpoint])

    return (
        <span className="p-float-label">
            <Controller
                name={props.name}
                control={props.control}
                rules={props.rules}
                render={({ field: { onChange, value, name }, fieldState }) => (
                    <MultiSelect
                        id={name}
                        placeholder={props.placeholder}
                        value={value ?? props.value ?? []}
                        options={selectOptions}
                        optionValue={optValue}
                        optionLabel={optLabel}
                        itemTemplate={props.itemTemplate}
                        filter={props.filter}
                        className={classNames({
                            'p-invalid': fieldState.error,
                        })}
                        onChange={onChange}
                        display={display}
                    />
                )}
            />
            <label htmlFor={props.name}>{props.label}</label>
        </span>
    )
}

export default MultiselectInput
