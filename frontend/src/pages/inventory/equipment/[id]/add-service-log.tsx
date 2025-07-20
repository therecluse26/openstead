import LinkButton from '@/components/LinkButton'
import React from 'react'
import { NextPage } from 'next'
import ServiceLogForm from '@/forms/Inventory/ServiceLogForm'
import { useRouter } from 'next/router'

const AddServiceLog: NextPage = () => {
    const { query } = useRouter()
    const { id } = query
    return (
        <>
            {' '}
            <LinkButton
                href={`/inventory/equipment/${id}`}
                text={'< Back'}
            />{' '}
            <ServiceLogForm />
        </>
    )
}

export default React.memo(AddServiceLog)
