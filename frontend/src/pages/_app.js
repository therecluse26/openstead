import '@/style/style.scss'
import { useRouter } from 'next/router'
import AppLayout from '@/components/AppBase/Layouts/AppLayout'
import Head from 'next/head'
import React, { Suspense, useEffect, useState } from 'react'
import { ThemeContextProvider } from '@/context/ThemeContext'

const MyApp = ({ Component, pageProps }) => {
    const router = useRouter()
    const [hasMounted, setHasMounted] = useState(false)
    const [themeHasLoaded, setThemeHasLoaded] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    if (
        [`/register`].includes(router.pathname) ||
        [`/login`].includes(router.pathname)
    ) {
        return <Component {...pageProps} />
    }

    return (
        <div suppressHydrationWarning>
            <ThemeContextProvider onLoad={setThemeHasLoaded}>
                {hasMounted && themeHasLoaded ? (
                    <AppLayout>
                        <Head>
                            <title>Openstead</title>
                        </Head>

                        <Component {...pageProps} />
                    </AppLayout>
                ) : (
                    <Suspense />
                )}
            </ThemeContextProvider>
        </div>
    )
}

export default MyApp
