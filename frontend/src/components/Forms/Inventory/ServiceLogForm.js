import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import SelectInput from '@/components/HookFormInputs/SelectInput'
import TextAreaInput from '@/components/HookFormInputs/TextAreaInput'
import CalendarInput from '@/components/HookFormInputs/CalendarInput'
import { useRouter } from 'next/router'
import { csrf } from '@/hooks/auth'
import AddErrorToasts from '@/utils/AddErrorToasts'
import ToastContext, { useToastContext } from '@/context/ToastContext'
import EquipmentService from '@/services/inventory/EquipmentService'
import { Dialog } from 'primereact/dialog'

import TextInput from '@/components/HookFormInputs/TextInput'

const ServiceLogForm = () => {
    const isMounted = useRef(false)
    const [addServiceFormVisible, setAddServiceFormVisible] = useState(false)
    const router = useRouter()
    const toast = useToastContext(ToastContext)
    const [newServiceId, setNewServiceId] = useState(null)
    const { query, isReady } = useRouter()
    const { id } = query

    const {
        control,
        formState: { errors },
        handleSubmit,
        watch,
        setValue,
    } = useForm({
        type: null,
        notes: null,
        service_date: null,
        service_id: null,
    })
    const watchType = watch('type')

    const {
        control: serviceControl,
        formState: { errors: serviceErrors },
        handleSubmit: serviceHandleSubmit,
        reset: serviceFormReset,
    } = useForm({
        type: null,
        title: null,
        description: null,
    })

    useEffect(() => {
        if (!isReady || !id) {
            return
        }
        isMounted.current = true
    }, [id])

    const getFormErrorMessage = name => {
        return (
            errors[name] && (
                <small className="p-error">{errors[name].message}</small>
            )
        )
    }

    const getServiceFormErrorMessage = name => {
        return (
            serviceErrors[name] && (
                <small className="p-error">{serviceErrors[name].message}</small>
            )
        )
    }

    const onSubmit = async data => {
        await csrf()
        EquipmentService.addServiceLog(id, data)
            .then(() => {
                router.push(`/inventory/equipment/${id}`)
            })
            .catch(error => {
                AddErrorToasts(toast, error)
            })
    }

    const onSubmitNewService = async data => {
        await csrf()
        EquipmentService.addService(id, data)
            .then(r => {
                // Reload services list
                setNewServiceId(r?.data?.id)
                setValue('service_id', r?.data?.id)
                setAddServiceFormVisible(false)
                serviceFormReset()
            })
            .catch(error => {
                AddErrorToasts(toast, error)
            })
    }

    return (
        <>
            <div className={'justify-content-center align-content-center grid'}>
                <div className={'col-5'}>
                    <h3 className={'text-center'}>Add New Service Log</h3>
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                <div
                    className={
                        'justify-content-center align-content-center grid'
                    }>
                    <div className={'col-5'}>
                        <Card>
                            <div className="field">
                                <SelectInput
                                    optionsEndpoint={'/api/services/types'}
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
                                            optionsEndpoint={`/api/services/types/${watchType}/services`}
                                            control={control}
                                            name={'service_id'}
                                            label={'Service'}
                                            rules={{
                                                required:
                                                    'Service is required.',
                                            }}
                                            invalidateOnChange={newServiceId}
                                        />{' '}
                                        <Button
                                            className={'w-2'}
                                            label="+ New"
                                            onClick={() => {
                                                setAddServiceFormVisible(true)
                                            }}
                                        />
                                    </div>
                                    {getFormErrorMessage('service_id')}
                                </div>
                            ) : null}

                            <div className={'field'}>
                                <TextAreaInput
                                    control={control}
                                    name={'notes'}
                                    label={'Notes'}
                                    rules={{
                                        required: 'Notes are required.',
                                    }}
                                    rows={8}
                                    cols={30}
                                    autoResize
                                />
                            </div>
                            <div className="field">
                                <CalendarInput
                                    control={control}
                                    showTime={true}
                                    name={'service_date'}
                                    label={'Service Date'}
                                    rules={{
                                        required: 'Service date is required.',
                                    }}
                                />
                                {getFormErrorMessage('service_date')}
                            </div>
                        </Card>
                        <Button type="submit" label="Save" className="mt-2" />
                    </div>
                </div>
            </form>
            <Dialog
                header={`Add New Service`}
                visible={addServiceFormVisible}
                style={{ width: '50vw' }}
                onHide={() => {
                    setAddServiceFormVisible(false)
                }}
                closable={true}>
                <div>
                    <h5>
                        Type: {watchType ? watchType.toUpperCase() + ' ' : ''}
                    </h5>
                    <form
                        onSubmit={serviceHandleSubmit(onSubmitNewService)}
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
                            {getServiceFormErrorMessage('title')}
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
                        {getServiceFormErrorMessage('description')}
                        <Button type="submit" label="Save" className="mt-2" />
                    </form>
                </div>
            </Dialog>
        </>
    )
}

export default React.memo(ServiceLogForm)
