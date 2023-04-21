import {
  Alert,
  AlertTitle,
  Box,
  Container,
  CssBaseline,
  Snackbar,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import React, { ReactNode } from 'react';
import { ColorModeContext } from '../contexts/ColorModeContext';
import { IToast, ToastContext } from '../contexts/ToastContext';
import { Credits } from './Credits';

export const AppFrame: React.FC<{
  children: ReactNode;
}> = (props) => {
  const version = '1.3.0';
  const [toast, setToast] = React.useState<IToast>({
    open: false,
    title: '',
    description: '',
  });

  const doToast = (toastMessage: IToast) => {
    setToast({ open: true, timeout: 6000, ...toastMessage });
  };

  const handleClose = () => {
    setToast({ open: false, title: '' });
  };

  const getInitialMode = () => {
    const savedMode = localStorage.getItem('theme');
    return savedMode !== null && savedMode === 'dark' ? 'dark' : 'light';
  };

  const [mode, setMode] = React.useState<'light' | 'dark'>(getInitialMode);

  const toggleColorMode = React.useCallback(() => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newMode);
      return newMode;
    });
  }, []);

  const colorMode = React.useMemo(
    () => ({ toggleColorMode }),
    [toggleColorMode]
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ToastContext.Provider value={{ doToast }}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Snackbar
            open={toast.open}
            autoHideDuration={toast.timeout}
            onClose={handleClose}
          >
            <Alert variant="filled" onClose={handleClose} severity={toast.type}>
              <AlertTitle>{toast.title}</AlertTitle>
              {toast.description}
            </Alert>
          </Snackbar>

          <Container maxWidth="md">
            <Box mt={2} mb={2}>
              {props.children}
              <Credits version={version} />
            </Box>
          </Container>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </ToastContext.Provider>
  );
};
