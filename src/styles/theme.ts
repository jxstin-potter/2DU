import { alpha, createTheme, ThemeOptions } from '@mui/material/styles';

// Studious, calming palette (color theory: blues = trust/focus/calm; muted tones = reduced strain)
// Accent: slate blue — associated with focus, productivity, and calm.
//
// Split into two values, because one cannot do both jobs. The old single
// #5B7A9E failed WCAG AA twice over: white text on it measured 4.08:1, and it
// measured 4.16:1 as link text on the ground. Those requirements pull in
// opposite directions — a fill dark enough for white text is too dark to read
// as text itself — and in this hue they cross right where both fail.
//
//   accentMain  fills only (contained buttons, filled chips). White ink 5.60:1.
//   accentText  anything that IS text or a thin mark on the dark ground —
//               links, tab indicator, focus ring, active nav. 4.98:1 on ground.
//
// Never set accentMain on text, and never fill a surface with accentText.
const accentMain = '#4B6481';
const accentHover = '#526E8E';
const accentActive = '#435A75';
const accentText = '#6A87A9';

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
    accentText,
  },
  // Theme tokens (primary = slate blue for studious/calm)
  primary: {
    main: accentMain,
    light: accentText,
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
  // Task priority. One set, checked against the ground: high 5.76:1,
  // medium 7.91:1, low 6.99:1. Previously three different palettes lived in
  // TodayView, inlineTaskEditorPriority and TaskDetailModal.
  priority: {
    high: '#E06C6C',
    medium: '#D4A05A',
    low: '#7BA3C9',
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
    light: accentText,
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

// Typography follows the "technical editorial" direction measured from nine
// Awwwards winners (see ~/design-tokens/README.md for the method and numbers).
// Three rules from that study drive everything below:
//
//   1. Hierarchy is size, never weight. Across ~2,400 measured nodes, weight
//      700+ appeared 13 times. WEIGHT_MAX is the ceiling and MUI's
//      fontWeightBold is pinned to it so Button/Chip/table headers cannot
//      quietly reach past it.
//   2. Body sets small and tracks tight. 13px matches the sample's median and
//      the size Sidebar.tsx already hardcoded, so this makes the app
//      consistent rather than shrinking it.
//   3. Display sets tight enough to nearly touch; body stays loose. Nothing
//      lands in between.
const WEIGHT = 400;
const WEIGHT_MAX = 500;
const TRACK_BODY = '-0.025em';
const TRACK_DISPLAY = '-0.04em';

const FONT_SANS =
  "'Switzer', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const FONT_MONO = "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const typography = {
  fontFamily: FONT_SANS,
  fontWeightLight: WEIGHT,
  fontWeightRegular: WEIGHT,
  fontWeightMedium: WEIGHT_MAX,
  fontWeightBold: WEIGHT_MAX,
  h1: {
    fontSize: 'clamp(2.5rem, 9vw, 5.5rem)',
    fontWeight: WEIGHT,
    lineHeight: 0.95,
    letterSpacing: TRACK_DISPLAY,
  },
  h2: {
    fontSize: '2.75rem',
    fontWeight: WEIGHT,
    lineHeight: 1.02,
    letterSpacing: TRACK_DISPLAY,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: WEIGHT,
    lineHeight: 1.1,
    letterSpacing: TRACK_DISPLAY,
  },
  h4: {
    fontSize: '1.375rem',
    fontWeight: WEIGHT,
    lineHeight: 1.2,
    letterSpacing: TRACK_BODY,
  },
  h5: {
    fontSize: '1.125rem',
    fontWeight: WEIGHT_MAX,
    lineHeight: 1.3,
    letterSpacing: TRACK_BODY,
  },
  h6: {
    fontSize: '0.9375rem',
    fontWeight: WEIGHT_MAX,
    lineHeight: 1.35,
    letterSpacing: TRACK_BODY,
  },
  subtitle1: {
    fontSize: '0.9375rem',
    fontWeight: WEIGHT_MAX,
    lineHeight: 1.5,
    letterSpacing: TRACK_BODY,
  },
  subtitle2: {
    fontSize: '0.8125rem',
    fontWeight: WEIGHT_MAX,
    lineHeight: 1.5,
    letterSpacing: TRACK_BODY,
  },
  body1: {
    fontSize: '0.8125rem',
    fontWeight: WEIGHT,
    lineHeight: 1.5,
    letterSpacing: TRACK_BODY,
  },
  body2: {
    fontSize: '0.75rem',
    fontWeight: WEIGHT,
    lineHeight: 1.5,
    letterSpacing: TRACK_BODY,
  },
  button: {
    fontSize: '0.8125rem',
    textTransform: 'none' as const,
    fontWeight: WEIGHT_MAX,
    letterSpacing: TRACK_BODY,
  },
  caption: {
    fontSize: '0.6875rem',
    fontWeight: WEIGHT,
    lineHeight: 1.4,
    letterSpacing: TRACK_BODY,
  },
  // The mono label. The one place in the system where tracking opens up -
  // five of the nine measured sites pair a grotesque with a mono for exactly
  // this: uppercase meta, counts and timestamps.
  overline: {
    fontFamily: FONT_MONO,
    fontSize: '0.6875rem',
    fontWeight: WEIGHT,
    lineHeight: 1.4,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
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
// Motion runs roughly 3x longer than stock Material and decelerates hard.
// Material's own cubic-bezier(0.4, 0, 0.2, 1) appeared almost nowhere in the
// measured sample; this ease is the one Aspen Search and Cerebrium share.
// Small interactions still feel immediate because MUI drives hovers off
// `shortest`, which stays near 200ms.
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

const transitions = {
  duration: {
    shortest: 200,
    shorter: 300,
    short: 400,
    standard: 600,
    complex: 780,
    enteringScreen: 450,
    leavingScreen: 360,
  },
  easing: {
    easeInOut: EASE,
    easeOut: EASE,
    easeIn: EASE,
    sharp: EASE,
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
// 7px, not 8. Radius in the sample was strictly bimodal - either 0 or ~7px,
// with nothing in the 12-16px range that most systems default to.
const shape = {
  borderRadius: 7,
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
        // Neutral, not accent-tinted. These fire on every list row, nav item
        // and icon button in the app - tinting them made the accent the most
        // common colour on screen rather than a signal.
        hover: 'rgba(245, 245, 245, 0.06)',
        selected: 'rgba(245, 245, 245, 0.10)',
        focus: 'rgba(245, 245, 245, 0.12)',
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
            color: colors.primary.light,
            '&:hover': { color: inkPrimary },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: 'rgba(245,245,245,0.42)',
            '&.Mui-checked': { color: colors.primary.light },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: shape.borderRadius,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary.light,
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
            backgroundColor: colors.primary.light,
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
            // Neutral. An avatar is an identity surface, not an accent one.
            backgroundColor: colors.brand.blackElevated2,
            color: inkSecondary,
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

/**
 * Mono meta styling for text that is data rather than prose - dates, counts,
 * timestamps. The `overline` variant covers the uppercase cases (section
 * headers, labels); this covers the ones that should stay in mixed case,
 * where uppercasing a date would just shout.
 *
 * `tabular-nums` is the point as much as the face: it stops due dates and
 * counts jittering as digits change width down a list.
 */
export const monoMeta = {
  fontFamily: FONT_MONO,
  fontVariantNumeric: 'tabular-nums' as const,
  letterSpacing: '0.01em',
};

export { colors, typography, spacing, breakpoints, shape, transitions, zIndex, FONT_MONO };
export default getTheme;
