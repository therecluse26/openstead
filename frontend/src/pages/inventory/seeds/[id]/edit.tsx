import React from 'react'
import { NextPage } from 'next'
import LinkButton from '@/components/LinkButton'
import { useRouter } from 'next/router'
import SeedForm from '@/forms/Inventory/SeedForm'

const EditSeed: NextPage = () => {
    const { query } = useRouter()

    const { id } = query

    return (
        <>
            <LinkButton href={`/inventory/seeds/${id}`} text={'< Back'} />{' '}
            <SeedForm mode={'edit'} />
        </>
    )
}

export default React.memo(EditSeed)
