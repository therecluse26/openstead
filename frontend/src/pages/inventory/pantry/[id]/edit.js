import React from 'react'
import LinkButton from '@/components/LinkButton'
import { useRouter } from 'next/router'
import PantryForm from '../../../../forms/Inventory/PantryForm'

const EditLivestock = () => {
    const { query } = useRouter()

    const { id } = query

    return (
        <>
            <LinkButton href={`/inventory/seeds/${id}`} text={'< Back'} />{' '}
            <PantryForm mode={'edit'} />
        </>
    )
}

export default React.memo(EditLivestock)
