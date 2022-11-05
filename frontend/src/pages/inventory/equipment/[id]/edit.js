import React from 'react'
import EquipmentForm from '@/forms/Inventory/EquipmentForm'

const EditEquipment = () => {
    return <EquipmentForm mode={'edit'} />
}

export default React.memo(EditEquipment)
