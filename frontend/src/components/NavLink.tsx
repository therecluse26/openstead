import React from 'react'
import Link from 'next/link'

type NavLinkProps = {
    active?: boolean
    children: React.ReactNode
} & React.ComponentProps<typeof Link>

const NavLink: React.FC<NavLinkProps> = ({
    active = false,
    children,
    ...props
}) => (
    <Link
        className={`p-ripple ${
            active ? 'router-link-active router-link-exact-active' : ''
        }`}
        {...props}>
        {children}
    </Link>
)

export default NavLink
