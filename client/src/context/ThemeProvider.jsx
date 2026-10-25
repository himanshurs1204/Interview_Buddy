import { useLayoutEffect, useState } from 'react';
import ThemeContext from './ThemeContext';

const THEME_STORAGE_KEY = 'interview-buddy-theme';

const getInitialTheme = () => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme) return storedTheme;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(getInitialTheme);

    useLayoutEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;