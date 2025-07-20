import React from 'react'
import { NextPage } from 'next'
import EquipmentForm from '@/forms/Inventory/EquipmentForm'
import LinkButton from '@/components/LinkButton'

const CreateEquipment: NextPage = () => {
    return (
        <>
            {' '}
            <LinkButton href={'/inventory/equipment'} text={'< Back'} />{' '}
            <EquipmentForm />
        </>
    )
}

export default React.memo(CreateEquipment)
