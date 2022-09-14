import React from 'react'
import { useRouter } from 'next/router'
import ResponsiveNavLink from '@/components/ResponsiveNavLink'
import classNames from 'classnames'

export const Navigation = props => {
    const router = useRouter()

    return (
        <div className="layout-topbar">
            <ResponsiveNavLink
                href="/dashboard"
                active={router.pathname === '/dashboard'}>
                Dashboard
            </ResponsiveNavLink>

            <button
                type="button"
                className="p-link  layout-menu-button layout-topbar-button"
                onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars" />
            </button>

            <button
                type="button"
                className="p-link layout-topbar-menu-button layout-topbar-button"
                onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
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
                        <i className="pi pi-calendar" />
                        <span>Events</span>
                    </button>
                </li>
                <li>
                    <button
                        className="p-link layout-topbar-button"
                        onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="pi pi-cog" />
                        <span>Settings</span>
                    </button>
                </li>
                <li>
                    <button
                        className="p-link layout-topbar-button"
                        onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="pi pi-user" />
                        <span>Profile</span>
                    </button>
                </li>
            </ul>
        </div>
    )
}
