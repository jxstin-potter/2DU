import { alpha, createTheme, ThemeOptions } from '@mui/material/styles';

// Studious, calming palette (color theory: blues = trust/focus/calm; muted tones = reduced strain)
// Accent: slate blue — associated with focus, productivity, and calm; used in many productivity/education UIs
const accentMain = '#5B7A9E';
const accentHover = '#6A8AA8';
const accentActive = '#4A6582';
const accentLight = '#7B9BB8';

// Define color palette
const colors = {
  // Brand: dark blue-grays (softer than pure black; less harsh for long reading)
  brand: {
    black: '#0F1419',
    blackElevated: '#161D26',
    blackElevated2: '#1C2530',
    accent: accentMain,
    accentHover,
    accentActive,
  },
  // Theme tokens (primary = slate blue for studious/calm)
  primary: {
    main: accentMain,
    light: accentLight,
    dark: accentActive,
    contrastText: '#F5F5F5',
  },
  secondary: {
    main: '#8B9AAF',
    light: '#A8B8C9',
    dark: '#6B7D94',
    contrastText: '#0F1419',
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
    main: accentMain,
    light: accentLight,
    dark: accentActive,
  },
};

// Surface lines and fills. The app is always dark, so these are the single
// source for "a hairline on the dark ground" rather than each component
// re-deriving its own alpha(common.white, x).
const line = 'rgba(245, 245, 245, 0.12)';
const lineStrong = 'rgba(245, 245, 245, 0.18)';
const inkPrimary = '#F5F5F5';
const inkSecondary = 'rgba(245, 245, 245, 0.72)';

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
    textTransform: 'none' as const,
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

// Export theme based on mode
export const getTheme = (_requestedMode: 'light' | 'dark') => {
  // App-wide decision: always use dark mode (param kept for compatibility).
  const mode = 'dark' as const;

  const baseTheme: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: colors.primary.main,
        dark: colors.brand.accentActive,
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
        primary: inkPrimary,
        secondary: inkSecondary,
      },
      divider: line,
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
        hover: alpha(colors.brand.accent, 0.08),
        selected: alpha(colors.brand.accent, 0.12),
        focus: alpha(colors.brand.accent, 0.14),
        disabled: 'rgba(245, 245, 245, 0.28)',
        disabledBackground: 'rgba(245, 245, 245, 0.08)',
      },
    },
    typography,
    shape,
    spacing,
    breakpoints,
    transitions,
    zIndex,
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
          root: {
            borderRadius: shape.borderRadius,
            textTransform: 'none',
            fontWeight: 500,
            padding: '8px 16px',
          },
          contained: {
            backgroundColor: colors.brand.accent,
            color: colors.primary.contrastText,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: colors.brand.accentHover,
              boxShadow: 'none',
            },
            '&:active': {
              backgroundColor: colors.brand.accentActive,
            },
          },
          outlined: {
            borderColor: lineStrong,
            color: inkPrimary,
            '&:hover': {
              borderColor: alpha(colors.brand.accent, 0.5),
              backgroundColor: alpha(colors.brand.accent, 0.08),
            },
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: colors.primary.main,
            '&:hover': { color: colors.brand.accentHover },
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
            borderRadius: shape.borderRadius,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary.main,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(245,245,245,0.28)',
            },
          },
          notchedOutline: {
            borderColor: lineStrong,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            minHeight: 48,
            fontWeight: 500,
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: 48,
            borderBottom: `1px solid ${line}`,
          },
          indicator: {
            backgroundColor: colors.primary.main,
            height: 3,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: shape.borderRadius,
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
          root: ({ theme }) => ({
            borderRadius: shape.borderRadius,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }),
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: shape.borderRadius,
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
            borderRadius: 6,
            fontWeight: 500,
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
            borderRadius: 13,
            border: 'none',
            backgroundColor: 'rgba(245,245,245,0.22)',
            opacity: 1,
            transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            border: 'none',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: colors.brand.blackElevated2,
            border: `1px solid ${line}`,
            borderRadius: 4,
            fontSize: '0.75rem',
            padding: '8px 12px',
          },
          arrow: {
            color: colors.brand.blackElevated2,
          },
        },
      },
    },
  };

  return createTheme(baseTheme);
};

export { colors, typography, spacing, breakpoints, shape, transitions, zIndex };
export default getTheme;
