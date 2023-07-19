import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import TextInput from '@/components/HookFormInputs/TextInput'
import { useRouter } from 'next/router'
import { FileUpload } from 'primereact/fileupload'
import { convertUploadedFilesToBase64 } from '@/utils/file-utils'
import { csrf } from '@/hooks/auth'
import ProjectService from '@/services/Projects/ProjectService'
import ToastContext, { useToastContext } from '@/context/ToastContext'
import AddErrorToasts from '@/utils/AddErrorToasts'
import TextAreaInput from '@/components/HookFormInputs/TextAreaInput'
import { slugify } from '@/utils/string-utils'

const ProjectForm = ({ mode = 'create' }) => {
    const isMounted = useRef(false)
    const router = useRouter()
    const [images, setImages] = useState([])
    const toast = useToastContext(ToastContext)
    const { query, isReady } = useRouter()
    const { id } = query
    const defaultValues = {
        name: null,
        description: null,
        images: [],
    }
    const {
        control,
        formState: { errors },
        handleSubmit,
        setValue,
        watch,
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
        ProjectService.getItem(id)
            .then(data => {
                setValue('name', data?.name)
                setValue('slug', data?.type?.key)
                setValue('description', data?.description)
            })
            .catch(e => {
                alert(e)
            })
    }

    const onSubmit = async data => {
        await csrf()
        ProjectService.createOrUpdate(id, data, images)
            .then(r => {
                router.push('/projects/' + r.data?.id)
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
                        {mode === 'create' ? 'Add New Project' : 'Edit Project'}
                    </h3>
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                <div
                    className={
                        'justify-content-center align-content-center grid'
                    }>
                    <div className={'col-10 md:col-10'}>
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
                                Slug: {slugify(watch('name'))}
                            </div>

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

                    <div className={'col-10'}>
                        <Button type="submit" label="Save" className="mt-2" />
                    </div>
                </div>
            </form>
        </>
    )
}

export default React.memo(ProjectForm)
