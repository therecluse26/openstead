import SelectInput from '@/components/HookFormInputs/SelectInput'
import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { csrf } from '@/hooks/auth'
import AddErrorToasts from '@/utils/AddErrorToasts'
import { Controller, useForm } from 'react-hook-form'
import TextInput from '@/components/HookFormInputs/TextInput'
import { Dialog } from 'primereact/dialog'

const AppendableSelect = ({
    ApiService,
    supertype,
    supertypeValueUrl = null,
    control,
    setValue,
    fieldId,
    errors,
    toast,
    watch,
    id,
}) => {
    const [newServiceId, setNewServiceId] = useState(null)
    const [addSupertypeFormVisible, setAddSupertypeFormVisible] = useState(
        false,
    )
    const watchType = watch('type')

    const formattedSuperType = supertype.toUpperCase()

    const supertypeApiUrl = supertypeValueUrl ?? `/api/${supertype}/types`

    const {
        control: serviceControl,
        formState: { errors: supertypeErrors },
        handleSubmit: supertypeHandleSubmit,
        reset: supertypeFormReset,
    } = useForm({
        type: null,
        title: null,
        description: null,
    })

    const getFormErrorMessage = name => {
        return (
            errors[name] && (
                <small className="p-error">{errors[name].message}</small>
            )
        )
    }

    const getSupertypeFormErrorMessage = name => {
        return (
            supertypeErrors[name] && (
                <small className="p-error">
                    {supertypeErrors[name].message}
                </small>
            )
        )
    }

    const onSubmitNewSuperType = async data => {
        await csrf()
        ApiService.addService(id, data)
            .then(r => {
                // Reload services list
                setNewServiceId(r?.data?.id)
                setValue(fieldId, r?.data?.id)
                setAddSupertypeFormVisible(false)
                supertypeFormReset()
            })
            .catch(error => {
                AddErrorToasts(toast, error)
            })
    }
    return (
        <>
            <div className="field">
                <SelectInput
                    optionsEndpoint={supertypeApiUrl}
                    control={control}
                    name={'type'}
                    label={'Type'}
                    rules={{
                        required: 'Type is required.',
                    }}
                />
                {getFormErrorMessage('type')}
            </div>

            {watchType ? (
                <div className="field">
                    <div className="p-inputgroup">
                        <SelectInput
                            optionsEndpoint={`${supertypeApiUrl}/${watchType}/values`}
                            control={control}
                            name={`${supertype}_id`}
                            label={supertype}
                            rules={{
                                required: `${supertype} is required.`,
                            }}
                            invalidateOnChange={newServiceId}
                        />{' '}
                        <Button
                            className={'w-2'}
                            label="+ New"
                            onClick={() => {
                                setAddSupertypeFormVisible(true)
                            }}
                        />
                    </div>
                    {getFormErrorMessage(`${supertype}_id`)}
                </div>
            ) : null}

            <Dialog
                header={`Add New ${formattedSuperType}`}
                visible={addSupertypeFormVisible}
                style={{ width: '50vw' }}
                onHide={() => {
                    setAddSupertypeFormVisible(false)
                }}
                closable={true}>
                <div>
                    <h5>
                        Type: {watchType ? watchType.toUpperCase() + ' ' : ''}
                    </h5>
                    <form
                        onSubmit={supertypeHandleSubmit(onSubmitNewSuperType)}
                        className="p-fluid">
                        <div className={'field'}>
                            <Controller
                                name={'type'}
                                defaultValue={watchType}
                                control={serviceControl}
                                render={({
                                    field: { onChange, value, name },
                                }) => (
                                    <input
                                        id={name}
                                        value={value}
                                        onChange={onChange}
                                        readOnly={true}
                                        hidden={true}
                                    />
                                )}
                            />
                        </div>

                        <div className={'field'}>
                            <TextInput
                                control={serviceControl}
                                name={'title'}
                                label={'Title'}
                                rules={{
                                    required: 'Title is required.',
                                }}
                            />
                            {getSupertypeFormErrorMessage('title')}
                        </div>
                        <div className={'field'}>
                            <TextInput
                                control={serviceControl}
                                name={'description'}
                                label={'Description'}
                                rules={{
                                    required: 'Description is required.',
                                }}
                            />
                        </div>
                        {getSupertypeFormErrorMessage('description')}
                        <Button type="submit" label="Save" className="mt-2" />
                    </form>
                </div>
            </Dialog>
        </>
    )
}

export default AppendableSelect
