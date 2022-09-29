import { useAuth } from '@/hooks/auth'
import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { Tooltip } from 'primereact/tooltip'
import { AppFooter } from '@/components/AppFooter'
import { CSSTransition } from 'react-transition-group'
import { TopBar } from '@/components/Layouts/TopBar'
import SidebarMenu from '@/SidebarMenu'

const AppLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })
    const [layoutMode] = useState('static')
    const [layoutColorMode] = useState('dark')
    const [overlayMenuActive, setOverlayMenuActive] = useState(false)
    const [sidebarMenuActive, setSidebarMenuActive] = useState(true)
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
        setSidebarMenuActive(
            JSON.parse(localStorage.getItem('sidebarMenuActive')),
        )
    }, [])
    useEffect(() => {
        // storing input name
        localStorage.setItem('sidebarMenuActive', String(sidebarMenuActive))
    }, [sidebarMenuActive])

    const isDesktop = () => {
        return window.innerWidth >= 992
    }

    const onToggleMenuClick = event => {
        menuClick = true
        if (isDesktop()) {
            setSidebarMenuActive(prevState => !prevState)
        } else {
            setMobileMenuActive(prevState => !prevState)
        }

        event.preventDefault()
    }

    const onWrapperClick = event => {
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
        </div>
    )
}

export default React.memo(AppLayout)
