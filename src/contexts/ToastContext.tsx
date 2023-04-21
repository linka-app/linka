import React from 'react';

export const ToastContext = React.createContext({
  doToast: (toastMessage: {
    open: boolean;
    title: string;
    description?: string;
  }) => {},
});
