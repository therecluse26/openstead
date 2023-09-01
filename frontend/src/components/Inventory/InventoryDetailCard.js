import { Card } from 'primereact/card'
import React, { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import ImageGallery from '../Images/ImageGallery'

const InventoryDetailCard = ({ data, header, footer, children }) => {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(true)
    }, [])

    return (
        <>
            {!loaded ? (
                <div className="card flex justify-content-center">
                    <Spinner />
                </div>
            ) : (
                <Card>
                    <div className="grid">{header}</div>

                    <div className="grid">
                        <div className={'col-12 md:col-4'}>
                            <ImageGallery images={[data?.primary_image]} />
                        </div>
                        {children}
                    </div>

                    {footer}
                </Card>
            )}
        </>
    )
}

export default React.memo(InventoryDetailCard)
