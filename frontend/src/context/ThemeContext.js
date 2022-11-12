import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLocalStorage } from 'primereact/hooks'

const ThemeContext = createContext()

export default ThemeContext

export const ThemeContextProvider = ({ children, onLoad }) => {
    const [hasMounted, setHasMounted] = useState(false)
    const [theme, setTheme] = useLocalStorage('arya-blue', 'theme')
    const themeLink = `/themes/${theme}/theme.css`

    useEffect(() => {
        setHasMounted(true)
    }, [])

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
            {hasMounted && (
                <link
                    id="theme-link"
                    rel="stylesheet preload"
                    onLoad={() => {
                        onLoad(true)
                    }}
                    href={themeLink}
                />
            )}
        </ThemeContext.Provider>
    )
}

export function useThemeContext() {
    return useContext(ThemeContext)
}
