import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
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
import SelectButtonInput from '@/components/HookFormInputs/SelectButtonInput'
import SeedService from '@/services/inventory/SeedService'

const SeedForm = ({ mode = 'create' }) => {
    const isMounted = useRef(false)
    const router = useRouter()
    const [images, setImages] = useState([])
    const [initialType, setInitialType] = useState(null)
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
        parents: [],
        children: [],
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

    const deleteLivestock = async () => {
        await LivestockService.deleteItem(id)
    }

    const confirmDelete = () => {
        if (confirm('Are you sure you want to delete this item?')) {
            deleteLivestock()
            router.push('/inventory/livestock')
        }
    }

    const type = watch('type')
    const watchParents = watch('parents')
    const watchChildren = watch('children')
    const watchQuantity = watch('quantity')

    useEffect(() => {
        if (!isReady || !id) {
            return
        }
        isMounted.current = true
        getEditData(id)
    }, [id])

    useEffect(() => {
        if (type !== initialType) {
            resetField('parents')
            resetField('children')
        }
    }, [type])

    const getFormErrorMessage = name => {
        return (
            errors[name] && (
                <small className="p-error">{errors[name].message}</small>
            )
        )
    }

    const getEditData = id => {
        return LivestockService.getItem(id)
            .then(data => {
                setValue('name', data?.name)
                setValue('description', data?.description)
                setValue('type', data?.variety?.group_type?.key)
                setValue('variety_id', data?.variety?.id)
                setValue('sex', data?.sex?.key)
                setValue(
                    'date_of_birth',
                    data?.date_of_birth ? new Date(data?.date_of_birth) : null,
                )
                setValue(
                    'date_of_death',
                    data?.date_of_death ? new Date(data?.date_of_death) : null,
                )
                setValue('acquired_at', new Date(data?.acquired_at))
                setValue('quantity', data?.quantity)
                setValue(
                    'parents',
                    data?.family?.parents.map(i => {
                        return i.id
                    }),
                )
                setValue(
                    'children',
                    data?.family?.children.map(i => {
                        return i.id
                    }),
                )
                setInitialType(data?.variety?.group_type?.key)
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

    const parentsOnChange = (e, callback) => {
        // Prevents adding more than 2 parents
        if (e.value.length > 2) {
            AddErrorToasts(toast, new Error('Only 2 parents are allowed'))
            return
        }
        // Prevent adding same member as both parent and child
        const matches = e.value.filter(element =>
            watchChildren?.includes(element),
        )
        if (matches.length > 0) {
            AddErrorToasts(
                toast,
                new Error(
                    'Cannot add the same member as both parent and child',
                ),
            )

            return
        }

        callback(e)
    }

    const childrenOnChange = (e, callback) => {
        // Prevent adding same member as both parent and child
        const matches = e.value.filter(element =>
            watchParents?.includes(element),
        )
        if (matches.length > 0) {
            AddErrorToasts(
                toast,
                new Error(
                    'Cannot add the same member as both parent and child',
                ),
            )
            return
        }
        callback(e)
    }

    return (
        <>
            <div className={'justify-content-center align-content-center grid'}>
                <div className={'col-10'}>
                    <h3 className={'text-center'}>
                        {mode === 'create' ? (
                            'Add New Seed(s)'
                        ) : (
                            <div className={'flex justify-content-between'}>
                                <div />
                                <div>Edit Seed(s)</div>
                                <Button
                                    className={
                                        'p-button-danger align-right text-right'
                                    }
                                    onClick={confirmDelete}>
                                    <span>
                                        <i className={'ti ti-trash'} />
                                        {' Delete'}
                                    </span>
                                </Button>
                            </div>
                        )}
                    </h3>
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                <Card className={'min-h-full'}>
                    <div
                        className={
                            'justify-content-center align-content-center grid'
                        }>
                        <div className={'col-10 md:col-6'}>
                            <SubtypeSelect
                                valueAddRequest={SeedService.addVariety}
                                label={'Variety'}
                                supertype={'seed'}
                                control={control}
                                setValue={setValue}
                                errors={errors}
                                supertypeValueUrl={`/api/inventory/seeds/types`}
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
                                    min={1}
                                    max={10000}
                                    rules={{
                                        required: 'Quantity is required.',
                                    }}
                                />
                                {getFormErrorMessage('quantity')}
                            </div>
                            {watchQuantity === 1 && (
                                <div className="field">
                                    <CalendarInput
                                        control={control}
                                        name={'date_of_birth'}
                                        label={'Date of Birth'}
                                    />
                                    {getFormErrorMessage('date_of_birth')}
                                </div>
                            )}

                            {watchQuantity === 1 && (
                                <div className="field">
                                    <CalendarInput
                                        control={control}
                                        name={'date_of_death'}
                                        label={'Date of Death'}
                                    />
                                    {getFormErrorMessage('date_of_death')}
                                </div>
                            )}

                            {watchQuantity === 1 && (
                                <div className="field">
                                    <p>Sex</p>
                                    <SelectButtonInput
                                        name={'sex'}
                                        control={control}
                                        options={[
                                            { label: 'Male', value: 'male' },
                                            {
                                                label: 'Female',
                                                value: 'female',
                                            },
                                        ]}
                                    />
                                </div>
                            )}
                        </div>
                        <div className={'col-10 md:col-6'}>
                            <div className="field">
                                <CalendarInput
                                    control={control}
                                    name={'acquired_at'}
                                    label={'Date Acquired'}
                                />
                                {getFormErrorMessage('acquired_at')}
                            </div>
                            <div className="field">
                                <TextAreaInput
                                    control={control}
                                    name={'description'}
                                    label={'Description'}
                                    rules={{
                                        required: 'Description is required.',
                                    }}
                                    rows={4}
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
                        </div>

                        {type && (
                            <>
                                <div className={'col-10 md:col-6'}>
                                    <div className="field">
                                        <ListboxInput
                                            control={control}
                                            optionsEndpoint={`/api/inventory/livestock/types/${type}/members`}
                                            name={'parents'}
                                            label={'Parents'}
                                            customOnChange={parentsOnChange}
                                        />
                                    </div>
                                </div>
                                <div className={'col-10 md:col-6'}>
                                    <div className="field">
                                        <ListboxInput
                                            control={control}
                                            optionsEndpoint={`/api/inventory/livestock/types/${type}/members`}
                                            name={'children'}
                                            label={'Children'}
                                            customOnChange={childrenOnChange}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Card>

                <br />

                <div
                    className={
                        'justify-content-center align-content-center grid'
                    }>
                    <div className={'col-10'}>
                        <Button type="submit" label="Save" className="mt-2" />
                    </div>
                </div>
            </form>

            <br />
        </>
    )
}

export default React.memo(SeedForm)
