import React from 'react'
import InventoryList from '@/components/Layouts/Inventory/InventoryList'

const Livestock = () => {
    return (
        <InventoryList title={'Livestock'}>
            <p>Livestock</p>
        </InventoryList>
    )
}

export default React.memo(Livestock)
