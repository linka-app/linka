import React from 'react';

export interface IDrawer {
  open?: boolean;
  children: React.ReactNode;
}

export const DrawerContext = React.createContext({
  doDrawer: (drawerMessage: IDrawer) => {},
});
