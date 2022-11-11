import React, { useContext } from 'react'
import ThemeContext from '@/context/ThemeContext'

const ThemeLink = () => {
    const context = useContext(ThemeContext)

    return (
        <link
            id="theme-link"
            rel="stylesheet"
            href={`/themes/${context.theme}/theme.css`}
        />
    )
}

export { ThemeLink }
