import { LinkaItem } from '@/components/LinkaItem';
import { useContexts } from '@/hooks';
import { useBookmarks } from '@/hooks/useBookmarks';
import {
  Box,
  Chip,
  Unstable_Grid2 as Grid,
  InputAdornment,
  List,
  Slide,
  TextField,
  Tooltip,
} from '@mui/material';
import { IndexSearchResult } from 'flexsearch';
import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

export const Main: React.FC = () => {
  const { loading, bookmarks, index, getTheBookmarks } = useBookmarks();

  const inputRef = useRef(null);
  const [query, setQuery] = useState('');

  const defaultSearchResults: IndexSearchResult = [];
  const [results, setResults] = useState(defaultSearchResults);

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
  }, []);

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
            <Slide direction="up" in={!loading}>
              <List sx={{ width: '100%' }}>
                {results.length > 0
                  ? results.map((val) => (
                      <LinkaItem
                        item={bookmarks[Number(val.toString())]}
                        key={bookmarks[Number(val.toString())].url + val}
                      />
                    ))
                  : bookmarks.map((val) => (
                      <LinkaItem item={val} key={val.url + val.id} />
                    ))}
              </List>
            </Slide>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Main;
