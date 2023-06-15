import Link from 'next/link'

const NavLink = ({ active = false, children, ...props }) => (
    <Link
        className={`p-ripple ${
            active ? 'router-link-active router-link-exact-active' : ''
        }`}
        {...props}>
        {children}
    </Link>
)

export default NavLink
