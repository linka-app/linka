import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import KeyboardArrowLeftSharpIcon from '@mui/icons-material/KeyboardArrowLeftSharp';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
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
  Stack,
  ThemeProvider,
  Toolbar,
  createTheme,
} from '@mui/material';
import React, { ReactNode } from 'react';
import { ColorModeContext } from '../contexts/ColorModeContext';
import { DrawerContext, IDrawer } from '../contexts/DrawerContext';
import { IToast, ToastContext } from '../contexts/ToastContext';
import LinkaLogo from '../images/logo192.png';
import { getAuth } from '../utils/getAuth';
import { AddBookmark } from './AddBookmark';
import { Credits } from './Credits';
import { Settings } from './Settings';

export const Linka: React.FC<{
  version: string;
  children: ReactNode;
}> = (props) => {
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

  const handleAddBookmark = () => {
    setDrawer({
      open: true,
      children: <AddBookmark onItemUpdate={handleDrawerClose} />,
    });
  };

  const handleViewSettings = () => {
    setDrawer({
      open: true,
      children: <Settings />,
    });
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
                    <KeyboardArrowLeftSharpIcon />
                  </IconButton>
                )}
                <Box sx={{ flexGrow: 1 }}></Box>
                <Stack direction={'row'} spacing={2}>
                  {getAuth() && (
                    <IconButton edge="end" onClick={handleAddBookmark}>
                      <AddCircleSharpIcon />
                    </IconButton>
                  )}
                  <IconButton edge="end" onClick={handleViewSettings}>
                    <SettingsSharpIcon />
                  </IconButton>
                </Stack>
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
                <Stack
                  mb={2}
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Credits version={props.version} />
                </Stack>
              </Box>
            </Container>
          </ThemeProvider>
        </DrawerContext.Provider>
      </ColorModeContext.Provider>
    </ToastContext.Provider>
  );
};
