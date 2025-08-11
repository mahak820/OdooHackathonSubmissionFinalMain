import React , { createContext, useState } from "react";

const ThemeContext = createContext()

export const ThemeProvider = ({children}) => {

    const [dark , setDark] = useState(false)

    const changeTheme = () => {
        dark ? setDark(false) : setDark(true)
    }

    return(
        <ThemeContext.Provider value={{dark , changeTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeContext