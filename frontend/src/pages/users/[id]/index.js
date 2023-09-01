import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import UserService from '../../../services/Users/UserService'
import LinkButton from '@/components/LinkButton'
import { Rating } from 'primereact/rating'
import ScalableTag from '@/components/ScalableTag'
import ServiceLogsTimeline from '@/components/Services/ServiceLogsTimeline'
import { formatDate } from '@/utils/FormatDate'
import { Button } from 'primereact/button'
import Notes from '@/components/Notes'
import InventoryDetailCard from '@/components/Inventory/InventoryDetailCard'
import SimilarItems from '@/components/Inventory/SimilarItems'
import Spinner from '@/components/Spinner'
import Restrict from '@/components/Authorization/Restrict'
import { Galleria } from 'primereact/galleria'
import ImageGallery from '../../../components/Images/ImageGallery'
import { Card } from 'primereact/card'

export default function UserDetail() {
    const isMounted = useRef(false)
    const [userData, setUserData] = useState()
    const router = useRouter()
    const { query, isReady } = useRouter()
    const { id } = query

    const loadData = async () => {
        if (!isReady) {
            return
        }

        try {
            const data = await UserService.getItem(id)
            setUserData(data)
        } catch (error) {
            alert(error)
        }
    }

    const deleteItem = async () => {
        await UserService.deleteItem(id)
    }

    const confirmDelete = async () => {
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
                                <LinkButton
                                    href={`/users/${userData?.id}/edit`}
                                    leftIcon={'ti ti-edit'}
                                    text={' Edit'}
                                />

                                <LinkButton
                                    href={`/users/add`}
                                    leftIcon={'ti ti-plus'}
                                    text={' New'}
                                />
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
                    <Notes parentId={id} parentType={'user'} />
                </Restrict>
            )}
        </>
    )
}
