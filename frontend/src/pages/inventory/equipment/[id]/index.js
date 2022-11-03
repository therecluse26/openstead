import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Card } from 'primereact/card'
import { useRouter } from 'next/router'
import EquipmentService from '@/services/inventory/EquipmentService'
import LinkButton from '@/components/LinkButton'
import { Rating } from 'primereact/rating'
import ScalableTag from '@/components/ScalableTag'
import InventorySkeleton from '@/components/Inventory/InventorySkeleton'
import ServiceLogsTimeline from '@/components/Custom/Services/ServiceLogsTimeline'
import SimilarItemsTemplate from '@/components/Inventory/SimilarItems'
import { formatDate } from '@/utils/FormatDate'
import { Galleria } from 'primereact/galleria'
import { Button } from 'primereact/button'

const EquipmentDetail = () => {
    const isMounted = useRef(false)
    const [equipmentData, setEquipmentData] = useState()
    const [similarItems, setSimilarItems] = useState()
    const router = useRouter()
    const { query, isReady } = useRouter()
    const { id } = query

    const loadSimilarItems = () => {
        if (!isReady) {
            return
        }
        EquipmentService.getSimilarItems(id)
            .then(data => {
                setSimilarItems(data)
            })
            .catch(e => {
                alert(e)
            })
    }

    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 5,
        },
        {
            breakpoint: '768px',
            numVisible: 3,
        },
        {
            breakpoint: '560px',
            numVisible: 1,
        },
    ]

    const galleryTemplate = item => {
        return (
            <img
                className={'border-round inventory-primary-image'}
                src={item}
                alt={'Equipment image'}
                style={{ width: '100%' }}
            />
        )
    }

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
        loadSimilarItems()
    }, [id])

    return (
        <Suspense fallback={InventorySkeleton}>
            <Card>
                <div className="grid">
                    <div
                        className="col-12 sm:col-fixed"
                        style={{ width: '100px' }}>
                        <LinkButton
                            href={'/inventory/equipment'}
                            text={'< Back'}
                        />
                    </div>
                    <div className={'col-12 sm:col'}>
                        <h1 className={'text-center'}>{equipmentData?.name}</h1>
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
                </div>

                <div className="grid">
                    <div className={'col-12 md:col-4'}>
                        <Galleria
                            value={[equipmentData?.primary_image]}
                            responsiveOptions={responsiveOptions}
                            numVisible={1}
                            style={{ maxWidth: '400px' }}
                            item={galleryTemplate}
                            showThumbnails={false}
                        />
                    </div>
                    <div className={'col-12 md:col-8'}>
                        <div className={'flex align-content-center mb-4'}>
                            <span className={'align-self-center text-2xl mr-2'}>
                                Type: {equipmentData?.type?.icon}{' '}
                                {equipmentData?.type?.label}
                            </span>
                        </div>
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

                        {equipmentData?.acquired_at ? (
                            <div className={'flex align-content-center mb-4'}>
                                <span
                                    className={
                                        'align-self-center text-2xl mr-2'
                                    }>
                                    Date Acquired:{' '}
                                    {formatDate(equipmentData?.acquired_at)}
                                </span>
                            </div>
                        ) : null}

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

                        {equipmentData?.url ? (
                            <div className={'row my-4'}>
                                <LinkButton
                                    href={equipmentData?.url}
                                    text={'Purchase'}
                                    external={true}
                                    rightIcon={'ti ti-external-link'}
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
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
            </Card>

            <ServiceLogsTimeline
                // logs={equipmentData?.service_logs}

                parentId={id}
                parentType={'equipment'}
            />

            {similarItems?.length > 0 ? (
                <div className={'mt-4 align-content-end'}>
                    <h5 className={'text-center'}>Similar Items</h5>

                    <div
                        className={
                            'flex flex-nowrap overflow-x-scroll styled-scroll pb-3'
                        }>
                        <SimilarItemsTemplate similarItems={similarItems} />
                    </div>
                </div>
            ) : null}
        </Suspense>
    )
}

export default React.memo(EquipmentDetail)
