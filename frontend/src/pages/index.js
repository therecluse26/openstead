import { useAuth } from '@/hooks/auth'

const Index = () => {
    const { user } = useAuth({ middleware: 'guest' })

    return <div>Welcome, {user?.name}!</div>
}

export default Index
