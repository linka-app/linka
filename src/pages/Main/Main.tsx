import LinkaItemSkeleton from '@/components/LinkaItem/LinkaItemSkeleton';
import { SearchMenu } from '@/components/SearchMenu';
import { useContexts } from '@/hooks';
import { useBookmarks } from '@/hooks/useBookmarks';
import { ALL_BOOKMARKS } from '@/hooks/useBookmarks/useBookmarks';
import { I18nLocals, i18n } from '@/i18n';
import { getConfig } from '@/utils';
import {
  Box,
  Chip,
  Unstable_Grid2 as Grid,
  InputAdornment,
  List,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { IndexSearchResult } from 'flexsearch';
import _ from 'lodash';
import React, {
  ChangeEvent,
  KeyboardEvent,
  Suspense,
  lazy,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { FormContainer, useFormContext } from 'react-hook-form-mui';

const LinkaItem = lazy(() => import('@/components/LinkaItem/LinkaItem'));

const InnerComponent: React.FC = () => {
  // put into the component to hot reload configs, e.g. set `showBookmarkAvatar`
  // TODO: put it into context and share with provider
  const config = getConfig();

  const { showBookmarkAvatar } = config;
  const translation = i18n[(config?.language as I18nLocals) || 'en'];
  const { loading, bookmarks, index, getTheBookmarks } = useBookmarks();
  const { getDrawerState } = useContexts();

  const inputRef = useRef(null);
  const [query, setQuery] = useState('');

  const defaultSearchResults: IndexSearchResult = [];
  const [results, setResults] = useState(defaultSearchResults);

  const initialState = { count: -1 };
  function reducer(
    state: { count: number },
    action: { action: string; bookmarks?: any; results?: any }
  ) {
    let count: number;
    switch (action.action) {
      case 'increment':
        count = state.count + 1 <= results.length - 1 ? state.count + 1 : 0;
        return { count };
      case 'decrement':
        count = state.count - 1 >= 0 ? state.count - 1 : results.length - 1;
        return { count };
      case 'open':
        if (
          state.count > -1 &&
          _.get(
            action,
            `bookmarks.${Number(action.results[state.count])}.url`,
            null
          )
        ) {
          window.open(
            action.bookmarks[Number(action.results[state.count])].url
          );
        } else if (_.get(action, `bookmarks.${state.count}.url`, null)) {
          window.open(action.bookmarks[state.count].url);
        }
        return { count: state.count };
      case 'reset':
        return { count: -1 };
      default:
        throw new Error();
    }
  }

  const [selectedBookmark, bookmarkDispatch] = useReducer(
    reducer,
    initialState
  );

  const { watch } = useFormContext();
  const defaultBookmarkQuery = watch('defaultBookmarkQuery', '');

  useEffect(() => {
    bookmarkDispatch({ action: 'reset' });
    setQuery('');

    let positive: IndexSearchResult[] = [];
    positive.push(index.search(ALL_BOOKMARKS, 10000));
    let posResult = positive.reduce((prev, cur) => {
      return prev.filter((v) => cur.includes(v));
    });
    setResults(posResult);
  }, [index]);

  useEffect(() => {
    getTheBookmarks(defaultBookmarkQuery);
  }, [defaultBookmarkQuery]);

  useEffect(() => {
    // handle hotkeys
    const pressed = new Map<string, boolean>();

    const handleKeydown = (e) => {
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

      // Select the bookmark to open
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        bookmarkDispatch({
          action: 'increment',
          bookmarks: bookmarks,
          results: results,
        });
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        bookmarkDispatch({
          action: 'decrement',
          bookmarks: bookmarks,
          results: results,
        });
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        bookmarkDispatch({
          action: 'open',
          bookmarks: bookmarks,
          results: results,
        });
      }
    };

    const handleKeyup = (e) => {
      pressed.delete(e.key);
    };

    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('keyup', handleKeyup);
    return () => {
      window.removeEventListener('keyup', handleKeyup);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [bookmarks, results]);

  const onQueryUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    bookmarkDispatch({ action: 'reset' });

    let positive: IndexSearchResult[] = [];
    let negative: IndexSearchResult[] = [];
    const segs = e.target.value.split(' ').filter((v) => v.length > 0);
    if (segs.length === 0) {
      positive.push(index.search(ALL_BOOKMARKS, 10000));
      let posResult = positive.reduce((prev, cur) => {
        return prev.filter((v) => cur.includes(v));
      });
      setResults(posResult);
      return;
    }

    segs.forEach((q) => {
      if (q.startsWith('!')) {
        negative.push(index.search(q.replace('!', ''), 10000));
      } else {
        positive.push(index.search(q, 10000));
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
    if (e.key === 'Enter' && !getDrawerState()) {
      if (selectedBookmark.count === -1) {
        results.forEach((v) => {
          window.open(bookmarks[Number(v.toString())].url);
        });
      }
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <Stack direction={'row'} spacing={1}>
              <TextField
                autoComplete="off"
                label={translation.mainSearch}
                variant="outlined"
                value={query}
                onChange={onQueryUpdate}
                onKeyDown={onEnterPressed}
                inputRef={inputRef}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip arrow title={translation.mainSearchAdornment}>
                        <Chip
                          label={
                            results.length > 0
                              ? `${results.length} ${translation.mainSearchAdornmentHits}`
                              : `${bookmarks.length} ${translation.mainSearchAdornmentTotal}`
                          }
                        />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
              <SearchMenu />
            </Stack>
          </Grid>
          <Grid xs={12}>
            {loading && (
              <List sx={{ width: '100%' }}>
                <LinkaItemSkeleton />
                <LinkaItemSkeleton />
                <LinkaItemSkeleton />
                <LinkaItemSkeleton />
                <LinkaItemSkeleton />
                <LinkaItemSkeleton />
              </List>
            )}
            <List sx={{ width: '100%' }}>
              {!loading &&
                results.length > 0 &&
                results.map((val, index) => (
                  <Suspense
                    fallback={<LinkaItemSkeleton />}
                    key={index + 'Suspense'}
                  >
                    <LinkaItem
                      item={bookmarks[Number(val.toString())]}
                      selected={index === selectedBookmark.count}
                      showLeftAvatar={showBookmarkAvatar}
                    />
                  </Suspense>
                ))}
            </List>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export const Main: React.FC = () => {
  const config = getConfig();

  return (
    <>
      <FormContainer defaultValues={config}>
        <InnerComponent />
      </FormContainer>
    </>
  );
};

export default Main;
