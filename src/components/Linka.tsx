import { LoadingButton } from '@mui/lab';
import {
  Box,
  Chip,
  Unstable_Grid2 as Grid,
  InputAdornment,
  List,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Index, IndexSearchResult } from 'flexsearch';
import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getBookmarks } from '../api';
import { ToastContext } from '../contexts/ToastContext';
import { BookmarkItem, Props, Res } from '../types';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { LinkaItem } from './LinkaItem';

function Linka(props: Props) {
  const inputRef = useRef(null);

  const defaultBookmarks: BookmarkItem[] = [];
  const [ready, setReady] = useState(false);
  const [bookmarks, setBookmarks] = useState(defaultBookmarks);
  const [index, setIndex] = useState(new Index({ tokenize: 'full' }));
  const [query, setQuery] = useState('');

  const defaultSearchResults: IndexSearchResult = [];
  const [results, setResults] = useState(defaultSearchResults);

  const { doToast } = React.useContext(ToastContext);

  const [token, setToken] = useState('');
  const [baseURL, setBaseURL] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getTheBookmarks = async () => {
    const token = localStorage.getItem('token');
    const url = localStorage.getItem('url');
    setReady(false);
    if (token != null && url != null) {
      getBookmarks({})
        .then((res: Res) => {
          setBookmarks(res.results);
          res.results.forEach((v, idx) => {
            setIndex(
              index.add(
                idx,
                [v.title, v.description, v.url, v.tag_names.join(' ')].join(' ')
              )
            );
          });

          setReady(true);
        })
        .catch((reason) => {
          console.log('reason: ', reason);
          setReady(false);
        });
    }
  };

  useEffect(() => {
    // handle hotkeys
    const pressed = new Map<string, boolean>();
    window.addEventListener('keydown', (e) => {
      pressed.set(e.key, true);
      if (!(pressed.has('Meta') || pressed.has('Control'))) {
        return;
      }
      // focus input
      if (e.key === 'l') {
        e.preventDefault();
        if (inputRef.current === null) {
          return;
        }
        (inputRef.current as HTMLInputElement).focus();
        return;
      }
    });
    window.addEventListener('keyup', (e) => {
      pressed.delete(e.key);
    });

    getTheBookmarks();
  }, [index, baseURL, token]);

  const onQueryUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);

    let positive: IndexSearchResult[] = [];
    let negative: IndexSearchResult[] = [];
    const segs = e.target.value.split(' ').filter((v) => v.length > 0);
    if (segs.length === 0) {
      setResults([]);
      return;
    }

    segs.forEach((q) => {
      if (q.startsWith('!')) {
        negative.push(index.search(q.replace('!', '')));
      } else {
        positive.push(index.search(q));
      }
    });
    let posResult = positive.reduce((prev, cur) => {
      return prev.filter((v) => cur.includes(v));
    });
    if (negative.length > 0) {
      let negaResult = negative.reduce((prev, cur) => [...prev, ...cur]);
      setResults(posResult.filter((v) => !negaResult.includes(v)));
    } else {
      setResults(posResult);
    }
  };

  const onItemUpdate = () => {
    getTheBookmarks();
  };

  const handleSetToken = () => {
    setSubmitting(true);
    localStorage.setItem('token', token);
    localStorage.setItem('url', baseURL);
    getBookmarks({})
      .then((res: Res) => {
        setBookmarks(res.results);
        res.results.forEach((v, idx) => {
          setIndex(
            index.add(
              idx,
              [v.title, v.description, v.url, v.tag_names.join(' ')].join(' ')
            )
          );
        });

        localStorage.setItem('token', token);
        localStorage.setItem('url', baseURL);
        setReady(true);
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
        setReady(false);
        setSubmitting(false);
      });
  };

  const onEnterPressed = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      results.forEach((v) => {
        window.open(bookmarks[Number(v.toString())].url);
      });
    }
  };

  return (
    <>
      {ready ? (
        // search main page
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid xs={12}>
              <TextField
                label="any text in url, title, description or tags"
                variant="outlined"
                value={query}
                onChange={onQueryUpdate}
                onKeyDown={onEnterPressed}
                inputRef={inputRef}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip
                        arrow
                        title="type `Enter` to open hits in new tabs. keywords with `!` prefix to exclude"
                      >
                        <Chip
                          label={
                            results.length > 0
                              ? `${results.length} hits`
                              : `${bookmarks.length} total`
                          }
                        />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid xs={12}>
              <List sx={{ width: '100%' }}>
                {results.length > 0
                  ? results.map((val) => (
                      <LinkaItem
                        item={bookmarks[Number(val.toString())]}
                        key={bookmarks[Number(val.toString())].url}
                        onItemUpdate={onItemUpdate}
                      />
                    ))
                  : bookmarks.map((val) => (
                      <LinkaItem
                        item={val}
                        key={val.url}
                        onItemUpdate={onItemUpdate}
                      />
                    ))}
              </List>
            </Grid>
          </Grid>
        </Box>
      ) : (
        // setup setting page
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
      )}
      <Stack
        mb={2}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <ColorModeSwitcher />
      </Stack>
    </>
  );
}

export default Linka;
