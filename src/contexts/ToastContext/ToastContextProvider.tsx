import { ContextProviderProps } from '@/types';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { FC, useState } from 'react';
import { ToastContext } from './ToastContext';
import { IToast } from './ToastContextProps';

const ToastContextProvider: FC<ContextProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<IToast>({
    open: false,
    timeout: 6000,
    type: 'success',
    title: '',
  });

  const doToast = (toastMessage: IToast) => {
    setToast({
      open: true,
      type: 'success',
      timeout: 6000,
      ...toastMessage,
    });
  };

  const handleClose = () => {
    setToast({ open: false, title: '' });
  };

  return (
    <ToastContext.Provider value={{ doToast }}>
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.timeout}
        onClose={handleClose}
      >
        <Alert variant="filled" onClose={handleClose} severity={toast.type}>
          <AlertTitle>{toast.title}</AlertTitle>
          {toast.description}
        </Alert>
      </Snackbar>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastContextProvider;
