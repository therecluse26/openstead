import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import UserService from '../../../services/Users/UserService'
import LinkButton from '@/components/LinkButton'
import ScalableTag from '@/components/ScalableTag'
import Notes from '@/components/Notes'
import Spinner from '@/components/Spinner'
import Restrict from '@/components/Authorization/Restrict'
import ImageGallery from '../../../components/Images/ImageGallery'
import { Card } from 'primereact/card'
import { User } from '@/types/User'

interface UserDetailData extends User {
    primary_image?: string
    roles?: Array<{ value: string; label: string }>
    allPermissions?: Array<{ value: string; label: string }>
}

const UserDetail: NextPage = () => {
    const isMounted = useRef<boolean>(false)
    const [userData, setUserData] = useState<UserDetailData | undefined>(
        undefined,
    )
    const router = useRouter()
    const { query, isReady } = useRouter()
    const { id } = query

    const loadData = async (): Promise<void> => {
        if (!isReady || !id) {
            return
        }

        try {
            const data = await UserService.getItem(id as string)
            setUserData(data)
        } catch (error) {
            alert(error)
        }
    }

    const deleteItem = async (): Promise<void> => {
        if (!id) return
        await UserService.deleteItem(id as string)
    }

    const confirmDelete = async (): Promise<void> => {
        if (confirm('Are you sure you want to delete this user?')) {
            await deleteItem()
            router.push('/users')
        }
    }

    // Load initial data
    useEffect(() => {
        isMounted.current = true
        loadData()
    }, [id])

    return (
        <>
            {!userData?.id ? (
                <div className="card flex justify-content-center">
                    <Spinner />
                </div>
            ) : (
                <Restrict permission="user:read" showMessage>
                    <Card>
                        <div className="grid">
                            <div
                                className="col-12 sm:col-fixed"
                                style={{ width: '100px' }}>
                                <LinkButton href={'/users'} text={'< Back'} />
                            </div>
                            <div className={'col-12 sm:col'}>
                                <h1 className={'text-center'}>
                                    {userData?.name}
                                </h1>
                            </div>
                            <div
                                className="col-12 sm:col-fixed"
                                style={{ width: '200px' }}>
                                <Restrict permission="user:update">
                                    <LinkButton
                                        href={`/users/${userData?.id}/edit`}
                                        leftIcon={'ti ti-edit'}
                                        text={' Edit'}
                                    />
                                </Restrict>
                                <Restrict permission="user:create">
                                    <LinkButton
                                        href={`/users/add`}
                                        leftIcon={'ti ti-plus'}
                                        text={' New'}
                                    />
                                </Restrict>
                            </div>
                        </div>

                        <div className="grid">
                            <div className={'col-12 md:col-4'}>
                                <ImageGallery
                                    images={[userData?.primary_image]}
                                />
                            </div>
                            <div className={'col-12 md:col-8'}>
                                <h4 className={'text-muted mb-5'}>
                                    {userData?.email}
                                </h4>

                                {userData?.roles.length > 0 && (
                                    <div className="flex flex-wrap gap-2 align-items-center mb-2">
                                        <span className="text-xl mr-2">
                                            Roles:
                                        </span>
                                        {userData?.roles?.map(role => (
                                            <ScalableTag
                                                key={'role_' + role.value}
                                                text={role.label}
                                                condition={'success'}
                                            />
                                        ))}
                                    </div>
                                )}

                                <br />
                                {userData?.allPermissions.length > 0 && (
                                    <div className="flex flex-wrap gap-2 align-items-center">
                                        <span className="text-xl mr-2">
                                            Permissions:
                                        </span>
                                        {userData?.allPermissions?.map(perm => (
                                            <span key={'perm_' + perm.value}>
                                                <ScalableTag
                                                    text={perm.label}
                                                    condition={'warning'}
                                                />
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                    <Restrict permission="note:read">
                        <Notes parentId={id as string} parentType={'user'} />
                    </Restrict>
                </Restrict>
            )}
        </>
    )
}

export default UserDetail
