import React from 'react'
import EquipmentForm from '@/components/Forms/Inventory/EquipmentForm'

const EditEquipment = () => {
    return <EquipmentForm mode={'edit'} />
}

export default React.memo(EditEquipment)
