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
import SubtypeSelect from '@/components/HookFormInputs/SubtypeSelect'
import NumberInput from '@/components/HookFormInputs/NumberInput'
import SeedService from '@/services/inventory/SeedService'
import SelectInput from '@/components/HookFormInputs/SelectInput'
import TextInput from '@/components/HookFormInputs/TextInput'

const SeedForm = ({ mode = 'create' }) => {
    const isMounted = useRef(false)
    const router = useRouter()
    const [images, setImages] = useState([])
    const [initialType, setInitialType] = useState(null)
    const toast = useToastContext(ToastContext)
    const { query, isReady } = useRouter()
    const { id } = query
    const defaultValues = {
        variety_id: null,
        quantity: 1,
        days_to_germination: null,
        days_to_maturity: null,
        planting_depth: null,
        plant_spacing: null,
        light_requirement: null,
        zone_lower: null,
        zone_upper: null,
        acquired_at: null,
        url: null,
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
        await SeedService.deleteItem(id)
    }

    const confirmDelete = () => {
        if (confirm('Are you sure you want to delete this item?')) {
            deleteItem()
            router.push('/inventory/seeds')
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
        return SeedService.getItem(id)
            .then(data => {
                setValue('variety_id', data?.variety?.id)
                setValue('type', data?.variety?.group_type?.key)
                setValue('quantity', data?.quantity)
                setValue('acquired_at', new Date(data?.acquired_at))
                setValue('life_cycle', data?.life_cycle?.key)
                setValue('light_requirement', data?.light_requirement?.key)
                setValue('zone_lower', data?.zone_lower?.key)
                setValue('zone_upper', data?.zone_upper?.key)
                setValue('days_to_germination', data?.days_to_germination)
                setValue('days_to_maturity', data?.days_to_maturity)
                setValue('planting_depth', data?.planting_depth)
                setValue('plant_spacing', data?.plant_spacing)
                setValue('url', data?.url)

                setInitialType(data?.variety?.group_type?.key)
            })

            .catch(e => {
                alert(e)
            })
    }

    const onSubmit = async data => {
        await csrf()
        SeedService.createOrUpdate(id, data, images)
            .then(r => {
                router.push('/inventory/seeds/' + r.data?.id)
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

                            <div className="field">
                                <SelectInput
                                    optionsEndpoint={
                                        '/api/inventory/seeds/light-requirements'
                                    }
                                    control={control}
                                    name={'light_requirement'}
                                    label={'Light Requirement'}
                                />
                                {getFormErrorMessage('light_requirement')}
                            </div>

                            <div className="field">
                                <NumberInput
                                    control={control}
                                    name={'days_to_germination'}
                                    label={'Days to Germination'}
                                    min={0}
                                    max={10000}
                                />
                                {getFormErrorMessage('days_to_germination')}
                            </div>

                            <div className="field">
                                <NumberInput
                                    control={control}
                                    name={'days_to_maturity'}
                                    label={'Days to Maturity'}
                                    min={0}
                                    max={10000}
                                />
                                {getFormErrorMessage('days_to_maturity')}
                            </div>

                            <div className="field">
                                <NumberInput
                                    control={control}
                                    name={'planting_depth'}
                                    label={'Planting Depth (in)'}
                                    min={0.01}
                                    max={10000}
                                    step={0.01}
                                />
                                {getFormErrorMessage('planting_depth')}
                            </div>

                            <div className="field">
                                <NumberInput
                                    control={control}
                                    name={'plant_spacing'}
                                    label={'Plant Spacing (in)'}
                                    min={0.25}
                                    max={10000}
                                    step={0.01}
                                />
                                {getFormErrorMessage('plant_spacing')}
                            </div>
                        </div>
                        <div className={'col-10 md:col-6'}>
                            <div className="field mt-2">
                                <SelectInput
                                    optionsEndpoint={
                                        '/api/inventory/seeds/life-cycles'
                                    }
                                    control={control}
                                    name={'life_cycle'}
                                    label={'Life Cycle'}
                                />
                                {getFormErrorMessage('life_cycle')}
                            </div>

                            <div className="field">
                                <SelectInput
                                    optionsEndpoint={
                                        '/api/inventory/seeds/hardiness-zones'
                                    }
                                    control={control}
                                    name={'zone_lower'}
                                    label={'Grow Zone (Minimum)'}
                                />
                                {getFormErrorMessage('zone_lower')}
                            </div>

                            <div className="field">
                                <SelectInput
                                    optionsEndpoint={
                                        '/api/inventory/seeds/hardiness-zones'
                                    }
                                    control={control}
                                    name={'zone_upper'}
                                    label={'Grow Zone (Maximum)'}
                                />
                                {getFormErrorMessage('zone_upper')}
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
