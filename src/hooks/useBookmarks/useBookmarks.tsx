import { getBookmarks } from '@/api/linkding';
import { useContexts } from '@/hooks/useContexts';
// FIXME
import { BookmarkItem, Res, queryBookmarkToShow } from '@/types';
import { Index } from 'flexsearch';
import { useState } from 'react';

// add a constant suffix to each bookmark's full text
// to be able search ALL bookmarks with single keyword
export const ALL_BOOKMARKS = 'ALL_BOOKMARKS';

export const useBookmarks = () => {
  const [loading, isLoading] = useState(false);
  const { doLoading } = useContexts();

  const defaultBookmarks: BookmarkItem[] = [];
  const [bookmarks, setBookmarks] = useState(defaultBookmarks);
  const [index, setIndex] = useState(new Index({ tokenize: 'full' }));

  const getTheBookmarks = async (bookmarksToShow: queryBookmarkToShow = '') => {
    isLoading(true);
    doLoading(true);
    setBookmarks(defaultBookmarks);
    getBookmarks({}, bookmarksToShow ? bookmarksToShow : '')
      .then((res: Res) => {
        setBookmarks(res.results);
        const searchIndex = new Index({ tokenize: 'full' });
        res.results.forEach((v, idx) => {
          searchIndex.add(
            idx,
            [
              v.title,
              v.description,
              v.website_title,
              v.website_description,
              v.url,
              v.tag_names.join(' '),
              ALL_BOOKMARKS,
            ].join(' ')
          );
        });

        setIndex(searchIndex);

        isLoading(false);
        doLoading(false);
      })
      .catch((reason) => {
        console.log('reason: ', reason);
        isLoading(false);
        doLoading(false);
      });
  };

  return {
    loading,
    bookmarks,
    index,
    getTheBookmarks,
  } as const;
};

export default useBookmarks;
