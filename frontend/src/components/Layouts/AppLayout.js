import { Navigation } from '@/components/Layouts/Navigation'
import { useAuth } from '@/hooks/auth'
import React, { useRef, useState } from 'react'
import classNames from 'classnames'
import { AppMenu } from '@/components/AppMenu'
import { Tooltip } from 'primereact/tooltip'
import { AppFooter } from '@/components/AppFooter'
import { CSSTransition } from 'react-transition-group'
import menu from '@/components/_menu'

const AppLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })
    const [layoutMode, setLayoutMode] = useState('static')
    const [layoutColorMode, setLayoutColorMode] = useState('dark')

    const [mobileMenuActive, setMobileMenuActive] = useState(false)
    const [overlayMenuActive, setOverlayMenuActive] = useState(false)
    const [staticMenuInactive, setStaticMenuInactive] = useState(false)
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false)
    const copyTooltipRef = useRef()

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive':
            staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active':
            overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,

        'layout-theme-light': layoutColorMode === 'light',
    })

    // eslint-disable-next-line no-unused-vars
    let menuClick = false
    let mobileTopbarMenuClick = false

    const isDesktop = () => {
        return window.innerWidth >= 992
    }

    const onToggleMenuClick = event => {
        menuClick = true

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true)
                }

                setOverlayMenuActive(prevState => !prevState)
                setMobileMenuActive(false)
            } else if (layoutMode === 'static') {
                setStaticMenuInactive(prevState => !prevState)
            }
        } else {
            setMobileMenuActive(prevState => !prevState)
        }

        event.preventDefault()
    }

    const onColorModeChange = mode => {
        setLayoutColorMode(mode)
    }

    const onLayoutModeChange = mode => {
        setLayoutMode(mode)
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

            <Navigation
                onToggleMenuClick={onToggleMenuClick}
                mobileTopbarMenuActive={mobileTopbarMenuActive}
                onMobileTopbarMenuClick={onMobileTopbarMenuClick}
                onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick}
                user={user}
            />

            <div className="layout-sidebar" onClick={onSidebarClick}>
                <AppMenu
                    model={menu}
                    onMenuItemClick={onMenuItemClick}
                    layoutColorMode={layoutColorMode}
                />
            </div>

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

            {/*<AppConfig*/}
            {/*    layoutMode={layoutMode}*/}
            {/*    onLayoutModeChange={onLayoutModeChange}*/}
            {/*    layoutColorMode={layoutColorMode}*/}
            {/*    onColorModeChange={onColorModeChange}*/}
            {/*/>*/}
        </div>
    )
}

export default AppLayout
