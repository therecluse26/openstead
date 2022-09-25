import { AppMenu } from '@/components/AppMenu'
import menu from '@/components/_menu'
import React from 'react'

const SidebarMenu = ({
    mobileMenuActive,
    sidebarMenuActive,
    onToggleMenuClick,
    onSidebarClick,
    onMenuItemClick,
    layoutColorMode,
}) => {
    if (!mobileMenuActive) {
        if (!sidebarMenuActive) {
            return (
                <div className="layout-sidebar-closed">
                    <div className="sidebar-toggle-button-container">
                        <button
                            className="p-link layout-topbar-button text-white"
                            aria-label="Bookmark"
                            onClick={onToggleMenuClick}>
                            <i className="ti ti-chevron-right" />
                        </button>
                    </div>
                </div>
            )
        }
        return (
            <div className="layout-sidebar" onClick={onSidebarClick}>
                <div className="sidebar-toggle-button-container">
                    <button
                        className="p-link layout-topbar-button text-white"
                        aria-label="Bookmark"
                        onClick={onToggleMenuClick}>
                        <i className="ti ti-chevron-left" />
                    </button>
                </div>
                <AppMenu
                    model={menu}
                    onMenuItemClick={onMenuItemClick}
                    onToggleMenuClick={onToggleMenuClick}
                    layoutColorMode={layoutColorMode}
                />
            </div>
        )
    }
    return ''
}

export default SidebarMenu
