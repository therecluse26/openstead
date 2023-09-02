import React from 'react'
import { useAuthorizationStore } from './AuthorizationStore'

type RestrictProps = {
    permission: string
    children: React.ReactNode
    showMessage?: boolean
    message?: string
}

function isIterable(input) {
    if (input === null || input === undefined) {
        return false
    }

    return typeof input[Symbol.iterator] === 'function'
}

export default function Restrict({
    permission,
    showMessage = false,
    message = 'You are not authorized to access this resource',
    children,
}: RestrictProps) {
    const user = useAuthorizationStore(state => state.user)
    const userCan = useAuthorizationStore(state => state.userCan)

    return (
        <>
            {user?.id && (
                <>
                    {userCan(permission) ? (
                        <>{isIterable(children) ? <>{children}</> : children}</>
                    ) : (
                        <>{showMessage && message && <span>{message}</span>}</>
                    )}
                </>
            )}
        </>
    )
}
