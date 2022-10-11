import React, { useEffect, useRef, useState } from 'react'
import { Card } from 'primereact/card'
import { useRouter } from 'next/router'
import LivestockService from '@/services/inventory/LivestockService'

const LivestockDetail = () => {
    const isMounted = useRef(false)
    const [data, setData] = useState()
    const { query, isReady } = useRouter()
    const { id } = query

    const loadData = () => {
        if (!isReady) {
            return
        }
        LivestockService.getItem(id)
            .then(data => {
                setData(data)
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
        <Card>
            {JSON.stringify(data)}
            <h2 className="text-center">{data?.name}</h2>
        </Card>
    )
}

export default React.memo(LivestockDetail)
