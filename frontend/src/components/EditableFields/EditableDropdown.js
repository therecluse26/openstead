import { useEffect, useState } from 'react'
import Spinner from '../Spinner'
import { Dropdown } from 'primereact/dropdown'
import { getOptionsFromUrl, updateField } from './EditableFieldService'
import { IconEdit } from '@tabler/icons'

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
    before = <div />, // The component to display before the value
    after = <IconEdit size={12} />, // The icon to display when not editing
    placeholder = 'Select an option', // The placeholder to display when editing
    onChange = () => {}, // The function to call when the value is updated
    onError = () => {}, // The function to call when an error occurs
    noValueLabel = 'Unknown', // The label to display when there is no value
    showEmptyValue = false, // Whether or not to show an empty value
    emptyLabel = 'None', // The label to display when there is no value
    readonly = false, // Whether or not the field is readonly
}) {
    const [loading, setLoading] = useState(false)
    const [localValue, setLocalValue] = useState(value)
    const [displayedValue, setDisplayedValue] = useState(
        value ? value[optionLabel] : '',
    )
    const [optionsFinishedLoading, setOptionsFinishedLoading] = useState(false)
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
            getOptions(showEmptyValue)
        }
    }, [optionsUrl])

    useEffect(() => {
        if (
            dropdownOptions?.length > 0 &&
            showEmptyValue &&
            dropdownOptions[0][dataValue] !== null
        ) {
            let opts = dropdownOptions

            opts.unshift({
                [dataLabel]: emptyLabel,
                [dataValue]: null,
                group: null,
            })

            setDropdownOptions(opts)
        }
    }, [dropdownOptions])

    const handleOnclick = () => {
        if (readonly) {
            return
        }
        setIsEditing(true)
    }

    const updateValue = async newValue => {
        // If the value hasn't changed, don't do anything
        if (localValue && localValue[optionValue] === newValue) {
            return
        }

        // Update the value in the database
        try {
            const updatedValue = await updateField(
                model,
                modelId,
                field,
                newValue,
            )
            onChange(
                updatedValue
                    ? dropdownOptions.find(o => {
                          return o[optionValue] === updatedValue
                      })
                    : null,
            )
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
                                    placeholder={placeholder}
                                    autoFocus
                                    width={'100%'}
                                />
                            </div>
                        </div>
                    ) : (
                        <div
                            className="editable-select-container hover:text-primary cursor-pointer"
                            onClick={handleOnclick}>
                            {before} &nbsp;
                            {displayedValue.trim() !== ''
                                ? displayedValue.trim()
                                : noValueLabel}{' '}
                            {!readonly && <> {after}</>}
                        </div>
                    )}
                </>
            )}
        </>
    )
}
