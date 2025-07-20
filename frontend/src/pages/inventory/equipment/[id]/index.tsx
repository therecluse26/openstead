import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import EquipmentService from '@/services/Inventory/EquipmentService'
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
import { Equipment } from '@/types/Inventory'

const EquipmentDetail: NextPage = () => {
    const isMounted = useRef(false)
    const [equipmentData, setEquipmentData] = useState<Equipment | undefined>()
    const router = useRouter()
    const { query, isReady } = useRouter()
    const { id } = query

    const loadData = () => {
        if (!isReady) {
            return
        }
        EquipmentService.getItem(id as string)
            .then((data: Equipment) => {
                setEquipmentData(data)
            })
            .catch((e: any) => {
                alert(e)
            })
    }

    const deleteEquipment = async () => {
        await EquipmentService.deleteItem(id as string)
    }

    const confirmDelete = () => {
        if (confirm('Are you sure you want to delete this item?')) {
            deleteEquipment()
            router.push('/inventory/equipment')
        }
    }

    // Load initial data
    useEffect(() => {
        isMounted.current = true
        loadData()
    }, [id])

    return (
        <>
            {!equipmentData?.id ? (
                <div className="card flex justify-content-center">
                    <Spinner />
                </div>
            ) : (
                <InventoryDetailCard
                    data={equipmentData}
                    header={
                        <>
                            <div
                                className="col-12 sm:col-fixed"
                                style={{ width: '100px' }}>
                                <LinkButton
                                    href={'/inventory/equipment'}
                                    text={'< Back'}
                                />
                            </div>
                            <div className={'col-12 sm:col'}>
                                <h1 className={'text-center'}>
                                    {equipmentData?.name}
                                </h1>
                            </div>
                            <div
                                className="col-12 sm:col-fixed"
                                style={{ width: '200px' }}>
                                <Restrict permission="inventory:update">
                                    <LinkButton
                                        href={`/inventory/equipment/${equipmentData?.id}/edit`}
                                        leftIcon={'ti ti-edit'}
                                        text={' Edit'}
                                    />
                                </Restrict>

                                <Restrict permission="inventory:create">
                                    <LinkButton
                                        href={`/inventory/equipment/add`}
                                        leftIcon={'ti ti-plus'}
                                        text={' New'}
                                    />
                                </Restrict>
                            </div>
                        </>
                    }
                    footer={
                        <Restrict permission="inventory:delete">
                            <div className="col-12 sm:col-fixed text-right">
                                <Button
                                    className={'p-button-danger'}
                                    onClick={confirmDelete}>
                                    <span>
                                        <i className={'ti ti-trash'} />
                                        {' Delete'}
                                    </span>
                                </Button>
                            </div>
                        </Restrict>
                    }>
                    <div className={'col-12 md:col-8'}>
                        <div className={'flex align-content-center mb-4'}>
                            <span className={'align-self-center text-2xl mr-2'}>
                                Type: {equipmentData?.type?.icon}{' '}
                                {equipmentData?.type?.label}
                            </span>
                        </div>
                        {equipmentData?.condition && (
                            <div className={'flex align-content-center mb-4'}>
                                <span
                                    className={
                                        'align-self-center text-2xl mr-2'
                                    }>
                                    Condition:
                                </span>
                                <Rating
                                    stars={5}
                                    cancel={false}
                                    readOnly={true}
                                    value={equipmentData?.condition}
                                    placeholder={
                                        equipmentData?.condition_description
                                    }
                                />
                            </div>
                        )}

                        {equipmentData?.rating && (
                            <div className={'flex align-content-center mb-4'}>
                                <span
                                    className={
                                        'align-self-center text-2xl mr-2'
                                    }>
                                    Rating:
                                </span>
                                <Rating
                                    stars={5}
                                    cancel={false}
                                    readOnly={true}
                                    value={equipmentData?.rating}
                                />
                            </div>
                        )}

                        {equipmentData?.acquired_at && (
                            <div className={'flex align-content-center mb-4'}>
                                <span
                                    className={
                                        'align-self-center text-2xl mr-2'
                                    }>
                                    Date Acquired:{' '}
                                    {formatDate(equipmentData?.acquired_at)}
                                </span>
                            </div>
                        )}

                        {equipmentData?.quantity === 0 ? (
                            <ScalableTag
                                condition={'danger'}
                                text={'Out Of Stock'}
                            />
                        ) : equipmentData?.quantity > 1 ? (
                            <div
                                className={
                                    'flex align-content-center mb-4 align-self-center text-2xl mr-2'
                                }>
                                Quantity: {equipmentData?.quantity}
                            </div>
                        ) : (
                            <></>
                        )}

                        <div className={'row my-4'}>
                            <span className={'text-lg'}>
                                {equipmentData?.description}
                            </span>
                        </div>

                        {equipmentData?.url && (
                            <div className={'row my-4'}>
                                <LinkButton
                                    href={equipmentData?.url}
                                    text={'Purchase'}
                                    external={true}
                                    rightIcon={'ti ti-external-link'}
                                />
                            </div>
                        )}
                    </div>
                </InventoryDetailCard>
            )}

            <ServiceLogsTimeline parentId={id} parentType={'equipment'} />

            <Notes parentId={id} parentType={'equipment'} />

            <SimilarItems
                getItemsCallback={EquipmentService.getSimilarItems}
                id={id}
                type={'equipment'}
            />
        </>
    )
}

export default React.memo(EquipmentDetail)
