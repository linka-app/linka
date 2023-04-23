export interface BookmarkItem {
  title: string;
  id?: number;
  url: string;
  description?: string;
  website_title?: string;
  website_description?: string;
  is_archived?: boolean;
  unread?: boolean;
  shared?: boolean;
  tag_names: string[];
  date_added?: string;
  date_modified?: string;
}

export interface TagItem {
  id: number;
  name: string;
  date_added: string;
}

export interface Tags {
  results: TagItem[];
}

export interface Res {
  results: BookmarkItem[];
}

export interface Props {
  version: string;
}

export type queryBookmarkArgs = {
  q?: string;
  limit?: number;
  offset?: number;
};

export type doArgs = {
  id: number;
};

export type bookmarkArgs = {
  id: number;
  payload: BookmarkItem;
};

export interface LinkaSettings {
  token: string | null;
  url: string | null;
  openaiToken?: string | null;
  browserlessToken?: string | null;
}
