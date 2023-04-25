import {
  Box,
  Chip,
  Unstable_Grid2 as Grid,
  InputAdornment,
  LinearProgress,
  List,
  TextField,
  Tooltip,
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
import { LinkaItem } from '../components/LinkaItem';
import { BookmarkItem, Res } from '../types';

export const Main: React.FC<{}> = (props) => {
  const inputRef = useRef(null);

  const defaultBookmarks: BookmarkItem[] = [];
  const [bookmarks, setBookmarks] = useState(defaultBookmarks);
  const [index, setIndex] = useState(new Index({ tokenize: 'full' }));
  const [query, setQuery] = useState('');

  const [loading, isLoading] = useState(false);

  const defaultSearchResults: IndexSearchResult = [];
  const [results, setResults] = useState(defaultSearchResults);

  const getTheBookmarks = async () => {
    isLoading(true);
    getBookmarks({})
      .then((res: Res) => {
        setBookmarks(res.results);
        res.results.forEach((v, idx) => {
          setIndex(
            index.add(
              idx,
              [
                v.title,
                v.description,
                v.website_title,
                v.website_description,
                v.url,
                v.tag_names.join(' '),
              ].join(' ')
            )
          );
        });

        isLoading(false);
      })
      .catch((reason) => {
        console.log('reason: ', reason);
        isLoading(false);
      });
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
  }, [index]);

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

  const onEnterPressed = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      results.forEach((v) => {
        window.open(bookmarks[Number(v.toString())].url);
      });
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <TextField
              label="Search"
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
            {loading && (
              <Box sx={{ width: '100%' }}>
                <LinearProgress />
              </Box>
            )}
            <List sx={{ width: '100%' }}>
              {results.length > 0
                ? results.map((val) => (
                    <LinkaItem
                      item={bookmarks[Number(val.toString())]}
                      key={bookmarks[Number(val.toString())].url + val}
                      onItemUpdate={onItemUpdate}
                    />
                  ))
                : bookmarks.map((val) => (
                    <LinkaItem
                      item={val}
                      key={val.url + val.id}
                      onItemUpdate={onItemUpdate}
                    />
                  ))}
            </List>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Main;
