import { useAuthorizationStore } from '@/components/Authorization/AuthorizationStore'

const Index = () => {
    const user = useAuthorizationStore(state => state.user)

    return <div>Welcome, {user?.name}!</div>
}

export default Index
