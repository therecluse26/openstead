import React from 'react'
import { Card } from 'primereact/card'

interface InventoryCardProps {
    children: React.ReactNode
    gap?: number
}

const InventoryCard: React.FC<InventoryCardProps> = ({ children, gap = 0 }) => {
    return (
        <Card
            style={{ minWidth: '300px', width: '300px' }}
            className={`mx-${gap}`}>
            {children}
        </Card>
    )
}

export default InventoryCard
