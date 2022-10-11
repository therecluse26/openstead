import React from 'react'
import { useForm } from 'react-hook-form'
import { Card } from 'primereact/card'
import axios from '@/lib/axios'
import { Button } from 'primereact/button'
import TextInput from '@/components/HookFormInputs/TextInput'
import SelectInput from '@/components/HookFormInputs/SelectInput'
import { useRouter } from 'next/router'
import CalendarInput from '@/components/HookFormInputs/CalendarInput'
import NumberInput from '@/components/HookFormInputs/NumberInput'

const CreateLivestock = () => {
    const router = useRouter()
    const defaultValues = {
        name: '',
        type: '',
        breed: '',
        date_of_birth: Date.now(),
        location: null,
        quantity: 1,
        acquired_at: Date.now(),
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
            .post('/api/inventory/livestock', props)
            .then(r => {
                router.push('/inventory/livestock/' + r.data?.id)
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
            breed: data.breed,
            date_of_birth: data.date_of_birth,
            location: data.location,
            quantity: data.quantity,
            acquired_at: data.acquired_at,
            setError,
        })
    }

    return (
        <div className={'justify-content-center align-content-center grid'}>
            <Card className={'col-4'}>
                <h3 className={'text-center'}>Add New Livestock</h3>

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
                            optionsEndpoint={'/api/inventory/livestock/types'}
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
                        <TextInput
                            control={control}
                            name={'breed'}
                            label={'Breed'}
                            rules={{
                                required: 'Breed is required.',
                            }}
                        />
                        {getFormErrorMessage('breed')}
                    </div>

                    <div className="field">
                        <CalendarInput
                            control={control}
                            name={'date_of_birth'}
                            label={'Date of Birth'}
                        />
                        {getFormErrorMessage('date_of_birth')}
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

                    <Button type="submit" label="Submit" className="mt-2" />
                </form>
            </Card>
        </div>
    )
}

export default React.memo(CreateLivestock)
