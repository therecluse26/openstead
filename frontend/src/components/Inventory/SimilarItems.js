import InventoryCard from '@/components/Inventory/InventoryCard'
import Link from 'next/link'
import React from 'react'

const SimilarItemsTemplate = ({ similarItems = [] }) => {
    return similarItems?.map(item => {
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
}

export default SimilarItemsTemplate
