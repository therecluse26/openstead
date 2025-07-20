import React, { useState, ReactNode } from 'react'
import { ThemeContextProvider } from '@/context/ThemeContext'

interface GuestLayoutProps {
    children: ReactNode
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
    const [themeHasLoaded, setThemeHasLoaded] = useState<boolean>(false)

    return (
        <ThemeContextProvider onLoad={setThemeHasLoaded}>
            {themeHasLoaded && (
                <div className="login-form h-screen">
                    <div className="flex justify-content-center align-items-center h-screen">
                        <div className="card login-form-card">{children}</div>
                    </div>
                </div>
            )}
        </ThemeContextProvider>
    )
}

export default GuestLayout
