import { createContext, useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkModel');
        return savedMode ? JSON.parse(savedMode) : false;
    })

    const toggleDarkMode = () => {
        setDarkMode((prevMode) => {
            localStorage.setItem('darkModel', JSON.stringify(prevMode));
            return !prevMode;
        });
    };

    const theme = useMemo(() => createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
        components: {
            MuiTextField: {
                defaultProps: {
                    fullWidth: true,
                    margin: 'normal'
                }
            }
        }
    }), [darkMode])

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}