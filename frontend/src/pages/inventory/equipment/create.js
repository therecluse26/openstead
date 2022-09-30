import React from 'react'
import { useForm } from 'react-hook-form'
import { Card } from 'primereact/card'
import axios from '@/lib/axios'
import { Button } from 'primereact/button'
import TextInput from '@/components/HookFormInputs/TextInput'
import SelectInput from '@/components/HookFormInputs/SelectInput'
import { useRouter } from 'next/router'

const CreateEquipment = () => {
    const router = useRouter()
    const defaultValues = {
        name: '',
        type: '',
        condition: '',
        description: '',
        location: null,
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
            condition: data.condition,
            description: data.description,
            location: data.location,
            setError,
        })
    }

    return (
        <Card>
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

                <Button type="submit" label="Submit" className="mt-2" />
            </form>
        </Card>
    )
}

export default React.memo(CreateEquipment)
