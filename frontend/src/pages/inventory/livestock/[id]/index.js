import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Card } from 'primereact/card'
import { useRouter } from 'next/router'
import LivestockService from '@/services/inventory/LivestockService'
import LinkButton from '@/components/LinkButton'
import ScalableTag from '@/components/ScalableTag'
import InventorySkeleton from '@/components/Inventory/InventorySkeleton'
import SimilarItemsTemplate from '@/components/Inventory/SimilarItems'
import { formatDate } from '@/utils/FormatDate'
import { Galleria } from 'primereact/galleria'
import { Button } from 'primereact/button'

const LivestockDetail = () => {
    const isMounted = useRef(false)
    const [livestockData, setLivestockData] = useState()
    const [similarItems, setSimilarItems] = useState()
    const router = useRouter()
    const { query, isReady } = useRouter()
    const { id } = query

    const loadSimilarItems = () => {
        if (!isReady) {
            return
        }
        LivestockService.getSimilarItems(id)
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
                alt={'Livestock image'}
                style={{ width: '100%' }}
            />
        )
    }

    const loadData = () => {
        if (!isReady) {
            return
        }
        LivestockService.getItem(id)
            .then(data => {
                setLivestockData(data)
            })
            .catch(e => {
                alert(e)
            })
    }

    const deleteLivestock = async () => {
        await LivestockService.deleteItem(id)
    }

    const confirmDelete = () => {
        if (confirm('Are you sure you want to delete this item?')) {
            deleteLivestock()
            router.push('/inventory/livestock')
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
                            href={'/inventory/livestock'}
                            text={'< Back'}
                        />
                    </div>
                    <div className={'col-12 sm:col'}>
                        <h1 className={'text-center'}>{livestockData?.name}</h1>
                    </div>
                    <div
                        className="col-12 sm:col-fixed"
                        style={{ width: '200px' }}>
                        <LinkButton
                            href={`/inventory/livestock/${livestockData?.id}/edit`}
                            leftIcon={'ti ti-edit'}
                            text={' Edit'}
                        />

                        <LinkButton
                            href={`/inventory/livestock/add`}
                            leftIcon={'ti ti-plus'}
                            text={' New'}
                        />
                    </div>
                </div>

                <div className="grid">
                    <div className={'col-12 md:col-4'}>
                        <Galleria
                            value={[livestockData?.primary_image]}
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
                                Type: {livestockData?.variety?.group_type?.icon}{' '}
                                {livestockData?.variety?.group_type?.label}
                            </span>
                        </div>

                        <div className={'flex align-content-center mb-4'}>
                            <span className={'align-self-center text-2xl mr-2'}>
                                Breed: {livestockData?.variety?.variety_name}{' '}
                            </span>
                        </div>

                        {livestockData?.quantity === 1 && livestockData?.sex ? (
                            <div className={'flex align-content-center mb-4'}>
                                <span
                                    className={
                                        'align-self-center text-2xl mr-2'
                                    }>
                                    <span
                                        className={
                                            'text-2xl align-self-center'
                                        }>
                                        {livestockData?.sex?.label}{' '}
                                        {livestockData?.sex?.icon}
                                    </span>
                                </span>
                            </div>
                        ) : null}

                        {livestockData?.quantity === 1 &&
                        livestockData?.date_of_birth ? (
                            <div className={'flex align-content-center mb-4'}>
                                <span
                                    className={
                                        'align-self-center text-2xl mr-2'
                                    }>
                                    Date Of Birth:{' '}
                                    {formatDate(livestockData?.date_of_birth)}
                                </span>
                            </div>
                        ) : null}

                        {livestockData?.quantity === 1 &&
                        livestockData?.acquired_at ? (
                            <div className={'flex align-content-center mb-4'}>
                                <span
                                    className={
                                        'align-self-center text-2xl mr-2'
                                    }>
                                    Date Acquired:{' '}
                                    {formatDate(livestockData?.acquired_at)}
                                </span>
                            </div>
                        ) : null}

                        {livestockData?.quantity === 0 ? (
                            <ScalableTag
                                condition={'danger'}
                                text={'Out Of Stock'}
                            />
                        ) : livestockData?.quantity > 1 ? (
                            <div
                                className={
                                    'flex align-content-center mb-4 align-self-center text-2xl mr-2'
                                }>
                                Quantity: {livestockData?.quantity}
                            </div>
                        ) : (
                            <></>
                        )}

                        <div className={'row my-4'}>
                            <span className={'text-lg'}>
                                {livestockData?.description}
                            </span>
                        </div>

                        {livestockData?.url ? (
                            <div className={'row my-4'}>
                                <LinkButton
                                    href={livestockData?.url}
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

            {similarItems?.length > 0 ? (
                <div className={'mt-4 align-content-end'}>
                    <h5 className={'text-center'}>Similar Items</h5>

                    <div
                        className={
                            'flex flex-nowrap overflow-x-scroll styled-scroll pb-3'
                        }>
                        <SimilarItemsTemplate
                            similarItems={similarItems}
                            type={'livestock'}
                        />
                    </div>
                </div>
            ) : null}
        </Suspense>
    )
}

export default React.memo(LivestockDetail)
