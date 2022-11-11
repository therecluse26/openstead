import React, { createContext, useContext, useState } from 'react'
import { ThemeLink } from '@/utils/theme-utils'

const ThemeContext = createContext()

export default ThemeContext

export const ThemeContextProvider = ({ children }) => {
    const [theme, setTheme] = useState('arya-blue')

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
            <ThemeLink theme={theme} />
        </ThemeContext.Provider>
    )
}

export function useThemeContext() {
    return useContext(ThemeContext)
}
