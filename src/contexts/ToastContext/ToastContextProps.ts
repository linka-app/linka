import { AlertColor } from '@mui/material';

export interface IToast {
  open?: boolean;
  timeout?: number;
  type?: AlertColor;
  title?: string;
  description?: string;
}

export type ToastContextType = {
  doToast: (toastMessage: IToast) => void;
};
