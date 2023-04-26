import { CircularProgress } from '@mui/material';
import { ReactElement } from 'react';

export const LoadingIcon: React.FC<{
  loading: boolean;
  icon: ReactElement;
}> = (props) => {
  return <>{!props.loading ? props.icon : <CircularProgress size={24} />}</>;
};

export default LoadingIcon;
