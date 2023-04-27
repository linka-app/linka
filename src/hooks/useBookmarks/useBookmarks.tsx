import { getBookmarks } from '@/api/linkding';
import { useContexts } from '@/hooks/useContexts';
import { BookmarkItem, Res, queryBookmarkToShow } from '@/types';
import { Index } from 'flexsearch';
import { useState } from 'react';

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
