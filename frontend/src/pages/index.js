import { useAuthorizationStore } from '@/components/Authorization/AuthorizationStore'

export default function Index() {
    const user = useAuthorizationStore(state => state.user)

    return <div>Welcome, {user?.name}!</div>
}
