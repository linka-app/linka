import { createContext } from 'react';
import { LinearProgressContextType } from './LinearProgressProps';

export const LinearProgressContext =
  createContext<LinearProgressContextType | null>(null);
export default LinearProgressContext;
