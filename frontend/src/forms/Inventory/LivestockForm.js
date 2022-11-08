import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import TextInput from '@/components/HookFormInputs/TextInput'
import { useRouter } from 'next/router'
import CalendarInput from '@/components/HookFormInputs/CalendarInput'
import { FileUpload } from 'primereact/fileupload'
import { convertUploadedFilesToBase64 } from '@/utils/file-utils'
import { csrf } from '@/hooks/auth'
import ToastContext, { useToastContext } from '@/context/ToastContext'
import AddErrorToasts from '@/utils/AddErrorToasts'
import LivestockService from '@/services/inventory/LivestockService'
import SubtypeSelect from '@/components/HookFormInputs/SubtypeSelect'
import ListboxInput from '@/components/HookFormInputs/ListboxInput'
import NumberInput from '@/components/HookFormInputs/NumberInput'
import TextAreaInput from '@/components/HookFormInputs/TextAreaInput'

const LivestockForm = ({ mode = 'create' }) => {
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
        resetField,
        watch,
    } = useForm({ defaultValues })

    const type = watch('type')

    useEffect(() => {
        if (!isReady || !id) {
            return
        }
        isMounted.current = true
        getEditData(id)
    }, [id])

    useEffect(() => {
        resetField('parents')
        resetField('children')
    }, [type])

    const getFormErrorMessage = name => {
        return (
            errors[name] && (
                <small className="p-error">{errors[name].message}</small>
            )
        )
    }

    const getEditData = id => {
        LivestockService.getItem(id)
            .then(data => {
                setValue('name', data?.name)
                setValue('type', data?.type?.key)
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
        LivestockService.createOrUpdate(id, data, images)
            .then(r => {
                router.push('/inventory/livestock/' + r.data?.id)
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
                            ? 'Add New Livestock'
                            : 'Edit Livestock'}
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

                            <SubtypeSelect
                                valueAddRequest={LivestockService.addBreed}
                                label={'Breed'}
                                supertype={'livestock'}
                                control={control}
                                setValue={setValue}
                                errors={errors}
                                supertypeValueUrl={`/api/inventory/livestock/types`}
                                fieldId={'variety_id'}
                                toast={toast}
                                watch={watch}
                                id={id}
                            />
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
                            <div className="field">
                                <CalendarInput
                                    control={control}
                                    name={'acquired_at'}
                                    label={'Date Acquired'}
                                />
                                {getFormErrorMessage('acquired_at')}
                            </div>
                        </Card>
                    </div>
                    <div className={'col-10 md:col-5'}>
                        <Card className={'min-h-full'}>
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
                </div>

                {type ? (
                    <div
                        className={
                            'justify-content-center align-content-center grid'
                        }>
                        <div className={'col-10 md:col-5'}>
                            <Card className={'min-h-full'}>
                                <div className="field">
                                    <ListboxInput
                                        optionsEndpoint={`/api/inventory/livestock/types/${type}/members`}
                                        control={control}
                                        name={'parents'}
                                        label={'Parents'}
                                        maxSelection={2}
                                    />
                                </div>
                            </Card>
                        </div>
                        <div className={'col-10 md:col-5'}>
                            <Card className={'min-h-full'}>
                                <div className="field">
                                    <ListboxInput
                                        optionsEndpoint={`/api/inventory/livestock/types/${type}/members`}
                                        control={control}
                                        name={'children'}
                                        label={'Children'}
                                    />
                                </div>
                            </Card>
                        </div>
                    </div>
                ) : null}

                <div
                    className={
                        'justify-content-center align-content-center grid'
                    }>
                    <div className={'col-10'}>
                        <Button type="submit" label="Save" className="mt-2" />
                    </div>
                </div>
            </form>
        </>
    )
}

export default React.memo(LivestockForm)
