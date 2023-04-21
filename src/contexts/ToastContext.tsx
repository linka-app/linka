import { AlertColor } from '@mui/material';
import React from 'react';

export interface IToast {
  open?: boolean;
  type?: AlertColor;
  title: string;
  description?: string;
  timeout?: number;
}

export const ToastContext = React.createContext({
  doToast: (toastMessage: IToast) => {},
});
