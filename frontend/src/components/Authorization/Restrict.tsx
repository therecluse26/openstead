import React from 'react'
import { useAuthorizationStore } from './AuthorizationStore'

type RestrictProps = {
    permission: string
    children: React.ReactNode
    showMessage?: boolean
    message?: string
}

export default function Restrict({
    permission,
    showMessage = false,
    message = 'You are not authorized to access resource',
    children,
}: RestrictProps) {
    const user = useAuthorizationStore(state => state.user)
    const userCan = useAuthorizationStore(state => state.userCan)

    return (
        <>
            {user?.id && (
                <>
                    {userCan(permission) ? (
                        children
                    ) : (
                        <>
                            {showMessage && message && (
                                <span className="text-2xl">{message}</span>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    )
}
