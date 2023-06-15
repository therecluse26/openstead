import React from 'react'
import LinkButton from '@/components/LinkButton'
import LivestockForm from '@/forms/Inventory/LivestockForm'

const CreateLivestock = () => {
    return (
        <>
            {' '}
            <LinkButton href={'/inventory/livestock'} text={'< Back'} />{' '}
            <LivestockForm />
        </>
    )
}

export default React.memo(CreateLivestock)
