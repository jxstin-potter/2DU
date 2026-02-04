import React from 'react';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface TodayAddTaskButtonProps {
  onClick: () => void;
}

const TodayAddTaskButton: React.FC<TodayAddTaskButtonProps> = ({ onClick }) => {
  return (
    <Button
      fullWidth
      disableRipple
      startIcon={
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
            transition: 'background-color 0.2s ease, color 0.2s ease',
          }}
        >
          <AddIcon sx={{ fontSize: '1rem', color: 'inherit' }} />
        </Box>
      }
      onClick={onClick}
      sx={{
        justifyContent: 'flex-start',
        textTransform: 'none',
        minHeight: 36,
        py: 0,
        px: 2,
        color: 'text.secondary',
        borderRadius: 1,
        transition: 'color 0.2s ease, background-color 0.2s ease',
        '& .MuiButton-startIcon > *': {
          transition: 'background-color 0.2s ease, color 0.2s ease',
        },
        '&:hover': {
          color: 'primary.main',
          backgroundColor: 'transparent',
        },
        '&:hover .MuiButton-startIcon > *': {
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
        },
      }}
    >
      Add task
    </Button>
  );
};

export default TodayAddTaskButton;

