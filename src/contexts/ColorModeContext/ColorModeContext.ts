import { createContext } from 'react';
import { ColorModeContextType } from './ColorModeContextProps';

export const ColorModeContext = createContext<ColorModeContextType | null>(
  null
);
export default ColorModeContext;
