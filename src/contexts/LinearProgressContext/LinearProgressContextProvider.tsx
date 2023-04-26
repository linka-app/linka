import { ContextProviderProps } from '@/types';
import { Box, LinearProgress } from '@mui/material';
import { FC, useState } from 'react';
import { LinearProgressContext } from './LinearProgressContext';

const LinearProgressContextProvider: FC<ContextProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<boolean>(false);

  const doLoading = (state: boolean) => {
    setState(state);
  };

  const doLoadingToggle = () => {
    setState(!state);
  };

  return (
    <LinearProgressContext.Provider value={{ doLoading, doLoadingToggle }}>
      <Box
        sx={{
          width: '100%',
          zIndex: (theme) => theme.zIndex.drawer + 2,
          position: 'absolute',
          top: 0,
        }}
      >
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </Box>
      {children}
    </LinearProgressContext.Provider>
  );
};

export default LinearProgressContextProvider;
