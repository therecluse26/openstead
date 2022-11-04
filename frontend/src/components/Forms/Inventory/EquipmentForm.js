import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import TextInput from '@/components/HookFormInputs/TextInput'
import SelectInput from '@/components/HookFormInputs/SelectInput'
import { useRouter } from 'next/router'
import NumberInput from '@/components/HookFormInputs/NumberInput'
import CalendarInput from '@/components/HookFormInputs/CalendarInput'
import { FileUpload } from 'primereact/fileupload'
import { convertUploadedFilesToBase64 } from '@/utils/file-utils'
import { csrf } from '@/hooks/auth'
import EquipmentService from '@/services/inventory/EquipmentService'
import ToastContext, { useToastContext } from '@/context/ToastContext'
import AddErrorToasts from '@/utils/AddErrorToasts'
import RatingInput from '@/components/HookFormInputs/RatingInput'
import TextAreaInput from '@/components/HookFormInputs/TextAreaInput'

const EquipmentForm = ({ mode = 'create' }) => {
    const isMounted = useRef(false)
    const router = useRouter()
    const [images, setImages] = useState([])
    const toast = useToastContext(ToastContext)
    const { query, isReady } = useRouter()
    const { id } = query
    const defaultValues = {
        name: null,
        type: null,
        condition: null,
        quantity: 1,
        rating: null,
        description: null,
        images: [],
        acquired_at: null,
        url: null,
    }
    const {
        control,
        formState: { errors },
        handleSubmit,
        setValue,
        watch,
    } = useForm({ defaultValues })

    const quantity = watch('quantity')

    useEffect(() => {
        if (!isReady || !id) {
            return
        }
        isMounted.current = true
        getEditData(id)
    }, [id])

    const getFormErrorMessage = name => {
        return (
            errors[name] && (
                <small className="p-error">{errors[name].message}</small>
            )
        )
    }

    const getEditData = id => {
        EquipmentService.getItem(id)
            .then(data => {
                setValue('name', data?.name)
                setValue('type', data?.type?.key)
                setValue('condition', data?.condition)
                setValue('rating', data?.rating)
                setValue('description', data?.description)
                setValue('quantity', data?.quantity)
                setValue('acquired_at', new Date(data?.acquired_at))
                setValue('url', data?.url)
            })
            .catch(e => {
                alert(e)
            })
    }

    const onSubmit = async data => {
        await csrf()
        EquipmentService.createOrUpdate(id, data, images)
            .then(r => {
                router.push('/inventory/equipment/' + r.data?.id)
            })
            .catch(error => {
                AddErrorToasts(toast, error)
            })
    }

    const onUploadImage = async data => {
        setImages([])
        setImages(await convertUploadedFilesToBase64(data))
    }

    const onRemoveImage = () => {
        setImages([])
    }

    return (
        <>
            <div className={'justify-content-center align-content-center grid'}>
                <div className={'col-10'}>
                    <h3 className={'text-center'}>
                        {mode === 'create'
                            ? 'Add New Equipment'
                            : 'Edit Equipment'}
                    </h3>
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                <div
                    className={
                        'justify-content-center align-content-center grid'
                    }>
                    <div className={'col-10 md:col-5'}>
                        <Card className={'min-h-full'}>
                            <div className="field">
                                <TextInput
                                    control={control}
                                    name={'name'}
                                    label={'Name'}
                                    rules={{
                                        required: 'Name is required.',
                                    }}
                                />
                                {getFormErrorMessage('name')}
                            </div>

                            <div className="field">
                                <SelectInput
                                    optionsEndpoint={
                                        '/api/inventory/equipment/types'
                                    }
                                    control={control}
                                    name={'type'}
                                    label={'Type'}
                                    rules={{
                                        required: 'Type is required.',
                                    }}
                                />
                                {getFormErrorMessage('type')}
                            </div>

                            <div className="field">
                                <NumberInput
                                    control={control}
                                    name={'quantity'}
                                    label={'Quantity'}
                                    showButtons={true}
                                    max={10000}
                                    rules={{
                                        required: 'Quantity is required.',
                                    }}
                                />
                                {getFormErrorMessage('quantity')}
                            </div>
                            {quantity === 1 ? (
                                <div className="field">
                                    <SelectInput
                                        options={[
                                            { label: 'Excellent', value: 5 },
                                            { label: 'Good', value: 4 },
                                            { label: 'Fair', value: 3 },
                                            { label: 'Poor', value: 2 },
                                            { label: 'Broken', value: 1 },
                                        ]}
                                        control={control}
                                        name={'condition'}
                                        label={'Condition'}
                                    />
                                    {getFormErrorMessage('condition')}
                                </div>
                            ) : null}

                            <div className="field">
                                <TextAreaInput
                                    control={control}
                                    name={'description'}
                                    label={'Description'}
                                    rules={{
                                        required: 'Description is required.',
                                    }}
                                />
                                {getFormErrorMessage('description')}
                            </div>
                        </Card>
                    </div>
                    <div className={'col-10 md:col-5'}>
                        <Card className={'min-h-full'}>
                            <div className="field">
                                <TextInput
                                    control={control}
                                    name={'url'}
                                    label={'Purchase URL'}
                                    rules={{
                                        pattern: {
                                            value:
                                                '/((([A-Za-z]{3,9}:(?://)?)(?:[-;:&=+$,w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,w]+@)[A-Za-z0-9.-]+)((?:/[+~%/.w-_]*)???(?:[-+=&;%@.w_]*)#?(?:[w]*))?)/',
                                            message: 'Invalid URL',
                                        },
                                    }}
                                />
                                {getFormErrorMessage('url')}
                            </div>

                            <div className="field">
                                <RatingInput
                                    control={control}
                                    name={'rating'}
                                    label={'Rating'}
                                />
                            </div>

                            <div className="field">
                                <CalendarInput
                                    control={control}
                                    name={'acquired_at'}
                                    label={'Date Acquired'}
                                />
                                {getFormErrorMessage('acquired_at')}
                            </div>

                            <div className="field">
                                <FileUpload
                                    name="images[]"
                                    customUpload={true}
                                    auto={true}
                                    uploadHandler={onUploadImage}
                                    accept={'image/*'}
                                    multiple={false}
                                    maxFileSize={1000000}
                                    chooseLabel={'Add Image'}
                                    onRemove={onRemoveImage}
                                    emptyTemplate={
                                        <p className="m-0">
                                            {mode === 'edit'
                                                ? 'Drag and drop image here to replace existing image.'
                                                : 'Drag and drop image to here to upload.'}
                                        </p>
                                    }
                                />
                            </div>
                        </Card>
                    </div>

                    <div className={'col-10'}>
                        <Button type="submit" label="Save" className="mt-2" />
                    </div>
                </div>
            </form>
        </>
    )
}

export default React.memo(EquipmentForm)
