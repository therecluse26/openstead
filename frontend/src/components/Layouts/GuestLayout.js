const GuestLayout = ({ children }) => {
    return (
        <div className="login-form h-screen">
            <div className="flex justify-content-center align-items-center h-screen">
                <div className="card login-form-card">{children}</div>
            </div>
        </div>
    )
}

export default GuestLayout
