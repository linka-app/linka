import { browserlessDoAuth } from '@/api/browserless';
import { doAuth } from '@/api/doAuth';
import { openaiDoAuth } from '@/api/openai';
import { ToastContext } from '@/contexts/ToastContext';
import { LinkaSettings } from '@/types';
import { getConfig, setConfig } from '@/utils';
import { Box, Button, Stack, Typography } from '@mui/material';
import _ from 'lodash';
import * as React from 'react';
import {
  FormContainer,
  SelectElement,
  TextFieldElement,
} from 'react-hook-form-mui';

export const LinkdingSettingsForm: React.FC = () => {
  const config = getConfig();
  const [validating, setValidating] = React.useState(false);
  const { doToast } = React.useContext(ToastContext);

  const validateSettings = async (data: LinkaSettings) => {
    setValidating(true);

    // linkding settings
    if (data.language) {
      setConfig({
        language: _.get(data, 'language'),
      });
    }
    if (data.token && data.url) {
      await doAuth({ token: data.token, url: data.url })
        .then((res) => {
          setConfig({ token: _.get(data, 'token'), url: _.get(data, 'url') });
        })
        .catch((reason) => {
          doToast({
            open: true,
            type: 'error',
            title: 'Failed to load bookmarks.',
            description: 'detail: ' + reason,
          });
        });
    } else {
      doToast({
        open: true,
        type: 'error',
        title: 'Failed URL and Token is required.',
      });
      setValidating(false);
      return false;
    }

    // optional settings
    let valid = true;
    if (data.browserlessToken) {
      await browserlessDoAuth({ token: data.browserlessToken })
        .then((res) => {
          setConfig({ browserlessToken: _.get(data, 'browserlessToken') });
        })
        .catch((reason) => {
          doToast({
            open: true,
            type: 'error',
            title: 'Failed to autheticate Browserless.',
            description: 'detail: ' + reason,
          });
          valid = false;
        });
    }

    if (data.openaiToken) {
      await openaiDoAuth({ token: data.openaiToken })
        .then((res) => {
          setConfig({ openaiToken: _.get(data, 'openaiToken') });
        })
        .catch((reason) => {
          doToast({
            open: true,
            type: 'error',
            title: 'Failed to autheticate Open AI.',
            description: 'detail: ' + reason,
          });
          valid = false;
        });
    }

    if (valid) {
      doToast({ title: 'Update success!' });
    }
    setValidating(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <FormContainer defaultValues={config} onSuccess={validateSettings}>
        <Stack spacing={2}>
          <SelectElement
            name="language"
            label="Language"
            options={[
              {
                id: 'en',
                label: 'English',
              },
              {
                id: 'zh_CN',
                label: 'Chinese',
              },
            ]}
            fullWidth
          />
          <Typography variant="h5">Linkding Settings</Typography>
          <TextFieldElement
            name="url"
            label="linkding site base url"
            fullWidth
            required
          />
          <TextFieldElement name="token" label="Token" fullWidth required />
          <Typography variant="h5">Optional Settings</Typography>
          <TextFieldElement
            name="browserlessToken"
            label="Browserless.io API Key"
            helperText={
              'Browserless.io scrapes then content from provided URL before feeding it to OpenAi.'
            }
            fullWidth
          />
          <TextFieldElement
            name="openaiToken"
            label="Open AI API Key"
            helperText={'OpenAI token for AI integration.'}
            fullWidth
          />
          <Button
            disabled={validating}
            fullWidth
            type="submit"
            variant="contained"
          >
            Update
          </Button>
        </Stack>
      </FormContainer>
    </Box>
  );
};

export default LinkdingSettingsForm;
