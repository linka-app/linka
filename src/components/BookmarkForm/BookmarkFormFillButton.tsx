import { browserlessDoScrape } from '@/api/browserless';
import { doDescArticle } from '@/api/openai';
import { useContexts } from '@/hooks';
import { getConfig } from '@/utils/getConfig/getConfig';
import PsychologySharpIcon from '@mui/icons-material/PsychologySharp';
import { LoadingButton } from '@mui/lab';
import _ from 'lodash';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form-mui'; // instead of react-hook-form

export const BookmarkFormFillButton: React.FC = () => {
  const { watch, setValue } = useFormContext();
  const theUrl = watch('url', false);
  const { doToast, doLoading } = useContexts();
  const [loading, setLoading] = useState<boolean>(false);

  const config = getConfig();

  const doFill = () => {
    setLoading(true);
    doLoading(true);
    if (theUrl != null) {
      browserlessDoScrape({ url: theUrl }).then((res: string) => {
        if (res.length > 0) {
          doDescArticle({ message: res })
            .then((res: { title: string; desc: string; tags: string[] }) => {
              setValue('title', res.title);
              setValue('description', res.desc);
              setValue(
                'tag_names',
                res.tags.map((tag: any) => {
                  return tag.replaceAll(' ', '-').toLowerCase();
                })
              );
              setLoading(false);
              doLoading(false);
            })
            .catch((err: any) => {
              console.log(err);
              doToast({
                open: true,
                type: 'error',
                title: 'Failed',
              });
              setLoading(false);
              doLoading(false);
            });
        }
      });
    } else {
      doToast({
        open: true,
        type: 'error',
        title: 'A URL is required.',
      });
      setLoading(false);
      doLoading(false);
    }
  };

  return (
    <LoadingButton
      disabled={
        !config.browserlessToken || !config.openaiToken || _.isEmpty(theUrl)
      }
      loading={loading}
      startIcon={<PsychologySharpIcon />}
      variant="outlined"
      onClick={doFill}
      fullWidth
    >
      Fill with Chat GPT
    </LoadingButton>
  );
};

export default BookmarkFormFillButton;
