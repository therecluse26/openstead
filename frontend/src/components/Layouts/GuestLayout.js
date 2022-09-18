import classNames from 'classnames'
import { useState } from 'react'

const GuestLayout = ({ children }) => {
    const [layoutMode] = useState('static')
    const [layoutColorMode] = useState('dark')

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-theme-light': layoutColorMode === 'light',
    })

    return (
        // <div className="surface-card p-4 shadow-2 border-round h-screen w-full lg:w-6">
        <div>{children}</div>
        // </div>
    )
}

export default GuestLayout
