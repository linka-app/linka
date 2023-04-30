import { createContext } from 'react';
import { LinkaContextType } from './LinkaContextProps';

export const LinkaContext = createContext<LinkaContextType | null>(null);
export default LinkaContext;
