import React from 'react'
import { NextPage } from 'next'
import EquipmentForm from '@/forms/Inventory/EquipmentForm'

const EditEquipment: NextPage = () => {
    return <EquipmentForm mode={'edit'} />
}

export default React.memo(EditEquipment)
