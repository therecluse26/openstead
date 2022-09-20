import React from 'react'
import InventoryList from '@/components/Layouts/Inventory/InventoryList'

const Inventory = () => {
    return (
        <InventoryList title={'Inventory'}>
            <p>Inventory</p>
        </InventoryList>
    )
}

export default React.memo(Inventory)