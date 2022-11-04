import InventoryCard from '@/components/Inventory/InventoryCard'
import Link from 'next/link'
import React from 'react'
import { getAgeInYears } from '@/utils/FormatDate'

const SimilarItemsTemplate = ({ similarItems = [], type = 'equipment' }) => {
    return similarItems?.map(item => {
        return (
            <InventoryCard key={'item_' + item.id} gap={2}>
                <Link href={`/inventory/${type}/${item.id}`} title={item.name}>
                    <span className={'text-2xl cursor-pointer  text-center '}>
                        {item.name}
                    </span>
                </Link>
                {item?.description ? (
                    <div className={'mt-4'}>{item.description}</div>
                ) : null}

                <div className={'text-center mt-4'}>
                    {item?.quantity === 1 && item?.date_of_birth ? (
                        <span className={'text-3xl'}>
                            {getAgeInYears(item.date_of_birth)} {' year old '}
                        </span>
                    ) : null}

                    {item?.quantity === 1 && item?.sex ? (
                        <span className={'text-5xl'}>{item.sex.icon}</span>
                    ) : null}

                    {item?.quantity > 1 ? (
                        <span className={'text-3xl'}>
                            Quantity: {item.quantity}
                        </span>
                    ) : null}
                </div>
            </InventoryCard>
        )
    })
}

export default SimilarItemsTemplate
