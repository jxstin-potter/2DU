import React from 'react';
import { Menu, MenuItem, ListItemText } from '@mui/material';

interface InlineTaskEditorMoreMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const InlineTaskEditorMoreMenu: React.FC<InlineTaskEditorMoreMenuProps> = ({ anchorEl, onClose }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: {
          minWidth: 180,
          mt: 1,
        },
      }}
    >
      <MenuItem onClick={onClose}>
        <ListItemText>Add subtask</ListItemText>
      </MenuItem>
      <MenuItem onClick={onClose}>
        <ListItemText>Add comment</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default InlineTaskEditorMoreMenu;

