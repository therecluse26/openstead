import { Card } from 'primereact/card'
import { Galleria } from 'primereact/galleria'
import React, { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'

const InventoryDetailCard = ({ data, header, footer, children }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const handleImageLoad = () => {
        setIsImageLoaded(true)
    }

    useEffect(() => {
        setLoaded(true)
    }, [])

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
                onLoad={handleImageLoad}
            />
        )
    }
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
                            {!isImageLoaded && <Spinner />}
                            <Galleria
                                value={[data?.primary_image]}
                                responsiveOptions={responsiveOptions}
                                numVisible={1}
                                item={galleryTemplate}
                                showThumbnails={false}
                                style={{
                                    display: isImageLoaded ? 'block' : 'none',
                                    maxWidth: '400px',
                                }}
                            />
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
