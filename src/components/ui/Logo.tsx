import React from 'react';
import { useTheme } from '@mui/material/styles';

interface LogoProps {
  /** Rendered width/height in px. The mark is square. */
  size?: number;
  /** Tile fill. Defaults to the brand accent. */
  color?: string;
  title?: string;
}

/**
 * The 2DU mark: an accent tile with the wordmark set in the app's own type.
 * public/favicon.svg and the PWA icons in public/icons/ are generated from
 * this same geometry (scripts/generate-brand-assets.cjs), so the tab icon,
 * the installed app icon and the in-app mark stay one mark.
 */
const Logo: React.FC<LogoProps> = ({ size = 44, color, title = '2DU' }) => {
  const theme = useTheme();
  const fill = color ?? theme.palette.primary.main;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      focusable="false"
    >
      <rect width="64" height="64" rx="14" fill={fill} />
      <text
        x="32"
        y="33"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#FFFFFF"
        fontFamily={theme.typography.fontFamily}
        fontSize="21"
        // 500 is the system ceiling and the heaviest weight actually loaded.
        // Asking for 800 here would render synthesised bold, not real Switzer.
        fontWeight="500"
        letterSpacing="-1"
      >
        2DU
      </text>
    </svg>
  );
};

export default Logo;
