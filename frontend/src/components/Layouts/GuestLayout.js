import { ThemeContextProvider } from '@/context/ThemeContext'

const GuestLayout = ({ children }) => {
    return (
        <ThemeContextProvider>
            <div className="login-form h-screen">
                <div className="flex justify-content-center align-items-center h-screen">
                    <div className="card login-form-card">{children}</div>
                </div>
            </div>
        </ThemeContextProvider>
    )
}

export default GuestLayout
