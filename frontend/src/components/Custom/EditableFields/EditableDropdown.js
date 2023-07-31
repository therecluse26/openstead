import { useEffect, useState } from 'react'
import Spinner from '../../Spinner'
import { Dropdown } from 'primereact/dropdown'
import {
    getOptionsFromUrl,
    updateField,
} from '../Services/EditableFieldService'

export default function EditableDropdown({
    value, // The value of the field
    optionLabel = 'name', // The label of the dropdown option
    optionValue = 'id', // The value of the dropdown option
    dataLabel = 'name', // The label of the data
    dataValue = 'id', // The value of the data
    options, // The options to display in the dropdown
    optionsUrl, // The URL to fetch the options from
    model, // The model to update
    modelId, // The ID of the model to update
    field, // The field of the matched model to to update
    onChange = () => {}, // The function to call when the value is updated
    onError = () => {}, // The function to call when an error occurs
}) {
    const [loading, setLoading] = useState(false)
    const [localValue, setLocalValue] = useState(value)
    const [displayedValue, setDisplayedValue] = useState(
        value ? value[optionLabel] : '',
    )
    const [isEditing, setIsEditing] = useState(false)

    const [dropdownOptions, setDropdownOptions] = useState(options)

    const getOptions = async () => {
        await getOptionsFromUrl(
            optionsUrl,
            optionLabel,
            optionValue,
            setDropdownOptions,
            dataLabel,
            dataValue,
        ).catch(e => {
            onError(e)
        })
    }

    useEffect(() => {
        if (optionsUrl) {
            getOptions()
        }
    }, [optionsUrl])

    const handleOnclick = () => {
        setIsEditing(true)
    }

    const updateValue = async newValue => {
        // If the value hasn't changed, don't do anything
        if (newValue === localValue[optionValue]) {
            return
        }
        setLoading(true)

        // Update the value in the database
        try {
            const updatedValue = await updateField(
                model,
                modelId,
                field,
                newValue,
            )
            onChange(dropdownOptions.find(o => o[optionValue] === updatedValue))
        } catch (e) {
            onError(e)
        }
        setIsEditing(false)
        setLoading(false)
    }

    useEffect(() => {
        setLocalValue(value)
        setDisplayedValue(value ? value[optionLabel] : '')
    }, [value])

    return (
        <>
            {loading ? (
                <div className="p-d-flex p-jc-center">
                    <div className="p-m-2">
                        <Spinner />
                    </div>
                </div>
            ) : (
                <>
                    {isEditing ? (
                        <div>
                            <div className="p-inputgroup">
                                <Dropdown
                                    className="border-round-md"
                                    options={dropdownOptions}
                                    value={localValue}
                                    onChange={e => {
                                        updateValue(e.target.value)
                                        setIsEditing(false)
                                    }}
                                    optionValue={optionValue}
                                    optionLabel={optionLabel}
                                    autoFocus
                                    width={'100%'}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div
                                className="editable-select-container hover:text-primary cursor-pointer"
                                onClick={handleOnclick}>
                                {displayedValue} &nbsp;{' '}
                                <i className="ti ti-edit" />
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    )
}
