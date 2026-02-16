import { alpha, createTheme, ThemeOptions } from '@mui/material/styles';

// Studious, calming palette (color theory: blues = trust/focus/calm; muted tones = reduced strain)
// Primary: slate blue — associated with focus, productivity, and calm; used in many productivity/education UIs
const primaryMain = '#5B7A9E';
const primaryHover = '#6A8AA8';
const primaryActive = '#4A6582';
const primaryLight = '#7B9BB8';

// Define color palette
const colors = {
  // Brand: dark blue-grays (softer than pure black; less harsh for long reading)
  brand: {
    black: '#0F1419',
    blackElevated: '#161D26',
    blackElevated2: '#1C2530',
    gold: primaryMain,
    goldHover: primaryHover,
    goldActive: primaryActive,
  },
  // Theme tokens (primary = slate blue for studious/calm)
  primary: {
    main: primaryMain,
    light: primaryLight,
    dark: primaryActive,
    contrastText: '#F5F5F5',
  },
  secondary: {
    main: '#8B9AAF',
    light: '#A8B8C9',
    dark: '#6B7D94',
    contrastText: '#0F1419',
  },
  // Accent colors (muted for calm; still distinguishable)
  accent: {
    purple: '#7B6B9E',
    orange: '#B8956A',
    pink: '#A67B8A',
    teal: '#5A8A8A',
  },
  // Neutral colors (cool gray / slate for professional feel)
  neutral: {
    50: '#F4F6F8',
    100: '#E8ECF0',
    200: '#D1D9E2',
    300: '#B0BCC9',
    400: '#8A99A8',
    500: '#6B7A8A',
    600: '#4F5D6B',
    700: '#3A4552',
    800: '#252E38',
    900: '#151C24',
  },
  // Semantic colors (muted so they don’t break the calm mood)
  success: {
    main: '#4A9B6D',
    light: '#6BB88A',
    dark: '#3A7A55',
  },
  warning: {
    main: '#B8954A',
    light: '#D4B56A',
    dark: '#947538',
  },
  error: {
    main: '#B85C5C',
    light: '#D47B7B',
    dark: '#944848',
  },
  info: {
    main: primaryMain,
    light: primaryLight,
    dark: primaryActive,
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

// Define animation keyframes
export const keyframes = {
  completeTask: `
    0% { opacity: 1; transform: translateX(0); }
    40% { opacity: 0.7; transform: translateX(5px); }
    100% { opacity: 0; transform: translateX(20px); }
  `,
  uncompleteTask: `
    0% { opacity: 0; transform: translateX(20px); }
    100% { opacity: 1; transform: translateX(0); }
  `,
  checkmarkAppear: `
    0% { opacity: 0; transform: scale(0); }
    50% { opacity: 1; transform: scale(1.2); }
    100% { opacity: 1; transform: scale(1); }
  `,
  checkboxPulse: `
    0% { box-shadow: 0 0 0 0 rgba(74, 155, 109, 0.35); }
    70% { box-shadow: 0 0 0 10px rgba(74, 155, 109, 0); }
    100% { box-shadow: 0 0 0 0 rgba(74, 155, 109, 0); }
  `,
  fadeIn: `
    from { opacity: 0; }
    to { opacity: 1; }
  `,
  slideIn: `
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  `,
  scaleIn: `
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  `,
  shake: `
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-5px); }
    40%, 80% { transform: translateX(5px); }
  `,
  statusChange: `
    0% { background-color: transparent; }
    50% { background-color: rgba(74, 155, 109, 0.12); }
    100% { background-color: transparent; }
  `,
};

// Define component styles (currently unused; kept for future theming work)
const _components = {
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
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
    }),
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
        border: `1px solid ${colors.neutral[400]}`,
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
        borderBottom: `1px solid rgba(0, 0, 0, 0.1)`,
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

// Export theme based on mode
export const getTheme = (_requestedMode: 'light' | 'dark') => {
  // App-wide decision: always use dark mode (param kept for compatibility).
  const mode = 'dark' as const;

  const baseTheme: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: colors.primary.main,
        dark: colors.brand.goldActive,
        light: colors.primary.light,
        contrastText: colors.primary.contrastText,
      },
      secondary: {
        main: colors.secondary.main,
        contrastText: colors.secondary.contrastText,
      },
      background: {
        default: colors.brand.black,
        paper: colors.brand.blackElevated,
      },
      text: {
        primary: '#F5F5F5',
        secondary: 'rgba(245, 245, 245, 0.72)',
      },
      divider: 'rgba(245, 245, 245, 0.12)',
      error: {
        main: colors.error.main,
        light: colors.error.light,
        dark: colors.error.dark,
      },
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
      action: {
        hover: alpha(colors.primary.main, 0.08),
        selected: alpha(colors.primary.main, 0.12),
        focus: alpha(colors.primary.main, 0.14),
        disabled: 'rgba(245, 245, 245, 0.28)',
        disabledBackground: 'rgba(245, 245, 245, 0.08)',
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
            scrollbarColor: `rgba(245,245,245,0.28) ${colors.brand.black}`,
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              backgroundColor: colors.brand.black,
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 8,
              backgroundColor: 'rgba(245,245,245,0.18)',
              minHeight: 24,
              border: `3px solid ${colors.brand.black}`,
            },
            '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
              backgroundColor: 'rgba(245,245,245,0.28)',
            },
            '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
              backgroundColor: 'rgba(245,245,245,0.28)',
            },
            '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
              backgroundColor: 'rgba(245,245,245,0.22)',
            },
            '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
              backgroundColor: colors.brand.black,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
      contained: {
        backgroundColor: colors.brand.gold,
        color: colors.primary.contrastText,
        '&:hover': {
          backgroundColor: colors.brand.goldHover,
        },
        '&:active': {
          backgroundColor: colors.brand.goldActive,
        },
      },
      outlined: {
        borderColor: 'rgba(245,245,245,0.18)',
        color: '#F5F5F5',
        '&:hover': {
          borderColor: alpha(colors.brand.gold, 0.5),
          backgroundColor: alpha(colors.brand.gold, 0.08),
        },
      },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: colors.primary.main,
            '&:hover': { color: colors.brand.goldHover },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: 'rgba(245,245,245,0.42)',
            '&.Mui-checked': { color: colors.primary.main },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary.main,
            },
          },
          notchedOutline: {
            borderColor: 'rgba(245,245,245,0.18)',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: colors.primary.main,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  };

  return createTheme(baseTheme);
};

export { colors, typography, spacing, breakpoints, shape, shadows, transitions, zIndex };
export default getTheme; 