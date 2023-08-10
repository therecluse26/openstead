import { Controller } from 'react-hook-form'
import React from 'react'
import { PickList, PickListItemTemplateType } from 'primereact/picklist'

type PicklistInputProps = {
    control: any
    name: string
    rules: any
    label: string
    source?: Array<any>
    sourceHeader?: string
    target?: Array<any>
    targetHeader?: string
    itemTemplate?: PickListItemTemplateType
    sourceSetter?: (values: Array<any>) => void
    targetSetter?: (values: Array<any>) => void
    onChange?: (event: any) => void
}

const PicklistInput = (props: PicklistInputProps) => {
    return (
        <span className="p-float-label">
            <Controller
                name={props.name}
                control={props.control}
                rules={props.rules}
                render={() => (
                    <PickList
                        source={props.source}
                        target={props.target}
                        itemTemplate={props.itemTemplate}
                        sourceHeader={props.sourceHeader}
                        targetHeader={props.targetHeader}
                        showSourceControls={false}
                        showTargetControls={false}
                        onChange={e => {
                            props.targetSetter(e.target)
                            props.sourceSetter(e.source)
                            props.onChange(e)
                        }}
                    />
                )}
            />
            <label htmlFor={props.name}>{props.label}</label>
        </span>
    )
}

export default PicklistInput
