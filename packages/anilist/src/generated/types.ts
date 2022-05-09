/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: fetchUserLists
// ====================================================

export interface fetchUserLists_MediaListCollection_user {
  __typename: "User";
  /**
   * The id of the user
   */
  id: number;
}

export interface fetchUserLists_MediaListCollection_lists_entries_startedAt {
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

export interface fetchUserLists_MediaListCollection_lists_entries_completedAt {
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

export interface fetchUserLists_MediaListCollection_lists_entries_media_coverImage {
  __typename: "MediaCoverImage";
  /**
   * The cover image url of the media at a large size
   */
  large: string | null;
}

export interface fetchUserLists_MediaListCollection_lists_entries_media_startDate {
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

export interface fetchUserLists_MediaListCollection_lists_entries_media_endDate {
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

export interface fetchUserLists_MediaListCollection_lists_entries_media_title {
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

export interface fetchUserLists_MediaListCollection_lists_entries_media_relations_edges_node_title {
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

export interface fetchUserLists_MediaListCollection_lists_entries_media_relations_edges_node {
  __typename: "Media";
  /**
   * The id of the media
   */
  id: number;
  /**
   * The official titles of the media in various languages
   */
  title: fetchUserLists_MediaListCollection_lists_entries_media_relations_edges_node_title | null;
}

export interface fetchUserLists_MediaListCollection_lists_entries_media_relations_edges {
  __typename: "MediaEdge";
  /**
   * The type of relation to the parent model
   */
  relationType: MediaRelation | null;
  node: fetchUserLists_MediaListCollection_lists_entries_media_relations_edges_node | null;
}

export interface fetchUserLists_MediaListCollection_lists_entries_media_relations {
  __typename: "MediaConnection";
  edges: (fetchUserLists_MediaListCollection_lists_entries_media_relations_edges | null)[] | null;
}

export interface fetchUserLists_MediaListCollection_lists_entries_media {
  __typename: "Media";
  /**
   * The id of the media
   */
  id: number;
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
   * The general length of each anime episode in minutes
   */
  duration: number | null;
  /**
   * Short description of the media's story and characters
   */
  description: string | null;
  /**
   * The cover images of the media
   */
  coverImage: fetchUserLists_MediaListCollection_lists_entries_media_coverImage | null;
  /**
   * The first official release date of the media
   */
  startDate: fetchUserLists_MediaListCollection_lists_entries_media_startDate | null;
  /**
   * The last official release date of the media
   */
  endDate: fetchUserLists_MediaListCollection_lists_entries_media_endDate | null;
  /**
   * The official titles of the media in various languages
   */
  title: fetchUserLists_MediaListCollection_lists_entries_media_title | null;
  /**
   * Other media in the same or connecting franchise
   */
  relations: fetchUserLists_MediaListCollection_lists_entries_media_relations | null;
}

export interface fetchUserLists_MediaListCollection_lists_entries {
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
  startedAt: fetchUserLists_MediaListCollection_lists_entries_startedAt | null;
  /**
   * When the entry was completed by the user
   */
  completedAt: fetchUserLists_MediaListCollection_lists_entries_completedAt | null;
  media: fetchUserLists_MediaListCollection_lists_entries_media | null;
}

export interface fetchUserLists_MediaListCollection_lists {
  __typename: "MediaListGroup";
  name: string | null;
  /**
   * Media list entries
   */
  entries: (fetchUserLists_MediaListCollection_lists_entries | null)[] | null;
}

export interface fetchUserLists_MediaListCollection {
  __typename: "MediaListCollection";
  /**
   * The owner of the list
   */
  user: fetchUserLists_MediaListCollection_user | null;
  /**
   * Grouped media list entries
   */
  lists: (fetchUserLists_MediaListCollection_lists | null)[] | null;
}

export interface fetchUserLists {
  /**
   * Media list collection query, provides list pre-grouped by status & custom lists. User ID and Media Type arguments required.
   */
  MediaListCollection: fetchUserLists_MediaListCollection | null;
}

export interface fetchUserListsVariables {
  userId: number;
  type: MediaType;
  statuses: MediaListStatus[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getCurrentUser
// ====================================================

export interface getCurrentUser_Viewer_avatar {
  __typename: "UserAvatar";
  /**
   * The avatar of user at its largest size
   */
  large: string | null;
  /**
   * The avatar of user at medium size
   */
  medium: string | null;
}

export interface getCurrentUser_Viewer {
  __typename: "User";
  /**
   * The id of the user
   */
  id: number;
  /**
   * The name of the user
   */
  name: string;
  /**
   * The user's avatar images
   */
  avatar: getCurrentUser_Viewer_avatar | null;
}

export interface getCurrentUser {
  /**
   * Get the currently authenticated user
   */
  Viewer: getCurrentUser_Viewer | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUserById
// ====================================================

export interface getUserById_User_avatar {
  __typename: "UserAvatar";
  /**
   * The avatar of user at its largest size
   */
  large: string | null;
  /**
   * The avatar of user at medium size
   */
  medium: string | null;
}

export interface getUserById_User {
  __typename: "User";
  /**
   * The id of the user
   */
  id: number;
  /**
   * The name of the user
   */
  name: string;
  /**
   * The user's avatar images
   */
  avatar: getUserById_User_avatar | null;
}

export interface getUserById {
  /**
   * User query
   */
  User: getUserById_User | null;
}

export interface getUserByIdVariables {
  userId: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUserLists
// ====================================================

export interface getUserLists_MediaListCollection_user {
  __typename: "User";
  /**
   * The id of the user
   */
  id: number;
}

export interface getUserLists_MediaListCollection_lists_entries_media {
  __typename: "Media";
  /**
   * The id of the media
   */
  id: number;
  /**
   * The amount of episodes the anime has when complete
   */
  episodes: number | null;
  /**
   * The general length of each anime episode in minutes
   */
  duration: number | null;
}

export interface getUserLists_MediaListCollection_lists_entries {
  __typename: "MediaList";
  /**
   * The id of the list entry
   */
  id: number;
  /**
   * The amount of episodes/chapters consumed by the user
   */
  progress: number | null;
  media: getUserLists_MediaListCollection_lists_entries_media | null;
}

export interface getUserLists_MediaListCollection_lists {
  __typename: "MediaListGroup";
  name: string | null;
  /**
   * Media list entries
   */
  entries: (getUserLists_MediaListCollection_lists_entries | null)[] | null;
}

export interface getUserLists_MediaListCollection {
  __typename: "MediaListCollection";
  /**
   * The owner of the list
   */
  user: getUserLists_MediaListCollection_user | null;
  /**
   * Grouped media list entries
   */
  lists: (getUserLists_MediaListCollection_lists | null)[] | null;
}

export interface getUserLists {
  /**
   * Media list collection query, provides list pre-grouped by status & custom lists. User ID and Media Type arguments required.
   */
  MediaListCollection: getUserLists_MediaListCollection | null;
}

export interface getUserListsVariables {
  userId: number;
  type: MediaType;
  statuses: MediaListStatus[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: searchUserByName
// ====================================================

export interface searchUserByName_User_avatar {
  __typename: "UserAvatar";
  /**
   * The avatar of user at its largest size
   */
  large: string | null;
  /**
   * The avatar of user at medium size
   */
  medium: string | null;
}

export interface searchUserByName_User {
  __typename: "User";
  /**
   * The id of the user
   */
  id: number;
  /**
   * The name of the user
   */
  name: string;
  /**
   * The user's avatar images
   */
  avatar: searchUserByName_User_avatar | null;
}

export interface searchUserByName {
  /**
   * User query
   */
  User: searchUserByName_User | null;
}

export interface searchUserByNameVariables {
  name: string;
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
 * Type of relation media has to its parent.
 */
export enum MediaRelation {
  ADAPTATION = "ADAPTATION",
  ALTERNATIVE = "ALTERNATIVE",
  CHARACTER = "CHARACTER",
  COMPILATION = "COMPILATION",
  CONTAINS = "CONTAINS",
  OTHER = "OTHER",
  PARENT = "PARENT",
  PREQUEL = "PREQUEL",
  SEQUEL = "SEQUEL",
  SIDE_STORY = "SIDE_STORY",
  SOURCE = "SOURCE",
  SPIN_OFF = "SPIN_OFF",
  SUMMARY = "SUMMARY",
}

/**
 * The current releasing status of the media
 */
export enum MediaStatus {
  CANCELLED = "CANCELLED",
  FINISHED = "FINISHED",
  HIATUS = "HIATUS",
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
