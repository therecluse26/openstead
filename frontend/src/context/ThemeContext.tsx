import React, {
    Context,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react'

import { useSettingStore } from '@/components/Settings/SettingStore'

const ThemeContext: Context<any> = createContext(null)

export default ThemeContext

export const ThemeContextProvider = ({ children, onLoad }) => {
    const [hasMounted, setHasMounted] = useState(false)

    const { theme, setTheme } = useSettingStore()

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
