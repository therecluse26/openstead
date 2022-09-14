import { useAuth } from '@/hooks/auth'
import AppLayout from '@/components/Layouts/AppLayout'
import { Card } from 'primereact/card'
import React from 'react'

const Inventory = () => {
    const { user } = useAuth({ middleware: 'guest' })

    return (
        <AppLayout title={'Inventory'}>
            <Card>
                <p>Inventory</p>
            </Card>
        </AppLayout>
    )
}

export default React.memo(Inventory)
