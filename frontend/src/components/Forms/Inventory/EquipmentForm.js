import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card } from 'primereact/card'
import axios from '@/lib/axios'
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

const EquipmentForm = ({ mode = 'create' }) => {
    const isMounted = useRef(false)
    const router = useRouter()
    const [images, setImages] = useState([])
    const { query, isReady } = useRouter()
    const { id } = query

    const defaultValues = {
        name: null,
        type: null,
        condition: null,
        quantity: 1,
        description: null,
        images: [],
        acquired_at: null,
        url: null,
    }

    const {
        control,
        formState: { errors },
        handleSubmit,
        setError,
        setValue,
    } = useForm({ defaultValues })

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
                setValue('description', data?.description)
                setValue('quantity', data?.quantity)
                setValue('acquired_at', data?.acquired_at)
                setValue('url', data?.url)
            })
            .catch(e => {
                alert(e)
            })
    }

    const submitForm = async ({ setErrors, ...props }) => {
        await csrf()
        const url =
            typeof id === 'undefined'
                ? `/api/inventory/equipment`
                : `/api/inventory/equipment/${id}`
        axios
            .post(url, props)
            .then(r => {
                router.push('/inventory/equipment/' + r.data?.id)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    const onSubmit = data => {
        submitForm({
            name: data.name,
            type: data.type,
            quantity: data.quantity,
            condition: data.condition,
            description: data.description,
            acquired_at: data.acquired_at,
            url: data.url,
            _method: mode === 'edit' ? 'PUT' : 'POST',
            images: images,
            setError,
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
        <div className={'justify-content-center align-content-center grid'}>
            <Card className={'col-4'}>
                <h3 className={'text-center'}>Add New Equipment</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
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
                            optionsEndpoint={'/api/inventory/equipment/types'}
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
                            rules={{
                                required: 'Condition is required.',
                            }}
                        />
                        {getFormErrorMessage('condition')}
                    </div>

                    <div className="field">
                        <TextInput
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
                        <TextInput
                            control={control}
                            name={'url'}
                            label={'Purchase URL'}
                            rules={{
                                pattern: {
                                    value: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                                    message: 'Invalid URL',
                                },
                            }}
                        />
                        {getFormErrorMessage('url')}
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

                    <Button type="submit" label="Submit" className="mt-2" />
                </form>
            </Card>
        </div>
    )
}

export default React.memo(EquipmentForm)
