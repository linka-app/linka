import { getBookmarks } from '@/api/linkding';
import { BookmarkItem, QueryBookmarkMode, Res } from '@/types';
import Index from 'flexsearch';
import { useState } from 'react';

// add a constant suffix to each bookmark's full text
// to be able to search ALL bookmarks with single keyword
export const ALL_BOOKMARKS = 'ALL_BOOKMARKS';

export const useBookmarks = () => {
  const [loadingBookmarks, isLoadingBookmarks] = useState(false);

  const defaultBookmarks: BookmarkItem[] = [];
  const [bookmarks, setBookmarks] = useState(defaultBookmarks);
  const [bookmarksIndex, setBookmarksIndex] = useState(
    new Index({ tokenize: 'full' })
  );
  const getTheBookmarks = async (bookmarksToShow: QueryBookmarkMode = '') => {
    isLoadingBookmarks(true);
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

        setBookmarksIndex(searchIndex);

        isLoadingBookmarks(false);
      })
      .catch((reason) => {
        console.log('reason: ', reason);
        isLoadingBookmarks(false);
      });
  };

  return {
    loadingBookmarks,
    bookmarks,
    bookmarksIndex,
    getTheBookmarks,
  } as const;
};

export default useBookmarks;
