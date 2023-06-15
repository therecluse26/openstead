import { Card } from 'primereact/card'

const InventoryCard = ({ children, gap = 0 }) => {
    return (
        <Card
            style={{ minWidth: '300px', width: '300px' }}
            className={`mx-${gap}`}>
            {children}
        </Card>
    )
}

export default InventoryCard
