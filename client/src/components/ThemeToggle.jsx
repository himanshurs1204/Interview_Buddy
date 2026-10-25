import { useContext } from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';
import ThemeContext from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${nextTheme} theme`}
            title={`Switch to ${nextTheme} theme`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:border-orange-300 hover:text-orange-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
            {theme === 'dark' ? <LuSun aria-hidden="true" /> : <LuMoon aria-hidden="true" />}
        </button>
    );
};

export default ThemeToggle;
