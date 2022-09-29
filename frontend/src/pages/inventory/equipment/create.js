import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import axios from '@/lib/axios'
import { classNames } from 'primereact/utils'
import { Button } from 'primereact/button'

const CreateEquipment = () => {
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

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const postForm = async ({ setErrors, ...props }) => {
        await csrf()
        axios
            .post('/inventory/equipment', props)
            .then(resp => console.log(resp))
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
                <span className="p-float-label">
                    <Controller
                        name="name"
                        control={control}
                        rules={{
                            required: 'Name is required.',
                        }}
                        render={({
                            field: { onChange, value, name },
                            fieldState,
                        }) => (
                            <InputText
                                id={name}
                                value={value}
                                className={classNames({
                                    'p-invalid': fieldState.invalid,
                                })}
                                onChange={onChange}
                            />
                        )}
                    />
                    <label htmlFor="name">Name</label>
                </span>
                <Button type="submit" label="Submit" className="mt-2" />
            </form>
        </Card>
    )
}

export default React.memo(CreateEquipment)
