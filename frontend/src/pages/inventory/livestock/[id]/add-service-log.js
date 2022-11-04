import LinkButton from '@/components/LinkButton'
import React from 'react'
import ServiceLogForm from '@/components/Forms/Inventory/ServiceLogForm'
import { useRouter } from 'next/router'

const AddServiceLog = () => {
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
