import Link from 'next/link'

const NavLink = ({ active = false, children, ...props }) => (
    <Link {...props}>
        <a
            className={`p-ripple ${
                active ? 'router-link-active router-link-exact-active' : ''
            }`}>
            {children}
        </a>
    </Link>
)

export default NavLink
