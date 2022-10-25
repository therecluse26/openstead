import React, { useRef, useState } from 'react'
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

const CreateEquipment = () => {
    const router = useRouter()
    const [images, setImages] = useState([])
    const fileUploaderRef = useRef(null)
    const defaultValues = {
        name: '',
        type: '',
        condition: '',
        quantity: 1,
        description: '',
        location: null,
        images: [],
    }
    const {
        control,
        formState: { errors },
        handleSubmit,
        setError,
    } = useForm({ defaultValues })

    const getFormErrorMessage = name => {
        return (
            errors[name] && (
                <small className="p-error">{errors[name].message}</small>
            )
        )
    }

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const postForm = async ({ setErrors, ...props }) => {
        await csrf()
        axios
            .post('/api/inventory/equipment', props)
            .then(r => {
                router.push('/inventory/equipment/' + r.data?.id)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    const onSubmit = data => {
        postForm({
            name: data.name,
            type: data.type,
            quantity: data.quantity,
            condition: data.condition,
            description: data.description,
            location: data.location,
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
                        <SelectInput
                            optionsEndpoint={'/api/locations/dropdown'}
                            control={control}
                            name={'location'}
                            label={'Location'}
                        />
                        {getFormErrorMessage('location')}
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
                            // ref={fileUploaderRef}
                            auto={true}
                            uploadHandler={onUploadImage}
                            accept={'image/*'}
                            multiple={false}
                            maxFileSize={1000000}
                            chooseLabel={'Add Image'}
                            onRemove={onRemoveImage}
                            emptyTemplate={
                                <p className="m-0">
                                    Drag and drop images to here to upload.
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

export default React.memo(CreateEquipment)
