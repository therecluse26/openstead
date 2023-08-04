import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import InventoryDetailCard from '@/components/Inventory/InventoryDetailCard'
import LinkButton from '@/components/LinkButton'
import { formatDate } from '@/utils/FormatDate'
import Notes from '@/components/Notes'
import SimilarItems from '@/components/Inventory/SimilarItems'
import PantryService from '../../../../services/Inventory/PantryService'

const PantryDetail = () => {
    const isMounted = useRef(false)
    const [data, setData] = useState()
    const { query, isReady } = useRouter()
    const { id } = query

    const loadData = () => {
        if (!isReady) {
            return
        }
        PantryService.getItem(id)
            .then(data => {
                setData(data)
            })
            .catch(e => {
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
                                href={'/inventory/pantry'}
                                text={'< Back'}
                            />
                        </div>
                        <div className={'col-12 sm:col'}>
                            <h1 className={'text-center'}>{data?.name}</h1>
                        </div>
                        <div
                            className="col-12 sm:col-fixed"
                            style={{ width: '200px' }}>
                            <LinkButton
                                href={`/inventory/pantry/${data?.id}/edit`}
                                leftIcon={'ti ti-edit'}
                                text={' Edit'}
                            />

                            <LinkButton
                                href={`/inventory/pantry/add`}
                                leftIcon={'ti ti-plus'}
                                text={' New'}
                            />
                        </div>
                    </>
                }>
                <div className={'col-12 md:col-8'}>
                    <div className={'row'}>
                        <div className={'col-12'}>
                            <h2>Details</h2>

                            <div className={'row'}>
                                <div className={'col-12 md:col-6'}>
                                    <p>
                                        <strong>Quantity:</strong>{' '}
                                        {data?.quantity}
                                    </p>

                                    <p>
                                        <strong>Expiration Date:</strong>{' '}
                                        {formatDate(data?.expiration_date)}
                                    </p>

                                    <p>
                                        <strong>Storage Type:</strong>{' '}
                                        {data?.storage_type}
                                    </p>

                                    <p>
                                        <strong>Unit:</strong> {data?.unit}
                                    </p>

                                    <p>
                                        <strong>Unit Amount:</strong>{' '}
                                        {data?.unit_amount}
                                    </p>

                                    <p>
                                        <strong>Shelf Life (Months):</strong>{' '}
                                        {data?.shelf_life_months}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </InventoryDetailCard>

            <Notes parentId={id} parentType={'pantry_item'} />

            <SimilarItems
                id={id}
                getItemsCallback={PantryService.getSimilarItems}
                type={'pantry'}
            />
        </>
    )
}

export default React.memo(PantryDetail)
