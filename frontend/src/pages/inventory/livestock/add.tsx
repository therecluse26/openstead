import React from 'react'
import { NextPage } from 'next'
import LinkButton from '@/components/LinkButton'
import LivestockForm from '@/forms/Inventory/LivestockForm'

const CreateLivestock: NextPage = () => {
    return (
        <>
            {' '}
            <LinkButton href={'/inventory/livestock'} text={'< Back'} />{' '}
            <LivestockForm />
        </>
    )
}

export default React.memo(CreateLivestock)
