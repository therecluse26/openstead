import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import TextInput from '@/components/HookFormInputs/TextInput'
import { useRouter } from 'next/router'
import { csrf } from '@/hooks/auth'
import ProjectService from '@/services/Projects/ProjectService'
import SelectInput from '../../components/HookFormInputs/SelectInput'
import CalendarInput from '@/components/HookFormInputs/CalendarInput'
import { useAuth } from '@/hooks/auth'
import RichTextInput from '../../components/HookFormInputs/RichTextInput'
import { useToast } from '../../context/ToastContext'

const ProjectItemForm = ({ projectId, status = null }) => {
    const isMounted = useRef(false)
    const router = useRouter()
    const { user } = useAuth({ middleware: 'auth' })
    const { showToast } = useToast()
    const defaultValues = {
        title: null,
        description: null,
        project_id: projectId,
        project_item_status_id: null,
        due_date: null,
        assignee_id: null,
        creator_id: user?.id,
    }
    const {
        control,
        formState: { errors },
        handleSubmit,
        setValue,
    } = useForm({ defaultValues })

    useEffect(() => {
        setValue('creator_id', user?.id)
    }, [user])

    useEffect(() => {
        if (!projectId) {
            return
        }
        isMounted.current = true
    }, [projectId])

    const getFormErrorMessage = name => {
        return (
            errors[name] && (
                <small className="p-error">{errors[name].message}</small>
            )
        )
    }

    const onSubmit = async data => {
        await csrf()
        ProjectService.createItem(projectId, data)
            .then(r => {
                router.push('/projects/' + r.data?.id)
            })
            .catch(error => {
                showToast(
                    error?.response?.data?.message ?? 'Unknown error',
                    'error',
                )
            })
    }

    return (
        <>
            <div className={'justify-content-center align-content-center grid'}>
                <div className={'col-10'}>
                    <h3 className={'text-center'}>Add New Project Item</h3>
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
                                    name={'title'}
                                    label={'Title'}
                                    rules={{
                                        maxLength: {
                                            value: 150,
                                            message: 'Max length is 150',
                                        },
                                        required: 'Title is required',
                                    }}
                                />
                                {getFormErrorMessage('title')}
                            </div>

                            <div className="field">
                                <RichTextInput
                                    control={control}
                                    name={'description'}
                                    label={'Description'}
                                    rules={{
                                        maxLength: {
                                            value: 60000,
                                            message: 'Max length is 60000',
                                        },
                                        required: 'Description is required',
                                    }}
                                />
                                {getFormErrorMessage('description')}
                            </div>

                            <div className="field">
                                <SelectInput
                                    selected={status}
                                    control={control}
                                    optionsEndpoint={`/api/projects/${projectId}/statuses`}
                                    optionLabel="label"
                                    optionValue="key"
                                    dataLabelKey="label"
                                    dataValueKey="key"
                                    name={'project_item_status_id'}
                                    label={'Status'}
                                    rules={{
                                        required: 'Status is required',
                                    }}
                                />
                                {getFormErrorMessage('project_item_status_id')}
                            </div>

                            <div className="field">
                                <CalendarInput
                                    control={control}
                                    name={'due_date'}
                                    label={'Due Date'}
                                />
                                {getFormErrorMessage('due_date')}
                            </div>

                            <div className="field">
                                <SelectInput
                                    control={control}
                                    optionsEndpoint={`/api/projects/${projectId}/users`}
                                    optionLabel="name"
                                    optionValue="id"
                                    dataLabelKey="name"
                                    dataValueKey="id"
                                    name={'assignee_id'}
                                    label={'Assignee'}
                                />
                                {getFormErrorMessage('assignee_id')}
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

export default React.memo(ProjectItemForm)
