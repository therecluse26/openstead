import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import TextInput from '@/components/HookFormInputs/TextInput'
import { useRouter } from 'next/router'
import { csrf } from '@/hooks/auth'
import ProjectService from '@/services/Projects/ProjectService'
import TextAreaInput from '@/components/HookFormInputs/TextAreaInput'
import { useToast } from '../../context/ToastContext'
import { getUsers } from '../../services/Users/UserService'
import MultiselectInput from '../../components/HookFormInputs/MultiselectInput'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog' // For <ConfirmDialog /> component
import Restrict from '../../components/Authorization/Restrict'

const ProjectForm = ({ mode = 'create' }) => {
    const isMounted = useRef(false)
    const router = useRouter()
    const { showToast } = useToast()
    const { query, isReady } = useRouter()
    const { id } = query
    const defaultValues = {
        name: null,
        description: null,
        images: [],
        users: [],
    }
    const [availableUsers, setAvailableUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
    const {
        control,
        formState: { errors },
        handleSubmit,
        setValue,
    } = useForm({ defaultValues })

    useEffect(() => {
        getUsers()
            .then(userData => {
                setAvailableUsers(userData)
            })
            .catch(e => {
                showToast(
                    e.response.data.message ?? 'Error getting users',
                    'error',
                )
            })

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
                setValue('description', data?.description)
                setValue(
                    'users',
                    data?.users?.map(u => u.id),
                )
                setSelectedUsers(data?.users?.map(u => u.id))
            })
            .catch(e => {
                alert(e)
            })
    }

    const onSubmit = async data => {
        await csrf()
        ProjectService.createOrUpdate(id, data)
            .then(r => {
                router.push('/projects/' + r.data?.id)
            })
            .catch(error => {
                showToast(
                    error.response.data.message ?? 'Unknown error',
                    'error',
                )
            })
    }

    return (
        <Restrict
            permission="project:update"
            message="You are not authorized to access this resource"
            showMessage>
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
                                        maxLength: {
                                            value: 80,
                                            message: 'Max length is 80',
                                        },
                                        required: 'Name is required',
                                    }}
                                />
                                {getFormErrorMessage('name')}
                            </div>

                            <div className="field">
                                <TextAreaInput
                                    control={control}
                                    name={'description'}
                                    label={'Description'}
                                    rules={{
                                        maxLength: {
                                            value: 255,
                                            message: 'Max length is 255',
                                        },
                                        required: 'Description is required',
                                    }}
                                />
                                {getFormErrorMessage('description')}
                            </div>

                            <div className="field">
                                <MultiselectInput
                                    name="users"
                                    label="Users"
                                    control={control}
                                    options={availableUsers}
                                    optionValue="id"
                                    optionLabel="name"
                                    filter={true}
                                    value={selectedUsers}
                                    itemTemplate={item => (
                                        <div className="flex">
                                            <img
                                                className="mr-2"
                                                width={20}
                                                src={item?.avatar}
                                                alt={item.name}
                                            />
                                            {item.name}
                                        </div>
                                    )}
                                    onChange={e => {
                                        setSelectedUsers(e.value)
                                        setValue('users', e.value)
                                    }}
                                />
                            </div>
                        </Card>
                    </div>

                    <div className={'col-10'}>
                        <Button type="submit" label="Save" className="mt-2" />
                    </div>

                    {id && (
                        <Restrict permission="project:delete">
                            <div className="col-10 mt-4">
                                <Card className={'min-h-full'}>
                                    <h5 className="flex justify-content-center">
                                        Danger Zone
                                    </h5>

                                    <Button
                                        type="button"
                                        label="Delete Project"
                                        className="p-button-danger mt-4"
                                        onClick={() => {
                                            confirmDialog({
                                                header: 'Delete Project',
                                                message:
                                                    'Are you sure you want to delete this project?',
                                                accept: () => {
                                                    ProjectService.deleteProject(
                                                        id,
                                                    )
                                                        .then(() => {
                                                            router.push(
                                                                '/projects',
                                                            )
                                                        })
                                                        .catch(e => {
                                                            showToast(
                                                                e.response.data
                                                                    .message ??
                                                                    'Unknown error',
                                                                'error',
                                                            )
                                                        })
                                                },
                                            })
                                        }}
                                    />
                                </Card>
                            </div>
                        </Restrict>
                    )}
                </div>
            </form>
            <ConfirmDialog />
        </Restrict>
    )
}

export default React.memo(ProjectForm)
