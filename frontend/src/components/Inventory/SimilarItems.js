import InventoryCard from '@/components/Inventory/InventoryCard'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Spinner from '@/components/Spinner'

const SimilarItems = ({ type, id, getItemsCallback, titleField = 'name' }) => {
    const isMounted = useRef(false)
    const { isReady } = useRouter()
    const [similarItems, setSimilarItems] = useState([])
    const [loaded, setLoaded] = useState(false)

    const loadSimilarItems = id => {
        if (!isReady) {
            return
        }
        getItemsCallback(id)
            .then(data => {
                setSimilarItems(data)
            })
            .catch(e => {
                alert(e)
            })
            .finally(() => {
                setLoaded(true)
            })
    }

    // Load initial data
    useEffect(() => {
        isMounted.current = true
        if (id && getItemsCallback) {
            loadSimilarItems(id)
        }
    }, [id, getItemsCallback])

    return (
        <div className={'my-4'}>
            {!loaded ? (
                <div className="card flex justify-content-center">
                    <Spinner />
                </div>
            ) : (
                <>
                    {similarItems?.length > 0 && (
                        <div className={'mt-4 align-content-end'}>
                            <h5 className={'text-center'}>Similar Items</h5>

                            <div
                                className={
                                    'flex flex-nowrap overflow-x-scroll styled-scroll pb-3'
                                }>
                                {similarItems?.map(item => {
                                    return (
                                        <InventoryCard
                                            key={'item_' + item.id}
                                            gap={2}>
                                            <Link
                                                href={`/inventory/${type}/${item.id}`}
                                                title={item[titleField]}>
                                                <span
                                                    className={
                                                        'text-2xl cursor-pointer  text-center '
                                                    }>
                                                    {item.name}
                                                </span>
                                            </Link>
                                            {item?.description && (
                                                <div className={'mt-4'}>
                                                    {item.description}
                                                </div>
                                            )}

                                            <div className={'text-center mt-4'}>
                                                {item?.quantity > 1 && (
                                                    <span
                                                        className={'text-3xl'}>
                                                        Quantity:{' '}
                                                        {item.quantity}
                                                    </span>
                                                )}
                                            </div>
                                        </InventoryCard>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default SimilarItems
