import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { useRouter } from 'next/router'
import CalendarInput from '@/components/HookFormInputs/CalendarInput'
import { FileUpload } from 'primereact/fileupload'
import { convertUploadedFilesToBase64 } from '@/utils/file-utils'
import { csrf } from '@/hooks/auth'
import SubtypeSelect from '@/components/HookFormInputs/SubtypeSelect'
import NumberInput from '@/components/HookFormInputs/NumberInput'
import PantryService from '@/services/Inventory/PantryService'
import SelectInput from '../../components/HookFormInputs/SelectInput'
import TextInput from '../../components/HookFormInputs/TextInput'
import TextAreaInput from '../../components/HookFormInputs/TextAreaInput'
import { useToast } from '../../context/ToastContext'

const PantryForm = ({ mode = 'create' }) => {
    const isMounted = useRef(false)
    const router = useRouter()
    const [images, setImages] = useState([])
    const [initialType, setInitialType] = useState(null)
    const { showToast } = useToast()
    const { query, isReady } = useRouter()
    const { id } = query
    const defaultValues = {
        variety_id: null,
        quantity: 1,
        acquired_at: new Date(),
        storage_type: 'other',
        unit: 'none',
        unit_amount: 1,
        shelf_life_months: 12,
        expiration_date: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1),
        ),
        images: [],
    }
    const {
        control,
        formState: { errors },
        handleSubmit,
        setValue,
        resetField,
        watch,
    } = useForm({ defaultValues })

    const deleteItem = async () => {
        await PantryService.deleteItem(id)
    }

    const confirmDelete = () => {
        if (confirm('Are you sure you want to delete this item?')) {
            deleteItem()
            router.push('/inventory/pantry')
        }
    }

    const type = watch('type')

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
        return PantryService.getItem(id)
            .then(data => {
                setValue('name', data?.name)
                setValue('description', data?.description)
                setValue('storage_type', data?.storage_type?.key)
                setValue('unit', data?.unit?.key)
                setValue('unit_amount', data?.unit_amount)
                setValue('shelf_life_months', data?.shelf_life_months)
                setValue('expiration_date', new Date(data?.expiration_date))
                setValue('variety_id', data?.variety?.id)
                setValue('quantity', data?.quantity)

                setInitialType(data?.variety?.group_type?.key)
            })

            .catch(e => {
                alert(e)
            })
    }

    const onSubmit = async data => {
        await csrf()
        PantryService.createOrUpdate(id, data, images)
            .then(r => {
                router.push('/inventory/pantry/' + r.data?.id)
            })
            .catch(error => {
                showToast(
                    error?.response?.data?.message ?? 'Unknown error',
                    'error',
                )
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
                        {mode === 'create' ? (
                            'Add New Pantry Item(s)'
                        ) : (
                            <div className={'flex justify-content-between'}>
                                <div />
                                <div>Edit Pantry Item(s)</div>
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
                                />
                                {getFormErrorMessage('name')}
                            </div>
                            <div className="field">
                                <TextAreaInput
                                    control={control}
                                    name={'description'}
                                    label={'Description'}
                                    rows={3}
                                />
                                {getFormErrorMessage('description')}
                            </div>

                            <SubtypeSelect
                                valueAddRequest={PantryService.addVariety}
                                label={'Variety'}
                                supertype={'pantry'}
                                control={control}
                                setValue={setValue}
                                errors={errors}
                                supertypeValueUrl={`/api/inventory/pantry/types`}
                                fieldId={'variety_id'}
                                watch={watch}
                                id={id}
                                className={'mt-2'}
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

                            <div className="formgrid grid">
                                <div className="field col">
                                    <NumberInput
                                        control={control}
                                        name={'unit_amount'}
                                        label={'Unit Amount'}
                                        min={1}
                                        max={10000}
                                        rules={{
                                            required:
                                                'Unit Amount is required.',
                                        }}
                                    />
                                    {getFormErrorMessage('unit_amount')}
                                </div>

                                <div className="field col">
                                    <SelectInput
                                        options={[
                                            {
                                                label: 'Individual',
                                                value: 'none',
                                            },
                                            {
                                                label: 'Ounce',
                                                value: 'oz',
                                            },
                                            {
                                                label: 'Teaspoon',
                                                value: 'teaspoon',
                                            },
                                            {
                                                label: 'Tablespoon',
                                                value: 'tablespoon',
                                            },
                                            { label: 'Cup', value: 'cup' },
                                            { label: 'Pint', value: 'pint' },
                                            { label: 'Quart', value: 'quart' },
                                            {
                                                label: 'Gallon',
                                                value: 'gallon',
                                            },
                                            {
                                                label: 'Fluid Ounce',
                                                value: 'fluidoz',
                                            },
                                            { label: 'Gill', value: 'gill' },
                                        ]}
                                        control={control}
                                        name={'unit'}
                                        label={'Unit'}
                                        min={1}
                                        max={10000}
                                        rules={{
                                            required: 'Unit is required.',
                                        }}
                                    />
                                    {getFormErrorMessage('unit')}
                                </div>
                            </div>

                            <div className="field">
                                <NumberInput
                                    control={control}
                                    name={'shelf_life_months'}
                                    label={'Shelf Life (Months)'}
                                    min={1}
                                    max={10000}
                                    rules={{
                                        required: 'Shelf Life is required.',
                                    }}
                                />
                                {getFormErrorMessage('shelf_life_months')}
                            </div>

                            <div className="field">
                                <CalendarInput
                                    control={control}
                                    name={'expiration_date'}
                                    label={'Expiration Date'}
                                />
                                {getFormErrorMessage('expiration_date')}
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
                                    control={control}
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

export default React.memo(PantryForm)
