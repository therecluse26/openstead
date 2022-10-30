import '@/style/style.scss'

import { useRouter } from 'next/router'
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import ErrorBoundary from '@/utils/ErrorBoundary'

const App = ({ Component, pageProps }) => {
    const router = useRouter()
    if (
        [`/register`].includes(router.pathname) ||
        [`/login`].includes(router.pathname)
    ) {
        return <Component {...pageProps} />
    }

    return (
        <ErrorBoundary>
            <div suppressHydrationWarning>
                <AppLayout>
                    <Head>
                        <title>Openstead</title>
                    </Head>
                    <Component {...pageProps} />
                </AppLayout>
            </div>
        </ErrorBoundary>
    )
}

export default App
