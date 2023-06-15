import React from 'react'
import EquipmentForm from '@/forms/Inventory/EquipmentForm'
import LinkButton from '@/components/LinkButton'

const CreateEquipment = () => {
    return (
        <>
            {' '}
            <LinkButton href={'/inventory/equipment'} text={'< Back'} />{' '}
            <EquipmentForm />
        </>
    )
}

export default React.memo(CreateEquipment)
