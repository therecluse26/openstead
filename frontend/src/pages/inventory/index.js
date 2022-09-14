import { useAuth } from '@/hooks/auth'
import AppLayout from '@/components/Layouts/AppLayout'

export default function Home() {
    const { user } = useAuth({ middleware: 'guest' })

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Inventory
                </h2>
            }
            title={'Inventory'}>
            <p>You're logged in!</p>
        </AppLayout>
    )
}
