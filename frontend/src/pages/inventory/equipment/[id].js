import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Card } from 'primereact/card'
import { useRouter } from 'next/router'
import EquipmentService from '@/services/inventory/EquipmentService'
import { Galleria } from 'primereact/galleria'
import LinkButton from '@/components/LinkButton'
import { Skeleton } from 'primereact/skeleton'
import { Rating } from 'primereact/rating'
import ScalableTag from '@/components/ScalableTag'
import InventoryCard from '@/components/Inventory/InventoryCard'
import Link from 'next/link'

const EquipmentDetail = () => {
    const isMounted = useRef(false)
    const [equipmentData, setEquipmentData] = useState()
    const [similarItems, setSimilarItems] = useState()
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
                className={'border-round'}
                src={item?.url}
                onError={e =>
                    (e.target.src =
                        'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')
                }
                alt={item?.alt}
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

    useEffect(() => {
        isMounted.current = true
        loadData()
        loadSimilarItems()
    }, [id])

    const SimilarItemsTemplate = () => {
        return similarItems?.length > 0
            ? similarItems?.map(item => {
                  return (
                      <InventoryCard key={'item_' + item.id} gap={2}>
                          <Link
                              href={`/inventory/equipment/${item.id}`}
                              title={item.name}>
                              <span className={'text-2xl cursor-pointer'}>
                                  {item.name}
                              </span>
                          </Link>
                          <div className={'mt-4'}>{item.description}</div>
                      </InventoryCard>
                  )
              })
            : null
    }

    const ServiceLogsTemplate = () => {
        return equipmentData?.service_logs?.length > 0
            ? equipmentData?.service_logs?.map(item => {
                  return (
                      <div key={`service_log_${item.id}`} className={'mb-4'}>
                          {JSON.stringify(item)}
                      </div>
                  )
              })
            : null
    }

    const PageSkeleton = (
        <Card>
            <div className="grid">
                <div className="col-12 sm:col-fixed" style={{ width: '100px' }}>
                    <Skeleton width="100%" height="30px" />
                </div>
                <div className={'col-12 sm:col'}>
                    <h2 className={'text-center'}>
                        <Skeleton width="100%" height="30px" />
                    </h2>
                </div>
            </div>
            <div className="grid custom-skeleton p-4">
                <div className={'col-12 md:col-6'}>
                    <Skeleton width="100%" height="400px" />
                </div>

                <div className={'col-12 md:col-6'}>
                    <Skeleton width="100%" height="2rem" className={'mb-4'} />
                    <Skeleton width="100%" height="2rem" className={'my-4'} />
                    <Skeleton width="100%" height="2rem" className={'my-4'} />
                    <Skeleton width="100%" height="2rem" className={'my-4'} />
                    <Skeleton width="100%" height="2rem" className={'my-4'} />
                </div>
            </div>
        </Card>
    )

    return (
        <Suspense fallback={PageSkeleton}>
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
                        style={{ width: '100px' }}>
                        <LinkButton
                            href={`/inventory/equipment/${equipmentData?.id}/edit`}
                            leftIcon={'ti ti-edit'}
                            text={' Edit'}
                        />
                    </div>
                </div>

                <div className="grid">
                    <div className={'col-12 md:col-4'}>
                        <Galleria
                            value={equipmentData?.images}
                            responsiveOptions={responsiveOptions}
                            numVisible={5}
                            style={{ maxWidth: '600px' }}
                            item={galleryTemplate}
                            showThumbnails={false}
                            showIndicators
                            showItemNavigators
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

                        <ServiceLogsTemplate />
                    </div>
                </div>
            </Card>
            <div className={'mt-4 align-content-end'}>
                <h5 className={'text-center'}>Similar Items</h5>

                <div
                    className={
                        'flex flex-nowrap overflow-x-scroll styled-scroll pb-3'
                    }>
                    <SimilarItemsTemplate />
                </div>
            </div>
        </Suspense>
    )
}

export default React.memo(EquipmentDetail)
