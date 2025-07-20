import React from 'react'
import Link from 'next/link'
import { Menu } from '@headlessui/react'

type DropdownLinkProps = {
    children: React.ReactNode
} & React.ComponentProps<typeof Link>

const DropdownLink: React.FC<DropdownLinkProps> = ({ children, ...props }) => (
    <Menu.Item>
        {({ active }) => (
            <Link
                {...props}
                className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
                    active ? 'bg-gray-100' : ''
                } focus:outline-none transition duration-150 ease-in-out`}>
                {children}
            </Link>
        )}
    </Menu.Item>
)

type DropdownButtonProps = {
    children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const DropdownButton: React.FC<DropdownButtonProps> = ({
    children,
    ...props
}) => (
    <Menu.Item>
        {({ active }) => (
            <button
                className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
                    active ? 'bg-gray-100' : ''
                } focus:outline-none transition duration-150 ease-in-out`}
                {...props}>
                {children}
            </button>
        )}
    </Menu.Item>
)

export default DropdownLink
