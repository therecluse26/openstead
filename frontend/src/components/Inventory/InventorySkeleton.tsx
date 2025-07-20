import { Skeleton } from 'primereact/skeleton'
import { Card } from 'primereact/card'
import React from 'react'

const InventorySkeleton = (
    <Card>
        <div className="grid">
            <div className="col-12 sm:col-fixed" style={{ width: '100px' }}>
                <Skeleton width="100%" height="30px" />
                {}{' '}
            </div>
            <div className={'col-12 sm:col'}>
                <h2 className={'text-center'}>
                    <Skeleton width="100%" height="30px" />
                </h2>
            </div>
        </div>
        <div className="grid custom-skeleton p-4">
            <div className={'col-12 md:col-6'}>
                <Skeleton width="100%" height="400px" />
            </div>

            <div className={'col-12 md:col-6'}>
                <Skeleton width="100%" height="2rem" className={'mb-4'} />
                <Skeleton width="100%" height="2rem" className={'my-4'} />
                <Skeleton width="100%" height="2rem" className={'my-4'} />
                <Skeleton width="100%" height="2rem" className={'my-4'} />
                <Skeleton width="100%" height="2rem" className={'my-4'} />
            </div>
        </div>
    </Card>
)

export default InventorySkeleton
