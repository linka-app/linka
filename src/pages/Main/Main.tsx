import LinkaItemSkeleton from "@/components/LinkaItem/LinkaItemSkeleton";
import { SearchMenu } from "@/components/SearchMenu";
import { useContexts } from "@/hooks";
import { ALL_BOOKMARKS } from "@/hooks/useBookmarks/useBookmarks";
import { i18n, I18nLocals } from "@/i18n";
import { getConfig } from "@/utils";
import {
  Box,
  Chip,
  InputAdornment,
  List,
  Stack,
  Tooltip,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { IndexSearchResult } from "flexsearch";
import _ from "lodash";
import React, {
  KeyboardEvent,
  lazy,
  Suspense,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  FormContainer,
  TextFieldElement,
  useFormContext,
} from "react-hook-form-mui";

const LinkaItem = lazy(() => import("@/components/LinkaItem/LinkaItem"));

const InnerComponent: React.FC = () => {
  // put into the component to hot reload configs, e.g. set `showBookmarkAvatar`
  const { config, getDrawerState, theBookmarks } = useContexts();

  const { showBookmarkAvatar } = config;
  const translation = i18n[(config?.language as I18nLocals) || "en"];
  const { loadingBookmarks, bookmarks, bookmarksIndex, getTheBookmarks } =
    theBookmarks();

  const inputRef = useRef(null);
  const [query, setQuery] = useState("");

  const defaultSearchResults: IndexSearchResult = [];
  const [results, setResults] = useState(defaultSearchResults);

  const sortAndSetResults = (results: IndexSearchResult) => {
    setResults(results);
  };

  const initialState = { count: -1 };

  function reducer(
    state: { count: number },
    action: { action: string; bookmarks?: any; results?: any }
  ) {
    let count: number;
    switch (action.action) {
      case "increment":
        count = state.count + 1 <= results.length - 1 ? state.count + 1 : 0;
        return { count };
      case "decrement":
        count = state.count - 1 >= 0 ? state.count - 1 : results.length - 1;
        return { count };
      case "open":
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
      case "reset":
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

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "search") {
        debouncedResults(value.search);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const defaultBookmarkQuery = watch("defaultBookmarkQuery", "");

  useEffect(() => {
    bookmarkDispatch({ action: "reset" });
    setQuery("");

    let positive: IndexSearchResult[] = [];
    positive.push(allSearchResult);
    let posResult = positive.reduce((prev, cur) => {
      return prev.filter((v) => cur.includes(v));
    });
    sortAndSetResults(posResult);
  }, [bookmarksIndex]);

  useEffect(() => {
    getTheBookmarks(defaultBookmarkQuery);
  }, [defaultBookmarkQuery]);

  useEffect(() => {
    // handle hotkeys
    const pressed = new Map<string, boolean>();

    const handleKeydown = (e: any) => {
      pressed.set(e.key, true);
      if (!(pressed.has("Meta") || pressed.has("Control"))) {
        return;
      }
      // focus input
      if (e.key === "l") {
        e.preventDefault();
        if (inputRef.current === null) {
          return;
        }
        (inputRef.current as HTMLInputElement).focus();
        return;
      }

      // Select the bookmark to open
      if (e.key === "ArrowDown") {
        e.preventDefault();
        bookmarkDispatch({
          action: "increment",
          bookmarks: bookmarks,
          results: results,
        });
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        bookmarkDispatch({
          action: "decrement",
          bookmarks: bookmarks,
          results: results,
        });
      }

      if (e.key === "Enter") {
        e.preventDefault();
        bookmarkDispatch({
          action: "open",
          bookmarks: bookmarks,
          results: results,
        });
      }
    };

    const handleKeyup = (e: any) => {
      pressed.delete(e.key);
    };

    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("keyup", handleKeyup);
    return () => {
      window.removeEventListener("keyup", handleKeyup);
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [bookmarks, results]);

  const allSearchResult = bookmarksIndex.search(ALL_BOOKMARKS, 10000);

  const onQueryUpdate = (inputVal: string) => {
    // avoid opening all bookmarks unexpectedly
    if (inputVal.trim().length === 0) {
      setQuery("");
    } else {
      setQuery(inputVal);
    }
    bookmarkDispatch({ action: "reset" });

    let positive: IndexSearchResult[] = [];
    let negative: IndexSearchResult[] = [];
    const segs = inputVal.split(" ").filter((v) => v.length > 0);
    if (inputVal.length === 0) {
      sortAndSetResults(allSearchResult);
      return;
    }

    let fullQueryPositive: string[] = [];
    let fullQueryNegative: string[] = [];

    segs.forEach((q) => {
      if (q.startsWith("!")) {
        fullQueryNegative.push(q.replace("!", "").trim());
      } else {
        fullQueryPositive.push(q.trim());
      }
    });

    if (fullQueryPositive.length > 0) {
      positive.push(bookmarksIndex.search(fullQueryPositive.join(" "), 10000));
    }

    if (fullQueryNegative.length > 0) {
      negative.push(bookmarksIndex.search(fullQueryNegative.join(" "), 10000));
    }

    let posResult: IndexSearchResult = [];
    let negaResult: IndexSearchResult = [];
    if (positive.length > 0) {
      posResult = positive.reduce((prev, cur) => [...prev, ...cur]);
    }

    if (negative.length > 0) {
      negaResult = negative.reduce((prev, cur) => [...prev, ...cur]);
      sortAndSetResults(
        (posResult.length > 0 ? posResult : allSearchResult).filter(
          (v) => !negaResult.includes(v)
        )
      );
    } else {
      sortAndSetResults(posResult);
    }
  };

  const debouncedResults = React.useMemo(() => {
    return _.debounce(onQueryUpdate, 300);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  const onEnterPressed = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !getDrawerState()) {
      // avoid opening all bookmarks unexpectedly
      if (selectedBookmark.count === -1 && query !== "") {
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
            <Stack direction={"row"} spacing={1}>
              <TextFieldElement
                autoComplete="off"
                name={"search"}
                label={translation.mainSearch}
                variant="outlined"
                onKeyDown={onEnterPressed}
                fullWidth
                inputRef={inputRef}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip arrow title={translation.mainSearchAdornment}>
                        <Chip
                          label={
                            results.length > 0 && query !== ""
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
            {loadingBookmarks && (
              <List sx={{ width: "100%" }}>
                <LinkaItemSkeleton />
                <LinkaItemSkeleton />
                <LinkaItemSkeleton />
                <LinkaItemSkeleton />
                <LinkaItemSkeleton />
                <LinkaItemSkeleton />
              </List>
            )}
            <List sx={{ width: "100%" }}>
              {!loadingBookmarks &&
                results.length > 0 &&
                results.map((val, bookmarksIndex) => (
                  <Suspense
                    fallback={<LinkaItemSkeleton />}
                    key={bookmarksIndex + "Suspense"}
                  >
                    <LinkaItem
                      item={bookmarks[Number(val.toString())]}
                      selected={bookmarksIndex === selectedBookmark.count}
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
