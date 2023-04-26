import { DrawerContext } from '@/contexts/DrawerContext';
import { ToastContext } from '@/contexts/ToastContext';
import React from 'react';

export const useContexts = () => {
  const { doToast } = React.useContext(ToastContext);
  const { doDrawer } = React.useContext(DrawerContext);

  return {
    doToast,
    doDrawer,
  } as const;
};

export default useContexts;
