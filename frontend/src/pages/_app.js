import '@/style/style.scss'

import React from 'react'
import { useRouter } from 'next/router'
import AppLayout from '@/components/Layouts/AppLayout'

const App = ({ Component, pageProps }) => {
    const router = useRouter()
    if (
        [`/register`].includes(router.pathname) ||
        [`/login`].includes(router.pathname)
    ) {
        return <Component {...pageProps} />
    }

    return (
        <AppLayout>
            <Component {...pageProps} />
        </AppLayout>
    )
}

export default App
