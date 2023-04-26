import { useContexts } from '@/hooks';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Box, Button, useTheme } from '@mui/material';
import * as React from 'react';

export const ColorModeSwitcher: React.FC = () => {
  const theme = useTheme();
  const { toggleColorMode } = useContexts();

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.primary',
      }}
    >
      <Button
        variant="outlined"
        endIcon={
          theme.palette.mode === 'dark' ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )
        }
        onClick={toggleColorMode}
        color="inherit"
      >
        {theme.palette.mode} mode
      </Button>
    </Box>
  );
};

export default ColorModeSwitcher;
