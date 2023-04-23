import PsychologySharpIcon from '@mui/icons-material/PsychologySharp';
import { LoadingButton } from '@mui/lab';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form-mui'; // instead of react-hook-form
import { browserlessDoScrape } from '../api/browserless';
import { doDescArticle } from '../api/openai';

export const BookmarkFormFillButton: React.FC = () => {
  const { watch, setValue, getValues } = useFormContext();
  const theUrl = watch('url', false);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {}, []);

  const doFill = () => {
    setLoading(true);
    if (theUrl != null) {
      console.log(theUrl);
      browserlessDoScrape({ url: theUrl }).then((res: string) => {
        if (res.length > 0) {
          doDescArticle({ message: res }).then(
            (res: { title: string; desc: string; tags: string[] }) => {
              console.log(res);
              setValue('title', res.title);
              setValue('description', res.desc);
              setValue(
                'tag_names',
                res.tags.map((tag: any) => {
                  return tag.replaceAll(' ', '-').toLowerCase();
                })
              );
              setLoading(false);
            }
          );
        }
      });
    } else {
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
