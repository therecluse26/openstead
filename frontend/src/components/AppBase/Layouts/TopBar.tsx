import React, { useRef } from 'react'
import ResponsiveNavLink from '@/components/ResponsiveNavLink'
import classNames from 'classnames'
import { useAuth } from '@/hooks/auth'
import { Menu } from 'primereact/menu'
import { MenuItem } from 'primereact/menuitem'
import { useThemeContext } from '@/context/ThemeContext'
import { useAuthorizationStore } from '../../Authorization/AuthorizationStore'
import { useTenantStore } from '../../Tenants/TenantStore'
import {
    IconBuildingCottage,
    IconChevronDown,
    IconPaint,
    IconUser,
} from '@tabler/icons'

interface TopBarProps {
    onToggleMenuClick: () => void
    onMobileTopbarMenuClick: () => void
    mobileTopbarMenuActive: boolean
}

export const TopBar: React.FC<TopBarProps> = props => {
    const { logout } = useAuth()
    const accountMenu = useRef<Menu>(null)
    const themeMenu = useRef<Menu>(null)
    const tenantMenu = useRef<Menu>(null)
    const theme = useThemeContext()

    const { user } = useAuthorizationStore()
    const { currentTenant, setCurrentTenant } = useTenantStore()

    const accountItems: MenuItem[] = [
        {
            label: 'Logout',
            icon: 'ti ti-logout',
            command: () => {
                logout()
            },
        },
    ]

    const themeItems: MenuItem[] = [
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

    const tenantItems: MenuItem[] =
        user?.tenants?.map(tenant => {
            return {
                label: tenant.name,
                command: () => {
                    setCurrentTenant(tenant.id)
                },
            }
        }) || []

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
                className={classNames(
                    'layout-topbar-menu gap-2 lg:flex origin-top',
                    {
                        'layout-topbar-menu-mobile-active':
                            props.mobileTopbarMenuActive,
                    },
                )}>
                <li>
                    <Menu
                        model={themeItems}
                        popup
                        ref={themeMenu}
                        id="popup_menu"
                    />
                    <span
                        className="p-link layout-topbar-button"
                        onClick={event => themeMenu.current?.toggle(event)}>
                        <IconPaint size={18} />
                        <span className="topbar-hidden-text">Theme</span>
                    </span>
                </li>
                <li>
                    <Menu
                        model={tenantItems}
                        popup
                        ref={tenantMenu}
                        id="popup_menu"
                    />
                    <span
                        className="p-link layout-topbar-dropdown"
                        onClick={event => tenantMenu.current?.toggle(event)}>
                        <IconBuildingCottage size={18} />
                        <span className="spacer-h-1" />
                        <span>{currentTenant?.name}</span>
                        <span className="spacer-h-1" />
                        <IconChevronDown size={18} />
                    </span>
                </li>
                <li>
                    <Menu
                        model={accountItems}
                        popup
                        ref={accountMenu}
                        id="popup_menu"
                    />
                    <span
                        className="p-link layout-topbar-dropdown"
                        onClick={event => accountMenu.current?.toggle(event)}>
                        <IconUser size={18} />
                        <span className="spacer-h-1" />
                        <span>{user?.name}</span>
                        <span className="spacer-h-1" />
                        <IconChevronDown size={18} />
                    </span>
                </li>
            </ul>
        </div>
    )
}
