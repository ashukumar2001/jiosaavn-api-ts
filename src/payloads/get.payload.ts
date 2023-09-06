import { createImageLinks, parseBool } from "../lib/utils";
import {
  ChartRequest,
  ChartResponse,
  FeaturedPlaylistsRequest,
  FeaturedPlaylistsResponse,
  RadioRequest,
  RadioResponse,
  TopAlbumRequest,
  TopAlbumResponse,
  TopArtistRequest,
  TopArtistResponse,
  TopShowRequest,
  TopShowResponse,
  TopShowsRequest,
  TopShowsResponse,
  TrendingPodcastsRequest,
  TrendingPodcastsResponse,
  TrendingRequest,
  TrendingResponse,
} from "../types/get";
import { albumPayload } from "./album.payload";
import { playlistPayload } from "./playlist.payload";
import { songPayload } from "./song.payload";

export function trendingPayload(t: TrendingRequest): TrendingResponse {
  return t.map((i) =>
    i.type === "song"
      ? songPayload(i)
      : i.type === "album"
      ? albumPayload(i)
      : playlistPayload(i)
  );
}

export function featuredPlaylistsPayload(
  f: FeaturedPlaylistsRequest
): FeaturedPlaylistsResponse {
  return {
    count: f.count,
    last_page: f.last_page,
    data: f.data.map(playlistPayload),
  };
}

export function chartPayload(c: ChartRequest): ChartResponse {
  const {
    id,
    title: name,
    subtitle,
    type,
    image,
    perma_url: url,
    explicit_content,
    listname,
    language,
    more_info,
  } = c;

  return {
    id,
    name,
    listname,
    subtitle,
    type,
    url,
    explicit: explicit_content ? parseBool(explicit_content) : false,
    image: createImageLinks(image),
    first_name: more_info?.firstname,
    language: language,
    count: c.count ?? more_info?.song_count,
  };
}

function topShowPayload(s: TopShowRequest): TopShowResponse {
  const {
    id,
    title: name,
    subtitle,
    type,
    image,
    perma_url: url,
    explicit_content,
    more_info: { badge, release_date, season_number },
  } = s;

  return {
    id,
    name,
    subtitle,
    type,
    image: createImageLinks(image),
    url,
    explicit: parseBool(explicit_content),
    badge,
    release_date,
    season_number: +season_number,
  };
}

function trendingPodcastsPayload(
  p: TrendingPodcastsRequest
): TrendingPodcastsResponse {
  const {
    items,
    module: { title, subtitle },
  } = p;

  return {
    items: items.map((i) => ({
      id: i.id,
      name: i.title,
      subtitle: i.subtitle,
      type: i.type,
      image: createImageLinks(i.image),
      url: i.perma_url,
      explicit: parseBool(i.explicit_content),
    })),
    module: { title, subtitle, source: "client" },
  };
}
export function topShowsPayload(s: TopShowsRequest): TopShowsResponse {
  const { last_page, data, trendingPodcasts } = s;

  return {
    count: data.length,
    last_page: last_page,
    data: data.map(topShowPayload),
    trending_podcasts: trendingPodcasts.map(trendingPodcastsPayload),
  };
}

export function topArtistsPayload(a: TopArtistRequest): TopArtistResponse {
  return a.top_artists.map((a) => {
    const {
      artistid: id,
      name,
      image,
      perma_url: url,
      is_followed,
      follower_count,
    } = a;

    return {
      id,
      name,
      image: createImageLinks(image),
      url,
      is_followed,
      follower_count,
    };
  });
}

export function topAlbumsPayload(a: TopAlbumRequest): TopAlbumResponse {
  const { count, last_page, data } = a;

  return {
    count,
    last_page,
    data: data.map((a) =>
      a.type === "song" ? songPayload(a) : albumPayload(a)
    ),
  };
}

export function radioPayload(r: RadioRequest): RadioResponse {
  const {
    id,
    title: name,
    subtitle,
    type,
    perma_url: url,
    explicit_content,
    image,
    more_info: {
      featured_station_type,
      language,
      station_display_text,
      color,
      description,
      query,
    },
  } = r;

  return {
    id,
    name,
    subtitle,
    type,
    url,
    explicit: parseBool(explicit_content),
    image: createImageLinks(image),
    featured_station_type,
    language,
    station_display_text: station_display_text,
    color,
    description,
    query,
  };
}