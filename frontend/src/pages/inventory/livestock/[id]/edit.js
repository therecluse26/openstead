import React from 'react'
import LivestockForm from '@/forms/Inventory/LivestockForm'
import LinkButton from '@/components/LinkButton'
import { useRouter } from 'next/router'

const EditLivestock = () => {
    const { query } = useRouter()

    const { id } = query

    return (
        <>
            {' '}
            <LinkButton
                href={`/inventory/livestock/${id}`}
                text={'< Back'}
            />{' '}
            <LivestockForm mode={'edit'} />
        </>
    )
}

export default React.memo(EditLivestock)
