import React from 'react'
import { NextPage } from 'next'
import LinkButton from '@/components/LinkButton'
import PantryForm from '../../../forms/Inventory/PantryForm'

const CreatePantryItem: NextPage = () => {
    return (
        <>
            <LinkButton href={'/inventory/pantry'} text={'< Back'} />{' '}
            <PantryForm />
        </>
    )
}

export default React.memo(CreatePantryItem)
