import React from 'react'
import LinkButton from '@/components/LinkButton'
import PantryForm from '../../../forms/Inventory/PantryForm'

const CreatePantryItem = () => {
    return (
        <>
            <LinkButton href={'/inventory/pantry'} text={'< Back'} />{' '}
            <PantryForm />
        </>
    )
}

export default React.memo(CreatePantryItem)
