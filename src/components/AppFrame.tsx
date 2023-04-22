import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import {
  Alert,
  AlertTitle,
  AppBar,
  Avatar,
  Box,
  Container,
  CssBaseline,
  Drawer,
  IconButton,
  Snackbar,
  ThemeProvider,
  Toolbar,
  createTheme,
} from '@mui/material';
import React, { ReactNode } from 'react';
import { ColorModeContext } from '../contexts/ColorModeContext';
import { DrawerContext, IDrawer } from '../contexts/DrawerContext';
import { IToast, ToastContext } from '../contexts/ToastContext';
import LinkaLogo from '../images/logo192.png';
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

  const [drawer, setDrawer] = React.useState<IDrawer>({
    open: false,
    children: <></>,
  });

  const handleDrawerClose = () => {
    setDrawer({ open: false, children: <></> });
  };

  const doToast = (toastMessage: IToast) => {
    setToast({ open: true, timeout: 6000, ...toastMessage });
  };

  const handleClose = () => {
    setToast({ open: false, title: '' });
  };

  const doDrawer = (drawerMessage: IDrawer) => {
    setDrawer({ open: false, ...drawerMessage });
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
        <DrawerContext.Provider value={{ doDrawer }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar
              position="fixed"
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
              <Toolbar>
                {!drawer.open ? (
                  <Avatar src={LinkaLogo} alt="linka!" />
                ) : (
                  <IconButton edge="end" onClick={handleDrawerClose}>
                    <KeyboardArrowLeftOutlinedIcon />
                  </IconButton>
                )}
              </Toolbar>
            </AppBar>
            <Drawer anchor={'right'} open={drawer.open}>
              <Box sx={{ width: '100vw' }} mt={'75px'} role="presentation">
                <Container fixed>{drawer.children}</Container>
              </Box>
            </Drawer>
            <Snackbar
              open={toast.open}
              autoHideDuration={toast.timeout}
              onClose={handleClose}
            >
              <Alert
                variant="filled"
                onClose={handleClose}
                severity={toast.type}
              >
                <AlertTitle>{toast.title}</AlertTitle>
                {toast.description}
              </Alert>
            </Snackbar>
            <Container fixed>
              <Box mt={'75px'} mb={2}>
                {props.children}
                <Credits version={version} />
              </Box>
            </Container>
          </ThemeProvider>
        </DrawerContext.Provider>
      </ColorModeContext.Provider>
    </ToastContext.Provider>
  );
};