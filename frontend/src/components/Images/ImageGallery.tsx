import React, { useState } from 'react'
import { Galleria } from 'primereact/galleria'
import Spinner from '@/components/Spinner'

type Image = {
    id: number
    url: string
    alt: null | string
}

type ImageGalleryProps = {
    images: Array<Image>
}

export default function ImageGallery({ images }: ImageGalleryProps) {
    const [isImageLoaded, setIsImageLoaded] = useState(false)

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

    const handleImageLoad = () => {
        setIsImageLoaded(true)
    }

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
            {!isImageLoaded && <Spinner />}
            <Galleria
                value={images}
                responsiveOptions={responsiveOptions}
                numVisible={1}
                item={galleryTemplate}
                showThumbnails={false}
                style={{
                    display: isImageLoaded ? 'block' : 'none',
                    maxWidth: '400px',
                }}
            />
        </>
    )
}
