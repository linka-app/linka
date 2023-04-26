import { getBookmarks } from '@/api';
import { BookmarkItem, Res } from '@/types';
import { Index } from 'flexsearch';
import { useState } from 'react';

export const useBookmarks = () => {
  const [loading, isLoading] = useState(false);

  const defaultBookmarks: BookmarkItem[] = [];
  const [bookmarks, setBookmarks] = useState(defaultBookmarks);
  const [index, setIndex] = useState(new Index({ tokenize: 'full' }));

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

  return {
    loading,
    bookmarks,
    index,
    getTheBookmarks,
  } as const;
};

export default useBookmarks;
