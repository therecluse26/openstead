import React from 'react'
import { NextPage } from 'next'
import LinkButton from '@/components/LinkButton'
import SeedForm from '@/forms/Inventory/SeedForm'

const CreateSeed: NextPage = () => {
    return (
        <>
            <LinkButton href={'/inventory/seeds'} text={'< Back'} />{' '}
            <SeedForm />
        </>
    )
}

export default React.memo(CreateSeed)
