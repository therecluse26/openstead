import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { useRouter } from 'next/router'
import { FileUpload } from 'primereact/fileupload'
import { convertUploadedFilesToBase64 } from '@/utils/file-utils'
import { csrf } from '@/hooks/auth'
import UserService from '../../services/Users/UserService'
import TextInput from '../../components/HookFormInputs/TextInput'
import { useToast } from '../../context/ToastContext'
import MultiselectInput from '@/components/HookFormInputs/MultiselectInput'
import PasswordInput from '../../components/HookFormInputs/PasswordInput'
import { IconEdit, IconX } from '@tabler/icons'

const UserForm = ({ mode = 'create' }) => {
    const { query, isReady } = useRouter()
    const router = useRouter()
    const isMounted = useRef(false)
    const { id } = query
    const [images, setImages] = useState([])
    const { showToast } = useToast()
    const [selectedPermissions, setSelectedPermissions] = useState([])
    const [selectedRoles, setSelectedRoles] = useState([])
    const [saving, setSaving] = useState(false)
    const [editingPassword, setEditingPassword] = useState(false)

    const defaultValues = {
        name: null,
        email: null,
        roles: null,
        permissions: null,
        current_password: null,
        password: null,
        password_confirmation: null,
        images: [],
    }
    const {
        control,
        formState: { errors },
        handleSubmit,
        setValue,
        watch,
    } = useForm({ defaultValues })

    const watchPassword = watch('password')

    const validateConfirmPassword = value => {
        if (value === watchPassword) {
            return true
        }
        return 'Passwords must match'
    }

    const deleteItem = async () => {
        await UserService.deleteItem(id)
    }

    const confirmDelete = () => {
        if (confirm('Are you sure you want to delete this item?')) {
            deleteItem()
            router.push('/users')
        }
    }

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
        return UserService.getItem(id)
            .then(data => {
                setValue('name', data?.name)
                setValue('email', data?.email)
                setValue(
                    'roles',
                    data?.roles?.map(r => r.value),
                )
                setValue(
                    'permissions',
                    data?.permissions?.map(p => p.value),
                )

                setSelectedRoles(data?.roles?.map(r => r.value))
                setSelectedPermissions(data?.permissions?.map(p => p.value))
            })

            .catch(e => {
                alert(e)
            })
    }

    const onSubmit = async data => {
        await csrf()
        setSaving(true)
        UserService.createOrUpdate(id, data, images)
            .then(r => {
                router.push('/users/' + r.data?.id)
            })
            .catch(error => {
                showToast(
                    error?.response?.data?.message ?? 'Unknown error',
                    'error',
                )
            })
            .finally(() => {
                setSaving(false)
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
                            'Add New User'
                        ) : (
                            <div className={'flex justify-content-between'}>
                                <div />
                                <div>Edit User</div>
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
                        <div className={'col-12 md:col-6'}>
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
                                <TextInput
                                    control={control}
                                    name={'email'}
                                    label={'Email'}
                                    rules={{
                                        required: 'Email is required.',
                                    }}
                                />
                                {getFormErrorMessage('email')}
                            </div>
                            {mode === 'edit' && !editingPassword && (
                                <div className="field">
                                    <Button
                                        className="p-button-link"
                                        onClick={() => {
                                            setEditingPassword(true)
                                        }}>
                                        <>
                                            <IconEdit className="mr-2" />
                                            <span>Change Password</span>
                                        </>
                                    </Button>
                                </div>
                            )}
                            {editingPassword && (
                                <>
                                    <div className="field -mb-4">
                                        <Button
                                            className={'p-button-link'}
                                            onClick={() => {
                                                setEditingPassword(false)
                                            }}>
                                            <>
                                                <IconX className="mr-2" />
                                                <span>Cancel</span>
                                            </>
                                        </Button>
                                    </div>
                                    <div className="field">
                                        <PasswordInput
                                            control={control}
                                            name={'current_password'}
                                            label={'Current Password'}
                                            rules={{
                                                required:
                                                    'Current password is required.',
                                            }}
                                        />
                                        {getFormErrorMessage(
                                            'current_password',
                                        )}
                                    </div>
                                </>
                            )}

                            {mode === 'create' ||
                                (editingPassword && (
                                    <>
                                        <div className="field">
                                            <PasswordInput
                                                control={control}
                                                name={'password'}
                                                label={'Password'}
                                                rules={{
                                                    required:
                                                        'Password is required.',
                                                    validate: value => {
                                                        if (
                                                            !/[A-Z]/.test(value)
                                                        ) {
                                                            return 'Password must contain at least one uppercase letter'
                                                        }
                                                        if (
                                                            !/[a-z]/.test(value)
                                                        ) {
                                                            return 'Password must contain at least one lowercase letter'
                                                        }
                                                        if (
                                                            !/[0-9]/.test(value)
                                                        ) {
                                                            return 'Password must contain at least one number'
                                                        }
                                                        if (
                                                            !/[!@#$%^&*(),.?":{}|<>]/.test(
                                                                value,
                                                            )
                                                        ) {
                                                            return 'Password must contain at least one special character'
                                                        }
                                                    },
                                                }}
                                            />
                                            {getFormErrorMessage('password')}
                                        </div>

                                        {mode === 'create' ||
                                            (editingPassword && (
                                                <>
                                                    {' '}
                                                    <div className="field">
                                                        <PasswordInput
                                                            control={control}
                                                            name={
                                                                'password_confirmation'
                                                            }
                                                            label={
                                                                'Password (Confirm)'
                                                            }
                                                            rules={{
                                                                required:
                                                                    'Password confirmation is required.',
                                                                validate: validateConfirmPassword,
                                                            }}
                                                        />
                                                        {getFormErrorMessage(
                                                            'password_confirmation',
                                                        )}
                                                    </div>
                                                </>
                                            ))}
                                    </>
                                ))}
                            <div className="field">
                                <MultiselectInput
                                    name="roles"
                                    label="Roles"
                                    control={control}
                                    optionsEndpoint={'/api/authorization/roles'}
                                    optionValue="value"
                                    optionLabel="label"
                                    filter={true}
                                    value={selectedRoles}
                                    rules={{
                                        required: 'Role(s) required.',
                                    }}
                                    onChange={e => {
                                        setSelectedRoles(e.value)
                                        setValue('roles', e.value)
                                    }}
                                />
                            </div>
                            <div className="field">
                                <MultiselectInput
                                    name="permissions"
                                    label="Extended Permissions (optional)"
                                    control={control}
                                    optionsEndpoint={
                                        '/api/authorization/permissions'
                                    }
                                    optionValue="value"
                                    optionLabel="label"
                                    filter={true}
                                    value={selectedPermissions}
                                    onChange={e => {
                                        setSelectedPermissions(e.value)
                                        setValue('permissions', e.value)
                                    }}
                                />
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
                        <Button
                            type="submit"
                            label="Save"
                            className="mt-2"
                            disabled={saving}
                        />
                    </div>
                </div>
            </form>

            <br />
        </>
    )
}

export default React.memo(UserForm)
