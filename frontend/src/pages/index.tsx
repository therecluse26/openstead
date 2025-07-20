import { useAuthorizationStore } from '@/components/Authorization/AuthorizationStore'
import type { NextPage } from 'next'

const Index: NextPage = () => {
    const user = useAuthorizationStore(state => state.user)

    return <div>Welcome, {user?.name}!</div>
}

export default Index
