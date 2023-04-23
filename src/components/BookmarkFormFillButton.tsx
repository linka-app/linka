import PsychologySharpIcon from '@mui/icons-material/PsychologySharp';
import { LoadingButton } from '@mui/lab';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form-mui'; // instead of react-hook-form
import { browserlessDoScrape } from '../api/browserless';
import { doDescArticle } from '../api/openai';
import { ToastContext } from '../contexts/ToastContext';

export const BookmarkFormFillButton: React.FC = () => {
  const { watch, setValue } = useFormContext();
  const theUrl = watch('url', false);
  const { doToast } = React.useContext(ToastContext);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {}, []);

  const doFill = () => {
    setLoading(true);
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
            })
            .catch((err: any) => {
              console.log(err);
              doToast({
                open: true,
                type: 'error',
                title: 'Failed',
              });
              setLoading(false);
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
    }
  };

  return (
    <LoadingButton
      sx={{ width: '25%' }}
      loading={loading}
      startIcon={<PsychologySharpIcon />}
      variant="contained"
      onClick={doFill}
    >
      Fill with GPT
    </LoadingButton>
  );
};
