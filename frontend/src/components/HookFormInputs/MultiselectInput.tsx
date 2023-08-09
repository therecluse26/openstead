import { Controller } from 'react-hook-form'
import React from 'react'
import {
    MultiSelect,
    MultiSelectItemTemplateType,
    MultiSelectDisplayType,
} from 'primereact/multiselect'

type MultiSelectProps = {
    control: any
    name: string
    rules: any
    label: string
    placeholder?: string
    options?: Array<any>
    optionValue?: string
    optionLabel?: string
    value?: Array<any>
    itemTemplate?: MultiSelectItemTemplateType
    filter?: boolean
    display: MultiSelectDisplayType
    onChange?: (event: any) => void
}

const PicklistInput = (props: MultiSelectProps) => {
    const display = props.display ?? 'chip'
    const optLabel = props.optionLabel ?? 'label'
    const optValue = props.optionValue ?? 'value'

    return (
        <span className="p-float-label">
            <Controller
                name={props.name}
                control={props.control}
                rules={props.rules}
                render={() => (
                    <MultiSelect
                        placeholder={props.placeholder}
                        value={props.value}
                        options={props.options}
                        optionValue={optValue}
                        optionLabel={optLabel}
                        itemTemplate={props.itemTemplate}
                        filter={props.filter}
                        onChange={e => {
                            props.onChange(e)
                        }}
                        display={display}
                    />
                )}
            />
            <label htmlFor={props.name}>{props.label}</label>
        </span>
    )
}

export default PicklistInput
