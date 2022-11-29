import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import LivestockService from '@/services/inventory/LivestockService'
import FamilyTree from '@/components/Custom/Livestock/FamilyTree'
import ServiceLogsTimeline from '@/components/Custom/Services/ServiceLogsTimeline'
import Notes from '@/components/Custom/Notes'
import InventoryDetailCard from '@/components/Custom/Inventory/InventoryDetailCard'
import LinkButton from '@/components/LinkButton'
import { Button } from 'primereact/button'
import { formatDate } from '@/utils/FormatDate'
import ScalableTag from '@/components/ScalableTag'
import SimilarItems from '@/components/Inventory/SimilarItems'

const LivestockDetail = () => {
    const isMounted = useRef(false)
    const [livestockData, setLivestockData] = useState()
    const router = useRouter()
    const { query, isReady } = useRouter()
    const { id } = query

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

    const markLivestockDeceased = async () => {
        await LivestockService.markDeceased(id)
    }

    const confirmDeceased = async () => {
        if (confirm(`Are you sure you want to mark this animal as deceased?`)) {
            await markLivestockDeceased()
            router.reload()
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
                data={livestockData}
                header={
                    <>
                        <div
                            className="col-12 sm:col-fixed"
                            style={{ width: '100px' }}>
                            <LinkButton
                                href={'/inventory/livestock'}
                                text={'< Back'}
                            />
                        </div>
                        <div className={'col-12 sm:col'}>
                            <h1 className={'text-center'}>
                                {livestockData?.name}
                                {livestockData?.date_of_death
                                    ? ' (deceased)'
                                    : null}
                            </h1>
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
                    </>
                }
                footer={
                    <div className="col-12 sm:col-fixed text-right">
                        <Button
                            className={'p-button-danger'}
                            onClick={confirmDeceased}>
                            <span>{'Mark Deceased'}</span>
                        </Button>
                    </div>
                }>
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

                    {livestockData?.quantity === 1 && livestockData?.sex && (
                        <div className={'flex align-content-center mb-4'}>
                            <span className={'align-self-center text-2xl mr-2'}>
                                <span className={'text-2xl align-self-center'}>
                                    {livestockData?.sex?.label}{' '}
                                    {livestockData?.sex?.icon}
                                </span>
                            </span>
                        </div>
                    )}

                    {livestockData?.quantity === 1 &&
                        livestockData?.date_of_birth && (
                            <div className={'flex align-content-center mb-4'}>
                                <span
                                    className={
                                        'align-self-center text-2xl mr-2'
                                    }>
                                    Date Of Birth:{' '}
                                    {formatDate(livestockData?.date_of_birth)}
                                </span>
                            </div>
                        )}

                    {livestockData?.quantity === 1 &&
                        livestockData?.acquired_at && (
                            <div className={'flex align-content-center mb-4'}>
                                <span
                                    className={
                                        'align-self-center text-2xl mr-2'
                                    }>
                                    Date Acquired:{' '}
                                    {formatDate(livestockData?.acquired_at)}
                                </span>
                            </div>
                        )}

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
                </div>
            </InventoryDetailCard>

            <FamilyTree
                original={livestockData}
                ancestors={livestockData?.family?.parents}
                offspring={livestockData?.family?.children}
                siblings={livestockData?.family?.siblings}
            />

            <ServiceLogsTimeline parentId={id} parentType={'livestock'} />

            <Notes parentId={id} parentType={'livestock'} />

            <SimilarItems
                id={id}
                getItemsCallback={LivestockService.getSimilarItems}
                type={'livestock'}
            />
        </>
    )
}

export default React.memo(LivestockDetail)
