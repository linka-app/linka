import { ColorModeContextType } from '@/contexts/ColorModeContext';
import ColorModeContext from '@/contexts/ColorModeContext/ColorModeContext';
import { DrawerContext, DrawerContextType } from '@/contexts/DrawerContext';
import {
  LinearProgressContext,
  LinearProgressContextType,
} from '@/contexts/LinearProgressContext';
import { ToastContext, ToastContextType } from '@/contexts/ToastContext';
import React from 'react';

export const useContexts = () => {
  const { doLoading, doLoadingToggle } = React.useContext(
    LinearProgressContext
  ) as LinearProgressContextType;
  const { doToast } = React.useContext(ToastContext) as ToastContextType;
  const { doDrawer, doDrawerClose, getDrawerState } = React.useContext(
    DrawerContext
  ) as DrawerContextType;
  const { toggleColorMode, colorMode } = React.useContext(
    ColorModeContext
  ) as ColorModeContextType;

  return {
    doToast,
    doLoading,
    doLoadingToggle,
    doDrawer,
    doDrawerClose,
    getDrawerState,
    toggleColorMode,
    colorMode,
  } as const;
};

export default useContexts;
