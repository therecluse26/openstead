import React, { useRef } from 'react'
import ResponsiveNavLink from '@/components/ResponsiveNavLink'
import classNames from 'classnames'
import { useAuth } from '@/hooks/auth'
import { Menu } from 'primereact/menu'
import { useThemeContext } from '@/context/ThemeContext'

export const TopBar = props => {
    const { logout } = useAuth()
    const accountMenu = useRef(null)
    const themeMenu = useRef(null)

    const theme = useThemeContext()

    const accountItems = [
        {
            label: 'Logout',
            icon: 'ti ti-logout',
            command: () => {
                logout()
            },
        },
    ]

    const themeItems = [
        {
            label: 'Nova',
            command: () => {
                theme.setTheme('nova')
            },
        },
        {
            label: 'Arya',
            command: () => {
                theme.setTheme('arya-blue')
            },
        },
        {
            label: 'Lara Dark',
            command: () => {
                theme.setTheme('lara-dark-blue')
            },
        },
        {
            label: 'Vela',
            command: () => {
                theme.setTheme('vela-blue')
            },
        },
        {
            label: 'Tailwind',
            command: () => {
                theme.setTheme('vela-blue')
            },
        },
        {
            label: 'Saga',
            command: () => {
                theme.setTheme('saga-blue')
            },
        },
        {
            label: 'Bootstrap (light)',
            command: () => {
                theme.setTheme('bootstrap4-light-blue')
            },
        },
        {
            label: 'Bootstrap (Dark)',
            command: () => {
                theme.setTheme('bootstrap4-dark-blue')
            },
        },
        {
            label: 'Luna',
            command: () => {
                theme.setTheme('luna-blue')
            },
        },
        {
            label: 'Rhea',
            command: () => {
                theme.setTheme('rhea')
            },
        },
        {
            label: 'Material Dark',
            command: () => {
                theme.setTheme('md-dark-indigo')
            },
        },
    ]
    return (
        <div className="layout-topbar">
            <ResponsiveNavLink color="primary-600" href="/">
                <span className="text-lg">Openstead</span>
            </ResponsiveNavLink>

            <button
                type="button"
                className="p-link layout-menu-button layout-topbar-button"
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
                    <Menu
                        model={themeItems}
                        popup
                        ref={themeMenu}
                        id="popup_menu"
                    />
                    <button
                        className="p-link layout-topbar-button"
                        onClick={event => themeMenu.current.toggle(event)}>
                        <i className="ti ti-paint" />
                        <span>Theme</span>
                    </button>
                </li>
                <li>
                    <Menu
                        model={accountItems}
                        popup
                        ref={accountMenu}
                        id="popup_menu"
                    />
                    <button
                        className="p-link layout-topbar-button"
                        onClick={event => accountMenu.current.toggle(event)}
                        aria-controls="popup_menu"
                        aria-haspopup>
                        <i className="ti ti-user" />
                        <span>Account</span>
                    </button>
                </li>
            </ul>
        </div>
    )
}
