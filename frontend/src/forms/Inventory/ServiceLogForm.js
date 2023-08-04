import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import TextAreaInput from '@/components/HookFormInputs/TextAreaInput'
import CalendarInput from '@/components/HookFormInputs/CalendarInput'
import { useRouter } from 'next/router'
import { csrf } from '@/hooks/auth'
import AddErrorToasts from '@/utils/AddErrorToasts'
import ToastContext, { useToastContext } from '@/context/ToastContext'
import SubtypeSelect from '@/components/HookFormInputs/SubtypeSelect'
import ServiceLogService from '@/services/Inventory/ServiceLogService'

const ServiceLogForm = ({
    inline = false,
    serviceable_type,
    onComplete = () => {},
    onClose = () => {},
}) => {
    const isMounted = useRef(false)
    const router = useRouter()
    const toast = useToastContext(ToastContext)
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

    const onSubmit = async data => {
        await csrf()
        data['serviceable_type'] = serviceable_type
        ServiceLogService.addServiceLog(id, data)
            .then(() => {
                if (inline) {
                    onComplete()
                    return
                }
                router.push(`/inventory/${serviceable_type}/${id}`)
            })
            .catch(error => {
                AddErrorToasts(toast, error)
            })
    }

    return (
        <>
            <div
                className={
                    'justify-content-center align-content-center grid  ' +
                    (inline ? 'text-right' : '')
                }>
                <div className={'col-12'}>
                    {inline ? (
                        <Button
                            className={'p-button-text text-right'}
                            onClick={() => {
                                onClose()
                            }}>
                            <i className={'ti ti-x'} /> &nbsp;{'Close'}
                        </Button>
                    ) : (
                        <h3 className={'text-center'}>Add New Service Log</h3>
                    )}
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                <div
                    className={
                        'justify-content-center align-content-center grid'
                    }>
                    <div className={'col-8 -mt-4'}>
                        <Card>
                            <SubtypeSelect
                                valueAddRequest={ServiceLogService.addService}
                                supertype={'services'}
                                label={'Service'}
                                control={control}
                                setValue={setValue}
                                errors={errors}
                                fieldId={'service_id'}
                                toast={toast}
                                watch={watch}
                                id={id}
                            />

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
        </>
    )
}

export default React.memo(ServiceLogForm)
