import React, { useEffect, useRef, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { FileUploadHandlerEvent } from 'primereact/fileupload'
import TextInput from '@/components/HookFormInputs/TextInput'
import { useRouter } from 'next/router'
import CalendarInput from '@/components/HookFormInputs/CalendarInput'
import { FileUpload } from 'primereact/fileupload'
import { convertUploadedFilesToBase64 } from '@/utils/file-utils'
import { csrf } from '@/hooks/auth'
import LivestockService from '@/services/Inventory/LivestockService'
import SubtypeSelect from '@/components/HookFormInputs/SubtypeSelect'
import ListboxInput from '@/components/HookFormInputs/ListboxInput'
import NumberInput from '@/components/HookFormInputs/NumberInput'
import TextAreaInput from '@/components/HookFormInputs/TextAreaInput'
import SelectButtonInput from '@/components/HookFormInputs/SelectButtonInput'
import { useToast } from '../../context/ToastContext'
import { Livestock } from '@/types/Inventory'

interface LivestockFormData {
    name: string
    type: string | null
    variety_id: string | null
    sex: 'male' | 'female' | null
    date_of_birth: Date | null
    date_of_death: Date | null
    acquired_at: Date | null
    quantity: number
    description: string
    parents: string[]
    children: string[]
}

interface LivestockFormProps {
    mode?: 'create' | 'edit'
}

const LivestockForm: React.FC<LivestockFormProps> = ({ mode = 'create' }) => {
    const isMounted = useRef<boolean>(false)
    const router = useRouter()
    const [images, setImages] = useState<string[]>([])
    const [initialType, setInitialType] = useState<string | null>(null)
    const { showToast } = useToast()
    const { query, isReady } = useRouter()
    const { id } = query as { id?: string }
    const defaultValues: LivestockFormData = {
        name: '',
        type: null,
        variety_id: null,
        sex: null,
        date_of_birth: null,
        date_of_death: null,
        acquired_at: null,
        quantity: 1,
        description: '',
        parents: [],
        children: [],
    }
    const {
        control,
        formState: { errors },
        handleSubmit,
        setValue,
        resetField,
        watch,
    } = useForm<LivestockFormData>({ defaultValues })

    const deleteLivestock = async (): Promise<void> => {
        await LivestockService.deleteItem(id)
    }

    const confirmDelete = (): void => {
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

    const getFormErrorMessage = (name: keyof LivestockFormData) => {
        return (
            errors[name] && (
                <small className="p-error">{errors[name].message}</small>
            )
        )
    }

    const getEditData = (id: string) => {
        return LivestockService.getItem(id)
            .then((data: Livestock) => {
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

            .catch((e: any) => {
                alert(e)
            })
    }

    const onSubmit: SubmitHandler<LivestockFormData> = async data => {
        await csrf()
        LivestockService.createOrUpdate(id, data, images)
            .then(r => {
                router.push('/inventory/livestock/' + r.data?.id)
            })
            .catch((error: any) => {
                showToast(
                    error?.response?.data?.message ?? 'Unknown error',
                    'error',
                )
            })
    }

    const onUploadImage = async (data: FileUploadHandlerEvent) => {
        setImages([])
        setImages(await convertUploadedFilesToBase64(data.files))
    }

    const onRemoveImage = (): void => {
        setImages([])
    }

    const parentsOnChange = (e: any, callback: any, opts?: any) => {
        // Prevents adding more than 2 parents
        if (e.value.length > 2) {
            showToast('Only 2 parents are allowed', 'error')
            return
        }
    }

    const childrenOnChange = (e: any, callback: any) => {
        // Prevent adding same member as both parent and child
        const matches = e.value.filter(element =>
            watchParents?.includes(element),
        )
        if (matches.length > 0) {
            showToast(
                'Cannot add the same member as both parent and child',
                'error',
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
                            'Add New Livestock'
                        ) : (
                            <div className={'flex justify-content-between'}>
                                <div />
                                <div>Edit Livestock</div>
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
                                watch={watch}
                                id={id}
                                optionLabel="label"
                                optionValue="key"
                                dataLabelKey="label"
                                dataValueKey="key"
                            />
                            <div className="field">
                                <NumberInput
                                    control={control}
                                    name={'quantity'}
                                    label={'Quantity'}
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

export default React.memo(LivestockForm)
