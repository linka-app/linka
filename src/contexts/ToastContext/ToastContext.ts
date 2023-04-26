import { createContext } from 'react';
import { ToastContextType } from './ToastContextProps';

export const ToastContext = createContext<ToastContextType | null>(null);
export default ToastContext;
