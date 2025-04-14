# 2DU Styling Guide

## Overview

This application uses a consolidated approach to styling with three main methods:

1. **Material UI Theme System** - The primary styling method using a centralized theme
2. **CSS Modules** - For component-specific styles that need isolation
3. **Global Utility CSS** - For animations and utility classes used across components

## Theme System

The theme is defined in `src/styles/theme.ts` and provides:

- Color palettes for light and dark modes
- Typography styles
- Spacing values
- Breakpoints for responsive design
- Component style overrides
- Animation keyframes

### Using Theme in Components

```tsx
import { useTheme } from '@mui/material/styles';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <div style={{ 
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(2)
    }}>
      Content
    </div>
  );
};
```

### The `sx` Prop (Preferred Method)

For MUI components, use the `sx` prop for direct theme access:

```tsx
<Box 
  sx={{ 
    color: 'primary.main',
    backgroundColor: 'background.paper',
    p: 2, // theme.spacing(2)
    borderRadius: 1, // theme.shape.borderRadius
    boxShadow: 3, // theme.shadows[3]
    '&:hover': {
      backgroundColor: 'action.hover'
    }
  }}
>
  Content
</Box>
```

## CSS Modules

For component-specific styles that need isolation:

1. Create a file named `ComponentName.module.css` next to your component
2. Import and use the styles in your component

Example:

```css
/* Button.module.css */
.button {
  padding: 8px 16px;
  border-radius: 4px;
}

.primary {
  background-color: #3b82f6;
  color: white;
}
```

```tsx
// Button.tsx
import styles from './Button.module.css';

const Button = ({ primary, children }) => (
  <button className={`${styles.button} ${primary ? styles.primary : ''}`}>
    {children}
  </button>
);
```

## Global CSS

The global CSS file (`src/styles/global.css`) contains:

- CSS reset (fallback for MUI's CssBaseline)
- Animation keyframes
- Utility classes
- Media queries for accessibility and responsive design

### Animations

To use the predefined animations:

```tsx
<div className="animate-fade-in">
  Content that fades in
</div>
```

Available animation classes:
- `animate-slide-in`
- `animate-fade-in`
- `animate-scale-in`
- `animate-checkmark`
- `animate-pulse`
- `animate-shake`
- `animate-status-change`
- `checkmark-animate`

### Utility Classes

Common utility classes:
- `user-select-none` - Prevents text selection
- `sr-only` - Visually hides content while keeping it accessible to screen readers
- `skeleton-loading` - Applies a shimmer effect for loading states

## Best Practices

1. **Use the theme system first**: Prefer the MUI theme system for most styling needs
2. **CSS Modules for component isolation**: Use CSS Modules when you need component-specific styles
3. **Global CSS sparingly**: Only use global CSS for truly global styles and animations
4. **Be consistent with colors**: Always use theme colors instead of hardcoded values
5. **Responsive design**: Use theme breakpoints for media queries
6. **Accessibility**: Ensure proper contrast and respect user preferences like reduced motion

## Migration Guide

When working with legacy code that uses the old styling:

1. First check if the component uses Material UI components
2. If yes, update to use theme values and the `sx` prop
3. If no, consider converting to Material UI or use CSS Modules
4. Remove dependencies on the deprecated `styles.css` file

## Examples

### Before and After

**Before (old approach):**

```tsx
<div className="card">
  <h2 className="card-title">Title</h2>
  <p className="card-content">Content</p>
  <button className="btn btn-primary">Action</button>
</div>
```

**After (new approach):**

```tsx
<Card sx={{ p: 2 }}>
  <Typography variant="h5" sx={{ mb: 1 }}>Title</Typography>
  <Typography variant="body2" sx={{ mb: 2 }}>Content</Typography>
  <Button variant="contained" color="primary">Action</Button>
</Card>
```

## Theming Guidelines

### Adding New Components to the Theme

To add styling for a new Material UI component to the theme:

```ts
// In theme.ts -> components object
MuiNewComponent: {
  styleOverrides: {
    root: {
      // base styles for the component
    },
    // other component parts
  },
}
```

### Creating Custom Theme Extensions

For custom properties or values:

```ts
declare module '@mui/material/styles' {
  interface Theme {
    customProperty: {
      value1: string;
      value2: string;
    };
  }
  interface ThemeOptions {
    customProperty?: {
      value1?: string;
      value2?: string;
    };
  }
}
``` 