import React from 'react'
import LinkButton from '@/components/LinkButton'
import SeedForm from '@/forms/Inventory/SeedForm'

const CreateSeed = () => {
    return (
        <>
            <LinkButton href={'/inventory/seeds'} text={'< Back'} />{' '}
            <SeedForm />
        </>
    )
}

export default React.memo(CreateSeed)
