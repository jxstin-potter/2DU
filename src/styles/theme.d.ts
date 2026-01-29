declare const colors: {
    primary: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
    };
    secondary: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
    };
    accent: {
        purple: string;
        orange: string;
        pink: string;
        teal: string;
    };
    neutral: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
    };
    success: {
        main: string;
        light: string;
        dark: string;
    };
    warning: {
        main: string;
        light: string;
        dark: string;
    };
    error: {
        main: string;
        light: string;
        dark: string;
    };
    info: {
        main: string;
        light: string;
        dark: string;
    };
};
declare const typography: {
    fontFamily: string;
    h1: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
        letterSpacing: string;
    };
    h2: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
        letterSpacing: string;
    };
    h3: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
        letterSpacing: string;
    };
    h4: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
        letterSpacing: string;
    };
    h5: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
    };
    h6: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
    };
    subtitle1: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
    };
    subtitle2: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
    };
    body1: {
        fontSize: string;
        lineHeight: number;
    };
    body2: {
        fontSize: string;
        lineHeight: number;
    };
    button: {
        textTransform: string;
        fontWeight: number;
    };
    caption: {
        fontSize: string;
        lineHeight: number;
    };
    overline: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
        letterSpacing: string;
    };
};
declare const spacing = 8;
declare const breakpoints: {
    values: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
    };
};
declare const shadows: string[];
declare const transitions: {
    duration: {
        shortest: number;
        shorter: number;
        short: number;
        standard: number;
        complex: number;
        enteringScreen: number;
        leavingScreen: number;
    };
    easing: {
        easeInOut: string;
        easeOut: string;
        easeIn: string;
        sharp: string;
    };
};
declare const zIndex: {
    mobileStepper: number;
    fab: number;
    speedDial: number;
    appBar: number;
    drawer: number;
    modal: number;
    snackbar: number;
    tooltip: number;
};
declare const shape: {
    borderRadius: number;
};
export declare const keyframes: {
    completeTask: string;
    uncompleteTask: string;
    checkmarkAppear: string;
    checkboxPulse: string;
    fadeIn: string;
    slideIn: string;
    scaleIn: string;
    shake: string;
    statusChange: string;
};
export declare const getTheme: (mode: "light" | "dark") => import("@mui/material").Theme;
export { colors, typography, spacing, breakpoints, shape, shadows, transitions, zIndex };
export default getTheme;
