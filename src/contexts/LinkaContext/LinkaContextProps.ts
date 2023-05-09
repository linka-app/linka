import {
  BookmarkItem,
  LinkaPartialSettings,
  LinkaSettings,
  QueryBookmarkMode,
} from "@/types";
import { AlertColor } from "@mui/material";
import React from "react";
import { Index } from "flexsearch";

export interface ILinka {
  open?: boolean;
  children: React.ReactNode;
}

export interface IToast {
  open?: boolean;
  timeout?: number;
  type?: AlertColor;
  title?: string;
  description?: string;
}

export type LinkaContextType = {
  config: LinkaSettings;
  setConfig: (config: LinkaPartialSettings) => void;
  doDrawer: (drawerMessage: ILinka) => void;
  doDrawerClose: () => void;
  getDrawerState: () => boolean;
  doLoading: (state: boolean) => void;
  doLoadingToggle: () => void;
  doToast: (toastMessage: IToast) => void;
  bookmarks: {
    loadingBookmarks: boolean;
    bookmarks: BookmarkItem[];
    bookmarksIndex: Index;
    getTheBookmarks: (defaultBookmarkQuery?: QueryBookmarkMode) => void;
  };
};
