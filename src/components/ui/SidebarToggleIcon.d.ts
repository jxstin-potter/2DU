import React from 'react';
import { SvgIconProps } from '@mui/material';
interface SidebarToggleIconProps extends SvgIconProps {
    isCollapsed?: boolean;
}
declare const SidebarToggleIcon: React.FC<SidebarToggleIconProps>;
export default SidebarToggleIcon;
