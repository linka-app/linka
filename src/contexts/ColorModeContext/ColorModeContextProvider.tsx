import { ContextProviderProps } from '@/types';
import { getConfig, setConfig } from '@/utils';
import React, { FC } from 'react';
import { ColorModeContext } from './ColorModeContext';

const ColorModeContextProvider: FC<ContextProviderProps> = ({ children }) => {
  const getInitialMode = () => {
    const config = getConfig();
    return config.theme !== null && config.theme === 'dark' ? 'dark' : 'light';
  };

  const [colorMode, setColorMode] = React.useState<'light' | 'dark'>(
    getInitialMode
  );

  const toggleColorMode = React.useCallback(() => {
    setColorMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      setConfig({ theme: newMode });
      return newMode;
    });
  }, []);

  return (
    <ColorModeContext.Provider value={{ toggleColorMode, colorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};

export default ColorModeContextProvider;
