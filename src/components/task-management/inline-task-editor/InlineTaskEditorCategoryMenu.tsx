import React from 'react';
import { Box, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FolderOutlined as FolderIcon, KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { Category } from '../../../types';

interface InlineTaskEditorCategoryMenuProps {
  categories: Category[];
  selectedCategoryId?: string;
  selectedCategoryName?: string;
  anchorEl: HTMLElement | null;
  onOpen: (el: HTMLElement) => void;
  onClose: () => void;
  onSelect: (categoryId?: string) => void;
}

const InlineTaskEditorCategoryMenu: React.FC<InlineTaskEditorCategoryMenuProps> = ({
  categories,
  selectedCategoryId,
  selectedCategoryName,
  anchorEl,
  onOpen,
  onClose,
  onSelect,
}) => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          mt: 0.5,
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.8,
          },
        }}
        onClick={(e) => onOpen(e.currentTarget)}
      >
        <FolderIcon sx={{ fontSize: '1rem', color: theme.palette.text.secondary }} />
        <Box
          component="span"
          sx={{
            fontSize: '0.8125rem',
            color: theme.palette.text.secondary,
            fontWeight: 500,
          }}
        >
          {selectedCategoryName || 'No project'}
        </Box>
        <KeyboardArrowDownIcon sx={{ fontSize: '1rem', color: theme.palette.text.secondary }} />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        PaperProps={{
          sx: {
            minWidth: 200,
            mt: 1,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            onSelect(undefined);
            onClose();
          }}
          selected={!selectedCategoryId}
        >
          <ListItemIcon>
            <FolderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>No project</ListItemText>
        </MenuItem>
        {categories.map((category) => (
          <MenuItem
            key={category.id}
            onClick={() => {
              onSelect(category.id);
              onClose();
            }}
            selected={selectedCategoryId === category.id}
          >
            <ListItemText>{category.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default InlineTaskEditorCategoryMenu;

