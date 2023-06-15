import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import EquipmentService from '@/services/inventory/EquipmentService'
import LinkButton from '@/components/LinkButton'
import { Rating } from 'primereact/rating'
import ScalableTag from '@/components/ScalableTag'
import ServiceLogsTimeline from '@/components/Custom/Services/ServiceLogsTimeline'
import { formatDate } from '@/utils/FormatDate'
import { Button } from 'primereact/button'
import Notes from '@/components/Custom/Notes'
import InventoryDetailCard from '@/components/Custom/Inventory/InventoryDetailCard'
import SimilarItems from '@/components/Inventory/SimilarItems'

const EquipmentDetail = () => {
    const isMounted = useRef(false)
    const [equipmentData, setEquipmentData] = useState()
    const router = useRouter()
    const { query, isReady } = useRouter()
    const { id } = query

    const loadData = () => {
        if (!isReady) {
            return
        }
        EquipmentService.getItem(id)
            .then(data => {
                setEquipmentData(data)
            })
            .catch(e => {
                alert(e)
            })
    }

    const deleteEquipment = async () => {
        await EquipmentService.deleteItem(id)
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
                            <LinkButton
                                href={`/inventory/equipment/${equipmentData?.id}/edit`}
                                leftIcon={'ti ti-edit'}
                                text={' Edit'}
                            />

                            <LinkButton
                                href={`/inventory/equipment/add`}
                                leftIcon={'ti ti-plus'}
                                text={' New'}
                            />
                        </div>
                    </>
                }
                footer={
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
                            <span className={'align-self-center text-2xl mr-2'}>
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
                            <span className={'align-self-center text-2xl mr-2'}>
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
                            <span className={'align-self-center text-2xl mr-2'}>
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
