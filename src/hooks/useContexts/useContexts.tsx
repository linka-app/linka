import { ColorModeContextType } from "@/contexts/ColorModeContext";
import ColorModeContext from "@/contexts/ColorModeContext/ColorModeContext";
import React from "react";
import { LinkaContext, LinkaContextType } from "@/contexts/LinkaContext";

export const useContexts = () => {
  const {
    doLoading,
    doLoadingToggle,
    doToast,
    doDrawer,
    doDrawerClose,
    getDrawerState,
    config,
    setConfig,
    bookmarks,
  } = React.useContext(LinkaContext) as LinkaContextType;

  const theBookmarks = () => {
    return { ...bookmarks };
  };
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
    config,
    setConfig,
    theBookmarks,
  } as const;
};

export default useContexts;
