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
        <div className="login-form">
            <div className="flex justify-content-center">
                <div className="card login-form-card">{children}</div>
            </div>
        </div>
    )
}

export default GuestLayout
