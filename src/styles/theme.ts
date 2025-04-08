import { createTheme, ThemeOptions } from '@mui/material/styles';

// Define color palette
const colors = {
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
const typography = {
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
const spacing = 8;

// Define breakpoints
const breakpoints = {
  values: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
};

// Define shadows
const shadows = [
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
const transitions = {
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
const zIndex = {
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
const shape = {
  borderRadius: 8,
};

// Define components
const components = {
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
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 16,
      },
    },
  },
  MuiFab: {
    styleOverrides: {
      root: {
        borderRadius: 16,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
};

// Create light theme
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    success: colors.success,
    background: {
      default: colors.neutral[50],
      paper: '#ffffff',
    },
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[700],
    },
    divider: colors.neutral[200],
  },
  typography,
  spacing,
  breakpoints,
  shadows,
  transitions,
  zIndex,
  shape,
  components,
});

// Create dark theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    success: colors.success,
    background: {
      default: colors.neutral[900],
      paper: colors.neutral[800],
    },
    text: {
      primary: colors.neutral[50],
      secondary: colors.neutral[300],
    },
    divider: colors.neutral[700],
  },
  typography,
  spacing,
  breakpoints,
  shadows,
  transitions,
  zIndex,
  shape,
  components,
});

// Export theme options for reuse
export const themeOptions: ThemeOptions = {
  typography,
  spacing,
  breakpoints,
  shadows,
  transitions,
  zIndex,
  shape,
  components,
};

// Export colors for direct use
export { colors }; 