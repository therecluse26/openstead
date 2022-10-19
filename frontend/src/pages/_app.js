import '@/style/style.scss'

import React from 'react'
import { useRouter } from 'next/router'
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'

const App = ({ Component, pageProps }) => {
    // const [filters] = useState(Filters.inventoryFilters)

    const router = useRouter()
    if (
        [`/register`].includes(router.pathname) ||
        [`/login`].includes(router.pathname)
    ) {
        return <Component {...pageProps} />
    }

    function SafeHydrate({ children }) {
        return (
            <div suppressHydrationWarning>
                {typeof window === 'undefined' ? null : children}
            </div>
        )
    }

    return (
        <SafeHydrate>
            <AppLayout>
                <Head>
                    <title>Openstead</title>
                </Head>
                <Component {...pageProps} />
            </AppLayout>
        </SafeHydrate>
    )
}

export default App
