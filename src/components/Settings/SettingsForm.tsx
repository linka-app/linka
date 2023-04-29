import { browserlessDoAuth } from '@/api/browserless';
import { doAuth } from '@/api/linkding/doAuth';
import { openaiDoAuth } from '@/api/openai';
import { useContexts } from '@/hooks';
import { I18nLocals, i18n } from '@/i18n';
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
import FormPartLinkdingSettings from './FormPartLinkdingSettings';

export const SettingsForm: React.FC = () => {
  const config = getConfig();
  const translation = i18n[(config?.language as I18nLocals) || 'en'];
  const [validating, setValidating] = React.useState(false);
  const { doToast } = useContexts();

  const validateSettings = async (data: LinkaSettings) => {
    setValidating(true);

    // linkding settings
    if (data.language) {
      setConfig({
        language: _.get(data, 'language'),
        defaultBookmarkQuery: _.get(data, 'defaultBookmarkQuery'),
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
            title: translation.statusFailed,
            description: 'detail: ' + reason,
          });
        });
    } else {
      doToast({
        open: true,
        type: 'error',
        title: translation.statusFailed,
        description: 'Failed URL and Token is required.',
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
            title: translation.statusFailed,
            description: 'Browserless detail: ' + reason,
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
            title: translation.statusFailed,
            description: 'Open AI detail: ' + reason,
          });
          valid = false;
        });
    }

    if (valid) {
      doToast({ title: translation.statusSuccess });
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
          <Typography variant="h5">General Settings</Typography>
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
          <SelectElement
            name="resultViewMode"
            label="Default View Mode"
            options={[
              {
                id: 'condensed',
                label: translation.settingsViewModeCondensed,
              },
              {
                id: 'expanded',
                label: translation.settingsViewModeExpanded,
              },
            ]}
            fullWidth
          />
          <SelectElement
            name="defaultBookmarkQuery"
            label="Default Bookmarks to show"
            options={[
              {
                id: '',
                label: translation.mainBookMarksToShowMine,
              },
              {
                id: 'shared',
                label: translation.mainBookMarksToShowIncludeShared,
              },
              {
                id: 'archived',
                label: translation.mainBookMarksToShowArchived,
              },
            ]}
            fullWidth
          />
          <Typography variant="h5">Linkding Settings</Typography>
          <FormPartLinkdingSettings />
          <Typography variant="h5">Optional Settings</Typography>
          <TextFieldElement
            name="browserlessToken"
            label="Browserless.io API Key"
            helperText={
              'Browserless.io scrapes the content from provided URL before feeding it to OpenAi.'
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

export default SettingsForm;
