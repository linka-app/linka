import { LinkaItem } from '@/components/LinkaItem/LinkaItem';
import { useBookmarks } from '@/hooks/useBookmarks';
import { I18nLocals, i18n } from '@/i18n';
import { getConfig } from '@/utils';
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
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  FormContainer,
  ToggleButtonGroupElement,
  useFormContext,
} from 'react-hook-form-mui';

const InnerComponent: React.FC = () => {
  const config = getConfig();
  const translation = i18n[(config?.language as I18nLocals) || 'en'];
  const { loading, bookmarks, index, getTheBookmarks } = useBookmarks();

  const inputRef = useRef(null);
  const [query, setQuery] = useState('');

  const defaultSearchResults: IndexSearchResult = [];
  const [results, setResults] = useState(defaultSearchResults);

  const initialState = { count: -1 };
  function reducer(
    state: { count: number },
    action: { action: string; bookmarks?: any; results?: any }
  ) {
    switch (action.action) {
      case 'increment':
        return {
          count:
            state.count <= action.bookmarks.length - 1
              ? state.count + 1
              : bookmarks.length,
        };
      case 'decrement':
        return { count: state.count >= -1 ? state.count - 1 : -1 };
      case 'open':
        if (action.results.length > 0) {
          window.open(
            action.bookmarks[Number(action.results[state.count])].url
          );
        } else {
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
  const bookmarksToShow = watch('bookmarksToShow', false);

  useEffect(() => {
    getTheBookmarks(bookmarksToShow);
  }, [bookmarksToShow]);

  useEffect(() => {
    getTheBookmarks();
  }, []);

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
    bookmarkDispatch({ action: 'reset' });
  };

  const onEnterPressed = (e: KeyboardEvent<HTMLInputElement>) => {
    // if (e.key === 'Enter') {
    //   if (selectedBookmark.count <= 0) {
    //     window.open(bookmarks[selectedBookmark.count].url);
    //   } else {
    //     results.forEach((v) => {
    //       window.open(bookmarks[Number(v.toString())].url);
    //     });
    //   }
    // }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid
            xs={12}
            sx={{
              '.MuiFormControl-root': {
                width: '100%',
              },
            }}
          >
            <ToggleButtonGroupElement
              exclusive
              fullWidth
              enforceAtLeastOneSelected
              size="small"
              sx={{ width: '100%' }}
              name="bookmarksToShow"
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
            />
          </Grid>
          <Grid xs={12}>
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
          </Grid>
          <Grid xs={12}>
            <Slide direction="up" in={!loading}>
              <List sx={{ width: '100%' }}>
                {results.length > 0
                  ? results.map((val, index) => (
                      <LinkaItem
                        item={bookmarks[Number(val.toString())]}
                        key={bookmarks[Number(val.toString())].url + val}
                        selected={index === selectedBookmark.count}
                      />
                    ))
                  : bookmarks.map((val, index) => (
                      <LinkaItem
                        item={val}
                        key={val.url + val.id}
                        selected={index === selectedBookmark.count}
                      />
                    ))}
              </List>
            </Slide>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export const Main: React.FC = () => {
  return (
    <>
      <FormContainer defaultValues={{ bookmarksToShow: '' }}>
        <InnerComponent />
      </FormContainer>
    </>
  );
};

export default Main;
