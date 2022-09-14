import AppLayout from '@/components/Layouts/AppLayout'

const Dashboard = () => {
    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
            title={'Dashboard'}>
            <p>You're logged in!</p>
        </AppLayout>
    )
}

export default Dashboard
