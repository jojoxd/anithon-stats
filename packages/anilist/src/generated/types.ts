/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: userLists
// ====================================================

export interface userLists_MediaListCollection_user {
  __typename: "User";
  /**
   * The id of the user
   */
  id: number;
}

export interface userLists_MediaListCollection_lists_entries_startedAt {
  __typename: "FuzzyDate";
  /**
   * Numeric Year (2017)
   */
  year: number | null;
  /**
   * Numeric Month (3)
   */
  month: number | null;
  /**
   * Numeric Day (24)
   */
  day: number | null;
}

export interface userLists_MediaListCollection_lists_entries_completedAt {
  __typename: "FuzzyDate";
  /**
   * Numeric Year (2017)
   */
  year: number | null;
  /**
   * Numeric Month (3)
   */
  month: number | null;
  /**
   * Numeric Day (24)
   */
  day: number | null;
}

export interface userLists_MediaListCollection_lists_entries_media_coverImage {
  __typename: "MediaCoverImage";
  /**
   * The cover image url of the media at a large size
   */
  large: string | null;
}

export interface userLists_MediaListCollection_lists_entries_media_startDate {
  __typename: "FuzzyDate";
  /**
   * Numeric Year (2017)
   */
  year: number | null;
  /**
   * Numeric Month (3)
   */
  month: number | null;
  /**
   * Numeric Day (24)
   */
  day: number | null;
}

export interface userLists_MediaListCollection_lists_entries_media_endDate {
  __typename: "FuzzyDate";
  /**
   * Numeric Year (2017)
   */
  year: number | null;
  /**
   * Numeric Month (3)
   */
  month: number | null;
  /**
   * Numeric Day (24)
   */
  day: number | null;
}

export interface userLists_MediaListCollection_lists_entries_media_title {
  __typename: "MediaTitle";
  /**
   * The romanization of the native language title
   */
  romaji: string | null;
  /**
   * The official english title
   */
  english: string | null;
  /**
   * Official title in it's native language
   */
  native: string | null;
}

export interface userLists_MediaListCollection_lists_entries_media {
  __typename: "Media";
  /**
   * The current releasing status of the media
   */
  status: MediaStatus | null;
  /**
   * The format the media was released in
   */
  format: MediaFormat | null;
  /**
   * The amount of episodes the anime has when complete
   */
  episodes: number | null;
  /**
   * The cover images of the media
   */
  coverImage: userLists_MediaListCollection_lists_entries_media_coverImage | null;
  /**
   * The first official release date of the media
   */
  startDate: userLists_MediaListCollection_lists_entries_media_startDate | null;
  /**
   * The last official release date of the media
   */
  endDate: userLists_MediaListCollection_lists_entries_media_endDate | null;
  /**
   * The official titles of the media in various languages
   */
  title: userLists_MediaListCollection_lists_entries_media_title | null;

  duration: number | null;
  id: number | null;
  relations: { edges?: (userLists_MediaListCollection_lists_entries_media_edge | null)[] } | null;
}

export interface userLists_MediaListCollection_lists_entries_media_edge {
  relationType: "SEQUEL" | null;

  node: userLists_MediaListCollection_lists_entries_media_edge_node | null;
}

export interface userLists_MediaListCollection_lists_entries_media_edge_node {
  id: number | null;
}

export interface userLists_MediaListCollection_lists_entries {
  __typename: "MediaList";
  /**
   * The id of the list entry
   */
  id: number;
  /**
   * The watching/reading status
   */
  status: MediaListStatus | null;
  /**
   * Text notes
   */
  notes: string | null;
  /**
   * The amount of episodes/chapters consumed by the user
   */
  progress: number | null;
  /**
   * When the entry was started by the user
   */
  startedAt: userLists_MediaListCollection_lists_entries_startedAt | null;
  /**
   * When the entry was completed by the user
   */
  completedAt: userLists_MediaListCollection_lists_entries_completedAt | null;
  media: userLists_MediaListCollection_lists_entries_media | null;
}

export interface userLists_MediaListCollection_lists {
  __typename: "MediaListGroup";
  name: string | null;
  /**
   * Media list entries
   */
  entries: (userLists_MediaListCollection_lists_entries | null)[] | null;
}

export interface userLists_MediaListCollection {
  __typename: "MediaListCollection";
  /**
   * The owner of the list
   */
  user: userLists_MediaListCollection_user | null;
  /**
   * Grouped media list entries
   */
  lists: (userLists_MediaListCollection_lists | null)[] | null;
}

export interface userLists {
  /**
   * Media list collection query, provides list pre-grouped by status & custom
   * lists. User ID and Media Type arguments required.
   */
  MediaListCollection: userLists_MediaListCollection | null;
}

export interface userListsVariables {
  username: string;
  type: MediaType;
  statuses: MediaListStatus[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * The format the media was released in
 */
export enum MediaFormat {
  MANGA = "MANGA",
  MOVIE = "MOVIE",
  MUSIC = "MUSIC",
  NOVEL = "NOVEL",
  ONA = "ONA",
  ONE_SHOT = "ONE_SHOT",
  OVA = "OVA",
  SPECIAL = "SPECIAL",
  TV = "TV",
  TV_SHORT = "TV_SHORT",
}

/**
 * Media list watching/reading status enum.
 */
export enum MediaListStatus {
  COMPLETED = "COMPLETED",
  CURRENT = "CURRENT",
  DROPPED = "DROPPED",
  PAUSED = "PAUSED",
  PLANNING = "PLANNING",
  REPEATING = "REPEATING",
}

/**
 * The current releasing status of the media
 */
export enum MediaStatus {
  CANCELLED = "CANCELLED",
  FINISHED = "FINISHED",
  NOT_YET_RELEASED = "NOT_YET_RELEASED",
  RELEASING = "RELEASING",
}

/**
 * Media type enum, anime or manga.
 */
export enum MediaType {
  ANIME = "ANIME",
  MANGA = "MANGA",
}

//==============================================================
// END Enums and Input Objects
//==============================================================
