import React from 'react';
import { Box, Button } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

interface InlineTaskEditorFooterProps {
  show: boolean;
  isSubmitting: boolean;
  isSaveDisabled: boolean;
  onCancel: () => void;
}

const InlineTaskEditorFooter: React.FC<InlineTaskEditorFooterProps> = ({
  show,
  isSubmitting,
  isSaveDisabled,
  onCancel,
}) => {
  const theme = useTheme();

  if (!show) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 1,
        mt: 1.25,
        pt: 1,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
      }}
    >
      <Button
        type="button"
        variant="text"
        color="inherit"
        size="small"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onCancel();
        }}
        disabled={isSubmitting}
        sx={{
          textTransform: 'none',
          fontSize: '0.8125rem',
          fontWeight: 600,
          height: '28px',
          borderRadius: '6px',
          px: 1.5,
          minWidth: '68px',
          color: theme.palette.text.secondary,
          '&:hover': {
            backgroundColor: alpha(theme.palette.action.hover, 0.5),
          },
        }}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="contained"
        disableElevation
        size="small"
        onClick={(e) => e.stopPropagation()}
        disabled={isSubmitting || isSaveDisabled}
        sx={{
          textTransform: 'none',
          fontSize: '0.8125rem',
          fontWeight: 600,
          height: '28px',
          borderRadius: '6px',
          px: 2,
          minWidth: '68px',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
          '&.Mui-disabled': {
            backgroundColor: alpha(theme.palette.primary.main, 0.35),
            color: alpha(theme.palette.primary.contrastText, 0.75),
          },
        }}
      >
        Save
      </Button>
    </Box>
  );
};

export default InlineTaskEditorFooter;

