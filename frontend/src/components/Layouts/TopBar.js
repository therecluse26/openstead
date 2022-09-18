import React, { useRef } from 'react'
import { useRouter } from 'next/router'
import ResponsiveNavLink from '@/components/ResponsiveNavLink'
import classNames from 'classnames'
import { useAuth } from '@/hooks/auth'
import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'

export const TopBar = (props, { user }) => {
    const router = useRouter()
    const { logout } = useAuth()
    const menu = useRef(null)
    const toast = useRef(null)

    const items = [
        {
            label: 'Logout',
            icon: 'ti ti-logout',
            command: () => {
                logout()
            },
        },
    ]
    return (
        <div className="layout-topbar">
            <ResponsiveNavLink href="/" active={router.pathname === '/'}>
                Dashboard
            </ResponsiveNavLink>

            <button
                type="button"
                className="p-link  layout-menu-button layout-topbar-button"
                onClick={props.onToggleMenuClick}>
                <i className="ti ti-menu-2" />
            </button>

            <button
                type="button"
                className="p-link layout-topbar-menu-button layout-topbar-button"
                onClick={props.onMobileTopbarMenuClick}>
                <i className="ti ti-dots-vertical" />
            </button>

            <ul
                className={classNames('layout-topbar-menu lg:flex origin-top', {
                    'layout-topbar-menu-mobile-active':
                        props.mobileTopbarMenuActive,
                })}>
                <li>
                    <button
                        className="p-link layout-topbar-button"
                        onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="ti ti-calendar" />
                        <span>Events</span>
                    </button>
                </li>
                <li>
                    <button
                        className="p-link layout-topbar-button"
                        onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="ti ti-settings" />
                        <span>Settings</span>
                    </button>
                </li>
                <li>
                    <Menu model={items} popup ref={menu} id="popup_menu" />

                    <Button
                        className="p-link layout-topbar-button"
                        icon="ti ti-user"
                        onClick={event => menu.current.toggle(event)}
                        aria-controls="popup_menu"
                        aria-haspopup>
                        <i className="ti ti-user" />
                    </Button>
                </li>
            </ul>
        </div>
    )
}
