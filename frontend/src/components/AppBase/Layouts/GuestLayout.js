import { ThemeContextProvider } from '@/context/ThemeContext'
import { useState } from 'react'

const GuestLayout = ({ children }) => {
    const [themeHasLoaded, setThemeHasLoaded] = useState(false)

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
