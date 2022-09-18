import AppLayout from '@/components/Layouts/AppLayout'
import { useAuth } from '@/hooks/auth'

const Index = () => {
    const { user } = useAuth({ middleware: 'guest' })

    return (
        <AppLayout title={'Dashboard'}>
            <p>You're logged in, {user?.name}!</p>
        </AppLayout>
    )
}

export default Index
