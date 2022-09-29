import { useAuth } from '@/hooks/auth'

const Index = () => {
    const { user } = useAuth({ middleware: 'guest' })

    return <p>Welcome, {user?.name}!</p>
}

export default Index
