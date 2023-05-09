import { ContextProviderProps } from '@/types';
import { Box, Container, Drawer } from '@mui/material';
import { FC, useState } from 'react';
import { DrawerContext } from './DrawerContext';
import { IDrawer } from './DrawerContextProps';

const ToastContextProvider: FC<ContextProviderProps> = ({ children }) => {
  const [drawer, setDrawer] = useState<IDrawer>({
    open: false,
    children: <></>,
  });

  const doDrawerClose = () => {
    setDrawer({ open: false, children: <></> });
  };

  const doDrawer = (drawerMessage: IDrawer) => {
    setDrawer({ open: false, ...drawerMessage });
  };

  const getDrawerState = () => {
    return drawer.open ? true : false;
  };

  return (
    <DrawerContext.Provider value={{ doDrawer, doDrawerClose, getDrawerState }}>
      <Drawer anchor={'right'} open={drawer.open}>
        <Box sx={{ width: '100vw' }} mt={'75px'} role="presentation">
          <Container fixed>{drawer.children}</Container>
        </Box>
      </Drawer>
      {children}
    </DrawerContext.Provider>
  );
};

export default ToastContextProvider;
