import { createContext } from 'react';
import { DrawerContextType } from './DrawerContextProps';

export const DrawerContext = createContext<DrawerContextType | null>(null);
export default DrawerContext;
