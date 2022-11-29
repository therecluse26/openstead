import InventorySkeleton from '@/components/Inventory/InventorySkeleton'
import { Card } from 'primereact/card'
import { Galleria } from 'primereact/galleria'
import React, { Suspense } from 'react'

const InventoryDetailCard = ({ data, header, footer, children }) => {
    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 5,
        },
        {
            breakpoint: '768px',
            numVisible: 3,
        },
        {
            breakpoint: '560px',
            numVisible: 1,
        },
    ]

    const galleryTemplate = item => {
        return (
            <img
                className={'border-round inventory-primary-image'}
                src={item}
                alt={'Primary image'}
                style={{ width: '100%' }}
            />
        )
    }
    return (
        <Suspense fallback={InventorySkeleton}>
            <Card>
                <div className="grid">{header}</div>

                <div className="grid">
                    <div className={'col-12 md:col-4'}>
                        <Galleria
                            value={[data?.primary_image]}
                            responsiveOptions={responsiveOptions}
                            numVisible={1}
                            style={{ maxWidth: '400px' }}
                            item={galleryTemplate}
                            showThumbnails={false}
                        />
                    </div>
                    {children}
                </div>

                {footer}
            </Card>
        </Suspense>
    )
}

export default React.memo(InventoryDetailCard)
