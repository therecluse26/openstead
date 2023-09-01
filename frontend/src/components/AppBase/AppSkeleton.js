import { Skeleton } from 'primereact/skeleton'
import React from 'react'
import Spinner from '../Spinner'

const AppSkeleton = () => {
    return (
        <>
            <div className="layout-topbar" />
            <div className="layout-sidebar">
                <div className="sidebar-toggle-button-container">
                    <Skeleton className="p-link layout-topbar-button text-white" />
                </div>
            </div>

            <div className="layout-main-container">
                <div className="layout-main">
                    <Spinner />
                </div>
                <div className="layout-footer mt-4">
                    <span className="font-medium ml-2" />
                </div>
            </div>
        </>
    )
}
export default AppSkeleton
