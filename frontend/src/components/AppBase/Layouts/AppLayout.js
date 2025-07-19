import { useAuth } from '@/hooks/auth'
import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { Tooltip } from 'primereact/tooltip'
import AppFooter from '@/components/AppBase/AppFooter'
import { CSSTransition } from 'react-transition-group'
import { TopBar } from '@/components/AppBase/Layouts/TopBar'
import SidebarMenu from '@/SidebarMenu'
import { ScrollTop } from 'primereact/scrolltop'
import { useAuthorizationStore } from '@/components/Authorization/AuthorizationStore'
import AppSkeleton from '../AppSkeleton'

import { useSettingStore } from '@/components/Settings/SettingStore'

const AppLayout = ({ children }) => {
    const { user: authUser } = useAuth({ middleware: 'auth' })
    const user = useAuthorizationStore(state => state.user)
    const setUser = useAuthorizationStore(state => state.setUser)
    const setPermissions = useAuthorizationStore(state => state.setPermissions)

    const [layoutMode] = useState('static')
    const [layoutColorMode] = useState('dark')
    const [overlayMenuActive, setOverlayMenuActive] = useState(false)

    const { sidebarMenuActive, setSidebarMenuActive } = useSettingStore()

    const [mobileMenuActive, setMobileMenuActive] = useState(false)
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false)
    const copyTooltipRef = useRef()
    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive':
            !sidebarMenuActive && layoutMode === 'static',
        'layout-overlay-sidebar-active':
            overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,

        'layout-theme-light': layoutColorMode === 'light',
    })
    let menuClick = false
    let mobileTopbarMenuClick = false

    useEffect(() => {
        // Set authorizationStore based on user data
        if (authUser) {
            setUser({
                id: authUser?.id,
                name: authUser?.name,
                email: authUser?.email,
                avatar: authUser?.avatar,
                tenants: authUser?.tenants,
            })
            setPermissions(authUser?.allPermissions)
        }
    }, [authUser])

    const isDesktop = () => {
        return window.innerWidth >= 992
    }

    const onToggleMenuClick = event => {
        menuClick = true
        if (isDesktop()) {
            setSidebarMenuActive(!sidebarMenuActive)
        } else {
            setMobileMenuActive(prevState => !prevState)
        }

        event.preventDefault()
    }

    const onWrapperClick = () => {
        if (!menuClick) {
            setOverlayMenuActive(false)
            setMobileMenuActive(false)
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false)
        }

        mobileTopbarMenuClick = false
        menuClick = false
    }

    const onMobileTopbarMenuClick = event => {
        mobileTopbarMenuClick = true

        setMobileTopbarMenuActive(prevState => !prevState)
        event.preventDefault()
    }

    const onMobileSubTopbarMenuClick = event => {
        mobileTopbarMenuClick = true
        event.preventDefault()
    }

    const onSidebarClick = () => {
        menuClick = true
    }

    const onMenuItemClick = event => {
        if (!event.item.items) {
            setOverlayMenuActive(false)
            setMobileMenuActive(false)
        }
    }

    return (
        <>
            {authUser ? (
                <div className={wrapperClass} onClick={onWrapperClick}>
                    <Tooltip
                        ref={copyTooltipRef}
                        target=".block-action-copy"
                        position="bottom"
                        content="Copied to clipboard"
                        event="focus"
                    />
                    <TopBar
                        onToggleMenuClick={onToggleMenuClick}
                        mobileTopbarMenuActive={mobileTopbarMenuActive}
                        onMobileTopbarMenuClick={onMobileTopbarMenuClick}
                        onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick}
                        user={user}
                    />

                    <SidebarMenu
                        mobileMenuActive={mobileMenuActive}
                        sidebarMenuActive={sidebarMenuActive}
                        onToggleMenuClick={onToggleMenuClick}
                        onSidebarClick={onSidebarClick}
                        onMenuItemClick={onMenuItemClick}
                        layoutColorMode={layoutColorMode}
                    />

                    {/* Page Content */}
                    <div className="layout-main-container">
                        <div className="layout-main">{children}</div>

                        <AppFooter layoutColorMode={layoutColorMode} />
                    </div>

                    <CSSTransition
                        classNames="layout-mask"
                        timeout={{ enter: 200, exit: 200 }}
                        in={mobileMenuActive}
                        unmountOnExit>
                        <div className="layout-mask p-component-overlay" />
                    </CSSTransition>

                    <ScrollTop threshold={200} />
                </div>
            ) : (
                <div>
                    <AppSkeleton />
                </div>
            )}
        </>
    )
}

export default React.memo(AppLayout)
