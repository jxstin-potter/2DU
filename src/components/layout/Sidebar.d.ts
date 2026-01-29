import React from 'react';
import { User } from '../../types';
interface SidebarProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    darkMode: boolean;
    toggleDarkMode: () => void;
    onLogout: () => void;
    userName?: string;
    user?: User | null;
    onOpenShortcutsHelp: () => void;
    onOpenSettings?: () => void;
}
declare const Sidebar: React.FC<SidebarProps>;
export default Sidebar;
