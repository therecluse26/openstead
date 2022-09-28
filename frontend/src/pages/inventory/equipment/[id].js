import React, { useEffect, useRef, useState } from 'react'
import AppLayout from '@/components/Layouts/AppLayout'
import { Card } from 'primereact/card'
import { useRouter } from 'next/router'
import { EquipmentService } from '@/services/inventory/EquipmentService'

const EquipmentDetail = () => {
    const isMounted = useRef(false)
    const [equipmentData, setEquipmentData] = useState()
    const { query, isReady } = useRouter()
    const { id } = query

    const service = new EquipmentService()

    const loadData = () => {
        if (!isReady) {
            return
        }
        service
            .getItem(id)
            .then(data => {
                setEquipmentData(data)
            })
            .catch(e => {
                alert(e)
            })
    }

    useEffect(() => {
        isMounted.current = true
        loadData()
    }, [id])

    return (
        <AppLayout title={'Equipment Detail'}>
            <Card>
                {JSON.stringify(equipmentData)}
                <h2 className="text-center">{equipmentData?.name}</h2>
            </Card>
        </AppLayout>
    )
}

export default React.memo(EquipmentDetail)
