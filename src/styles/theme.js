import { createTheme } from '@mui/material/styles';
// Define color palette
var colors = {
    // Primary colors
    primary: {
        main: '#3b82f6', // Modern blue
        light: '#60a5fa',
        dark: '#2563eb',
        contrastText: '#ffffff',
    },
    // Secondary colors
    secondary: {
        main: '#10b981', // Modern green
        light: '#34d399',
        dark: '#059669',
        contrastText: '#ffffff',
    },
    // Accent colors
    accent: {
        purple: '#8b5cf6',
        orange: '#f97316',
        pink: '#ec4899',
        teal: '#14b8a6',
    },
    // Neutral colors
    neutral: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
    },
    // Semantic colors
    success: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669',
    },
    warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706',
    },
    error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#dc2626',
    },
    info: {
        main: '#3b82f6',
        light: '#60a5fa',
        dark: '#2563eb',
    },
};
// Define typography
var typography = {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
    },
    h2: {
        fontSize: '2rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
    },
    h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.025em',
    },
    h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: '-0.025em',
    },
    h5: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
    },
    h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.4,
    },
    subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
    },
    subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.5,
    },
    body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
    },
    body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
    },
    button: {
        textTransform: 'none',
        fontWeight: 500,
    },
    caption: {
        fontSize: '0.75rem',
        lineHeight: 1.5,
    },
    overline: {
        fontSize: '0.75rem',
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: '0.05em',
    },
};
// Define spacing
var spacing = 8;
// Define breakpoints
var breakpoints = {
    values: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
    },
};
// Define shadows
var shadows = [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 30px 60px -12px rgba(0, 0, 0, 0.25)',
    '0 35px 70px -12px rgba(0, 0, 0, 0.25)',
    '0 40px 80px -12px rgba(0, 0, 0, 0.25)',
    '0 45px 90px -12px rgba(0, 0, 0, 0.25)',
    '0 50px 100px -12px rgba(0, 0, 0, 0.25)',
    '0 55px 110px -12px rgba(0, 0, 0, 0.25)',
    '0 60px 120px -12px rgba(0, 0, 0, 0.25)',
    '0 65px 130px -12px rgba(0, 0, 0, 0.25)',
    '0 70px 140px -12px rgba(0, 0, 0, 0.25)',
    '0 75px 150px -12px rgba(0, 0, 0, 0.25)',
    '0 80px 160px -12px rgba(0, 0, 0, 0.25)',
    '0 85px 170px -12px rgba(0, 0, 0, 0.25)',
    '0 90px 180px -12px rgba(0, 0, 0, 0.25)',
    '0 95px 190px -12px rgba(0, 0, 0, 0.25)',
    '0 100px 200px -12px rgba(0, 0, 0, 0.25)',
    '0 105px 210px -12px rgba(0, 0, 0, 0.25)',
    '0 110px 220px -12px rgba(0, 0, 0, 0.25)',
    '0 115px 230px -12px rgba(0, 0, 0, 0.25)',
    '0 120px 240px -12px rgba(0, 0, 0, 0.25)',
];
// Define transitions
var transitions = {
    duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
    },
    easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
};
// Define z-index
var zIndex = {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
};
// Define shape
var shape = {
    borderRadius: 8,
};
// Define animation keyframes
export var keyframes = {
    completeTask: "\n    0% { opacity: 1; transform: translateX(0); }\n    40% { opacity: 0.7; transform: translateX(5px); }\n    100% { opacity: 0; transform: translateX(20px); }\n  ",
    uncompleteTask: "\n    0% { opacity: 0; transform: translateX(20px); }\n    100% { opacity: 1; transform: translateX(0); }\n  ",
    checkmarkAppear: "\n    0% { opacity: 0; transform: scale(0); }\n    50% { opacity: 1; transform: scale(1.2); }\n    100% { opacity: 1; transform: scale(1); }\n  ",
    checkboxPulse: "\n    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }\n    70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }\n    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }\n  ",
    fadeIn: "\n    from { opacity: 0; }\n    to { opacity: 1; }\n  ",
    slideIn: "\n    from { transform: translateY(20px); opacity: 0; }\n    to { transform: translateY(0); opacity: 1; }\n  ",
    scaleIn: "\n    from { transform: scale(0.9); opacity: 0; }\n    to { transform: scale(1); opacity: 1; }\n  ",
    shake: "\n    0%, 100% { transform: translateX(0); }\n    20%, 60% { transform: translateX(-5px); }\n    40%, 80% { transform: translateX(5px); }\n  ",
    statusChange: "\n    0% { background-color: transparent; }\n    50% { background-color: rgba(16, 185, 129, 0.1); }\n    100% { background-color: transparent; }\n  ",
};
// Define component styles
var components = {
    MuiCssBaseline: {
        styleOverrides: function (theme) { return ({
            body: {
                backgroundColor: theme.palette.mode === 'dark' ? colors.neutral[900] : colors.neutral[50],
                color: theme.palette.mode === 'dark' ? colors.neutral[100] : colors.neutral[900],
                fontFamily: typography.fontFamily,
                lineHeight: 1.6,
                margin: 0,
                padding: 0,
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                fontSize: '14px',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
            },
            // Reset and base styles
            '*': {
                margin: 0,
                padding: 0,
                boxSizing: 'border-box',
            },
            a: {
                textDecoration: 'none',
                color: 'inherit',
            },
        }); },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 500,
                padding: '8px 16px',
            },
            contained: {
                boxShadow: 'none',
                '&:hover': {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                },
            },
        },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                borderRadius: 8,
            },
        },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            },
        },
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: 8,
                    '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                    '&:hover fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.2)',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: colors.primary.main,
                    },
                },
            },
        },
    },
    MuiCheckbox: {
        styleOverrides: {
            root: {
                color: colors.primary.main,
            },
        },
    },
    MuiSwitch: {
        styleOverrides: {
            root: {
                width: 42,
                height: 26,
                padding: 0,
                margin: 8,
            },
            switchBase: {
                padding: 1,
                '&.Mui-checked': {
                    transform: 'translateX(16px)',
                    color: '#fff',
                    '& + .MuiSwitch-track': {
                        backgroundColor: colors.primary.main,
                        opacity: 1,
                        border: 'none',
                    },
                },
                '&.Mui-focusVisible .MuiSwitch-thumb': {
                    color: colors.primary.main,
                    border: '6px solid #fff',
                },
            },
            thumb: {
                width: 24,
                height: 24,
            },
            track: {
                borderRadius: 26 / 2,
                border: "1px solid ".concat(colors.neutral[400]),
                backgroundColor: colors.neutral[300],
                opacity: 1,
                transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            },
        },
    },
    MuiList: {
        styleOverrides: {
            root: {
                padding: 0,
            },
        },
    },
    MuiListItem: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
            },
        },
    },
    MuiTabs: {
        styleOverrides: {
            root: {
                minHeight: '48px',
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            },
            indicator: {
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
            },
        },
    },
    MuiTab: {
        styleOverrides: {
            root: {
                textTransform: 'none',
                minHeight: '48px',
                fontWeight: 500,
            },
        },
    },
    MuiIconButton: {
        styleOverrides: {
            root: {
                borderRadius: 8,
            },
        },
    },
    MuiAvatar: {
        styleOverrides: {
            root: {
                backgroundColor: colors.primary.main,
            },
        },
    },
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: '6px',
                fontWeight: 500,
            },
        },
    },
    MuiDivider: {
        styleOverrides: {
            root: {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
            },
        },
    },
    MuiDrawer: {
        styleOverrides: {
            paper: {
                border: 'none',
                borderRight: 'none',
            },
        },
    },
    MuiTooltip: {
        styleOverrides: {
            tooltip: {
                backgroundColor: colors.neutral[900],
                borderRadius: 4,
                fontSize: '0.75rem',
                padding: '8px 12px',
            },
        },
    },
};
// Create theme for light mode
var lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: colors.primary,
        secondary: colors.secondary,
        success: {
            main: colors.success.main,
            light: colors.success.light,
            dark: colors.success.dark,
        },
        warning: {
            main: colors.warning.main,
            light: colors.warning.light,
            dark: colors.warning.dark,
        },
        error: {
            main: colors.error.main,
            light: colors.error.light,
            dark: colors.error.dark,
        },
        info: {
            main: colors.info.main,
            light: colors.info.light,
            dark: colors.info.dark,
        },
        background: {
            default: colors.neutral[50],
            paper: '#FFFFFF',
        },
        text: {
            primary: colors.neutral[900],
            secondary: colors.neutral[600],
        },
        divider: 'rgba(0, 0, 0, 0.08)',
    },
    typography: typography,
    spacing: spacing,
    breakpoints: breakpoints,
    shape: shape,
    shadows: shadows,
    transitions: transitions,
    zIndex: zIndex,
    components: components,
});
// Create theme for dark mode
var darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: colors.primary,
        secondary: colors.secondary,
        success: {
            main: colors.success.main,
            light: colors.success.light,
            dark: colors.success.dark,
        },
        warning: {
            main: colors.warning.main,
            light: colors.warning.light,
            dark: colors.warning.dark,
        },
        error: {
            main: colors.error.main,
            light: colors.error.light,
            dark: colors.error.dark,
        },
        info: {
            main: colors.info.main,
            light: colors.info.light,
            dark: colors.info.dark,
        },
        background: {
            default: '#191919',
            paper: '#2d2d2d',
        },
        text: {
            primary: colors.neutral[100],
            secondary: colors.neutral[400],
        },
        divider: 'rgba(255, 255, 255, 0.08)',
    },
    typography: typography,
    spacing: spacing,
    breakpoints: breakpoints,
    shape: shape,
    shadows: shadows,
    transitions: transitions,
    zIndex: zIndex,
    components: components,
});
// Export theme based on mode
export var getTheme = function (mode) {
    var baseTheme = {
        palette: {
            mode: mode,
            primary: {
                main: mode === 'light' ? '#1976d2' : '#90caf9',
            },
            secondary: {
                main: mode === 'light' ? '#dc004e' : '#f48fb1',
            },
            background: {
                default: mode === 'light' ? '#f5f5f5' : '#121212',
                paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
            },
            text: {
                primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : '#ffffff',
                secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)',
            },
        },
        typography: {
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        scrollbarColor: mode === 'light' ? '#6b6b6b #2b2b2b' : '#2b2b2b #6b6b6b',
                        '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                            backgroundColor: mode === 'light' ? '#f5f5f5' : '#121212',
                        },
                        '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                            borderRadius: 8,
                            backgroundColor: mode === 'light' ? '#6b6b6b' : '#2b2b2b',
                            minHeight: 24,
                            border: mode === 'light' ? '3px solid #f5f5f5' : '3px solid #121212',
                        },
                        '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
                            backgroundColor: mode === 'light' ? '#2b2b2b' : '#6b6b6b',
                        },
                        '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
                            backgroundColor: mode === 'light' ? '#2b2b2b' : '#6b6b6b',
                        },
                        '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: mode === 'light' ? '#2b2b2b' : '#6b6b6b',
                        },
                        '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
                            backgroundColor: mode === 'light' ? '#f5f5f5' : '#121212',
                        },
                    },
                },
            },
        },
    };
    return createTheme(baseTheme);
};
export { colors, typography, spacing, breakpoints, shape, shadows, transitions, zIndex };
export default getTheme;
