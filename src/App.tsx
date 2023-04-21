import CloseIcon from '@mui/icons-material/Close';
import {
  CssBaseline,
  Snackbar,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import './App.css';
import Linka from './components/Linka';
import { ColorModeContext } from './contexts/ColorModeContext';
import { ToastContext } from './contexts/ToastContext';

function App() {
  const version = '1.3.0';
  const [toast, setToast] = React.useState<{
    open: boolean;
    title: string;
    description?: string;
  }>({
    open: false,
    title: '',
    description: '',
  });

  const doToast = (toastMessage: {
    open: boolean;
    title: string;
    description?: string;
  }) => {
    setToast({ ...toastMessage });
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

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    //@ts-ignore
    <ToastContext.Provider value={{ doToast }}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Snackbar
            open={toast.open}
            onClose={handleClose}
            autoHideDuration={6000}
            message={`${toast.title} ${toast.description}`}
            action={action}
          />
          <Linka version={version}></Linka>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </ToastContext.Provider>
  );
}

export default App;
