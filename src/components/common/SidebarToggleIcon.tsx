import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

interface SidebarToggleIconProps extends SvgIconProps {
  isCollapsed?: boolean;
}

const SidebarToggleIcon: React.FC<SidebarToggleIconProps> = ({ isCollapsed = false, ...props }) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" sx={{ fontSize: '1.25rem' }}>
      {isCollapsed ? (
        // Collapsed state: Show only main content area (simplified)
        <g>
          <rect x="3" y="4" width="18" height="16" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="7" y1="7" x2="17" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="7" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="7" y1="13" x2="17" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="7" y1="16" x2="17" y2="16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      ) : (
        // Expanded state: Show sidebar on left and main content on right
        <g>
          {/* Sidebar - left panel */}
          <rect x="3" y="4" width="7" height="16" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="6.5" cy="7.5" r="1" fill="currentColor" />
          <circle cx="6.5" cy="10.5" r="1" fill="currentColor" />
          <circle cx="6.5" cy="13.5" r="1" fill="currentColor" />
          <circle cx="6.5" cy="16.5" r="1" fill="currentColor" />
          
          {/* Main content area - right panel */}
          <rect x="12" y="4" width="9" height="16" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="14" y1="7" x2="19" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="14" y1="10" x2="19" y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="14" y1="13" x2="19" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="14" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      )}
    </SvgIcon>
  );
};

export default SidebarToggleIcon;
