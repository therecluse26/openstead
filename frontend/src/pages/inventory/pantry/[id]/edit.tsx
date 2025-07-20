import React from 'react'
import { NextPage } from 'next'
import LinkButton from '@/components/LinkButton'
import { useRouter } from 'next/router'
import PantryForm from '../../../../forms/Inventory/PantryForm'

const EditPantryItem: NextPage = () => {
    const { query } = useRouter()

    const { id } = query

    return (
        <>
            <LinkButton href={`/inventory/pantry/${id}`} text={'< Back'} />{' '}
            <PantryForm mode={'edit'} />
        </>
    )
}

export default React.memo(EditPantryItem)
