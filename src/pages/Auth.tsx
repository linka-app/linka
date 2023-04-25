import { doAuth } from '@/api';
import { ToastContext } from '@/contexts/ToastContext';
import { LoadingButton } from '@mui/lab';
import { Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

export const Auth: React.FC<{ setReady: (e: any) => void }> = (props) => {
  const { doToast } = React.useContext(ToastContext);

  const [token, setToken] = useState('');
  const [baseURL, setBaseURL] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSetToken = () => {
    setSubmitting(true);

    doAuth({ token: token, url: baseURL })
      .then((res) => {
        localStorage.setItem('token', token);
        localStorage.setItem('url', baseURL);
        props.setReady(true);
        setSubmitting(false);
      })
      .catch((reason) => {
        localStorage.removeItem('token');
        localStorage.removeItem('url');
        console.log(reason);
        doToast({
          open: true,
          type: 'error',
          title: 'Failed to load bookmarks.',
          description: 'detail: ' + reason,
        });
        props.setReady(false);
        setSubmitting(false);
      });
  };

  return (
    <>
      <Stack mt={5} spacing={2}>
        <Typography variant="h2" pl={1}>
          Linka!
        </Typography>
        <TextField
          label="linkding site base url"
          value={baseURL}
          variant="outlined"
          fullWidth
          onChange={(e) => {
            setBaseURL(e.target.value);
          }}
          autoFocus
        />
        <TextField
          label="Token"
          value={token}
          variant="outlined"
          fullWidth
          onChange={(e) => {
            setToken(e.target.value);
          }}
          autoFocus
        />
        <LoadingButton
          loading={submitting}
          variant="contained"
          onClick={handleSetToken}
        >
          Go!
        </LoadingButton>
      </Stack>
    </>
  );
};

export default Auth;
