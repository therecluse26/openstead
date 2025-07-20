import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import SeedService from '@/services/Inventory/SeedService'
import InventoryDetailCard from '@/components/Inventory/InventoryDetailCard'
import LinkButton from '@/components/LinkButton'
import { formatDate } from '@/utils/FormatDate'
import ScalableTag from '@/components/ScalableTag'
import Notes from '@/components/Notes'
import SimilarItems from '@/components/Inventory/SimilarItems'
import { Seed } from '@/types/Inventory'

const SeedDetail: NextPage = () => {
    const isMounted = useRef(false)
    const [data, setData] = useState<Seed | undefined>()
    const { query, isReady } = useRouter()
    const { id } = query

    const loadData = () => {
        if (!isReady) {
            return
        }
        SeedService.getItem(id as string)
            .then((data: Seed) => {
                setData(data)
            })
            .catch((e: any) => {
                alert(e)
            })
    }

    useEffect(() => {
        isMounted.current = true
        loadData()
    }, [id])

    return (
        <>
            <InventoryDetailCard
                data={data}
                header={
                    <>
                        <div
                            className="col-12 sm:col-fixed"
                            style={{ width: '100px' }}>
                            <LinkButton
                                href={'/inventory/seeds'}
                                text={'< Back'}
                            />
                        </div>
                        <div className={'col-12 sm:col'}>
                            <h1 className={'text-center'}>
                                {data?.variety?.variety_name}
                            </h1>
                        </div>
                        <div
                            className="col-12 sm:col-fixed"
                            style={{ width: '200px' }}>
                            <LinkButton
                                href={`/inventory/seeds/${data?.id}/edit`}
                                leftIcon={'ti ti-edit'}
                                text={' Edit'}
                            />

                            <LinkButton
                                href={`/inventory/seeds/add`}
                                leftIcon={'ti ti-plus'}
                                text={' New'}
                            />
                        </div>
                    </>
                }>
                <div className={'col-12 md:col-8'}>
                    <div className={'flex align-content-center mb-4'}>
                        <span className={'align-self-center text-2xl mr-2'}>
                            Type: {data?.variety?.group_type?.icon}
                            {data?.variety?.group_type?.label}
                        </span>
                    </div>

                    <div className={'flex align-content-center mb-4'}>
                        <span className={'align-self-center text-xl mr-2'}>
                            Lifecycle: {data?.life_cycle?.label}
                        </span>
                    </div>

                    <div className={'flex align-content-center mb-4'}>
                        <span className={'align-self-center text-xl mr-2'}>
                            Light: {data?.light_requirement?.icon}{' '}
                            {data?.light_requirement?.label}
                        </span>
                    </div>

                    {data?.zone_lower && data?.zone_upper && (
                        <div className={'flex align-content-center mb-4'}>
                            <span className={'align-self-center text-xl mr-2'}>
                                Hardiness Zones: {data?.zone_lower?.label}
                                {' - '}
                                {data?.zone_upper?.label}
                            </span>
                        </div>
                    )}

                    {data?.acquired_at && (
                        <div className={'flex align-content-center mb-4'}>
                            <span className={'align-self-center text-2xl mr-2'}>
                                Date Acquired: {formatDate(data?.acquired_at)}
                            </span>
                        </div>
                    )}

                    {data?.quantity === 0 ? (
                        <ScalableTag
                            condition={'danger'}
                            text={'Out Of Stock'}
                        />
                    ) : data?.quantity > 1 ? (
                        <div
                            className={
                                'flex align-content-center mb-4 align-self-center text-2xl mr-2'
                            }>
                            Quantity: {data?.quantity}
                        </div>
                    ) : (
                        <></>
                    )}

                    <div className={'row my-4'}>
                        <span className={'text-lg'}>{data?.description}</span>
                    </div>

                    {data?.url && (
                        <div className={'row my-4'}>
                            <LinkButton
                                href={data?.url}
                                text={'Purchase'}
                                external={true}
                                rightIcon={'ti ti-external-link'}
                            />
                        </div>
                    )}
                </div>
            </InventoryDetailCard>

            <Notes parentId={id} parentType={'seed'} />

            <SimilarItems
                id={id}
                getItemsCallback={SeedService.getSimilarItems}
                type={'seeds'}
            />
        </>
    )
}

export default React.memo(SeedDetail)
