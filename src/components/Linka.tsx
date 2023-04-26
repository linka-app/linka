import { AddBookmark } from '@/components/AddBookmark';
import { Credits } from '@/components/Credits';
import { Settings } from '@/components/Settings';
import {
  ColorModeContext,
  ColorModeContextType,
} from '@/contexts/ColorModeContext';
import { DrawerContextProvider } from '@/contexts/DrawerContext';
import LinearProgressContextProvider from '@/contexts/LinearProgressContext/LinearProgressContextProvider';
import ToastContextProvider from '@/contexts/ToastContext/ToastContextProvider';
import { useContexts } from '@/hooks';
import LinkaLogo from '@/images/logo.svg';
import { getConfig } from '@/utils/getConfig';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import KeyboardArrowLeftSharpIcon from '@mui/icons-material/KeyboardArrowLeftSharp';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
import {
  AppBar,
  Avatar,
  Box,
  Container,
  CssBaseline,
  IconButton,
  Stack,
  ThemeProvider,
  Toolbar,
  createTheme,
} from '@mui/material';
import React, { ReactNode } from 'react';

export const InnerComponent: React.FC<{
  version: string;
  children: ReactNode;
}> = (props) => {
  const { doDrawer, doDrawerClose, getDrawerState } = useContexts();

  const handleAddBookmark = () => {
    doDrawer({
      open: true,
      children: <AddBookmark onItemUpdate={doDrawerClose} />,
    });
  };

  const handleViewSettings = () => {
    doDrawer({
      open: true,
      children: <Settings />,
    });
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {!getDrawerState() ? (
            <Avatar src={LinkaLogo} alt="linka!" />
          ) : (
            <IconButton edge="end" onClick={doDrawerClose}>
              <KeyboardArrowLeftSharpIcon />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }}></Box>
          <Stack direction={'row'} spacing={2}>
            {getConfig().token && (
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
    </>
  );
};

export const Linka: React.FC<{
  version: string;
  children: ReactNode;
}> = (props) => {
  const { colorMode } = React.useContext(
    ColorModeContext
  ) as ColorModeContextType;

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: colorMode,
        },
      }),
    [colorMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LinearProgressContextProvider>
        <ToastContextProvider>
          <DrawerContextProvider>
            <InnerComponent version={props.version}>
              {props.children}
            </InnerComponent>
          </DrawerContextProvider>
        </ToastContextProvider>
      </LinearProgressContextProvider>
    </ThemeProvider>
  );
};

export default Linka;
