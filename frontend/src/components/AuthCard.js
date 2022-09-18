const AuthCard = ({ logo, children }) => (
    <div className="card">
        <div>{logo}</div>

        <div>{children}</div>
    </div>
)

export default AuthCard
