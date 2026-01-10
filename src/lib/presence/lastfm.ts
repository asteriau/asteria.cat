import { PUBLIC_LASTFM_API_KEY, PUBLIC_LASTFM_USERNAME } from '$env/static/public';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  image: string;
  playedAt?: number;
  nowPlaying: boolean;
}

interface LastfmImage {
  '#text': string;
  size: string;
}

interface LastfmTrackRaw {
  name: string;
  mbid?: string;
  url?: string;
  artist: { '#text': string };
  album: { '#text': string };
  image?: LastfmImage[];
  date?: { uts: string };
  ['@attr']?: { nowplaying?: 'true' | 'false' };
}

const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

function pickImage(images: LastfmImage[] | undefined): string {
  if (!images || images.length === 0) return 'default.webp';

  const preferred =
    images.find((img) => img.size === 'extralarge') ??
    images[images.length - 1];

  return preferred?.['#text'] || 'default.webp';
}

function normaliseTrack(raw: LastfmTrackRaw, nowPlaying: boolean): Track {
  const id = raw.mbid || raw.url || `${raw.artist['#text']} - ${raw.name}`;

  const playedAt =
    !nowPlaying && raw.date?.uts
      ? Number(raw.date.uts) * 1000
      : undefined;

  return {
    id,
    title: raw.name,
    artist: raw.artist['#text'],
    album: raw.album['#text'] ?? '',
    image: pickImage(raw.image),
    playedAt,
    nowPlaying
  };
}

export async function fetchLastfmActivity(): Promise<{
  nowPlaying: Track | null;
  lastPlayed: Track | null;
}> {
  if (!PUBLIC_LASTFM_API_KEY || !PUBLIC_LASTFM_USERNAME) {
    return { nowPlaying: null, lastPlayed: null };
  }

  const params = new URLSearchParams({
    method: 'user.getrecenttracks',
    user: PUBLIC_LASTFM_USERNAME,
    api_key: PUBLIC_LASTFM_API_KEY,
    format: 'json',
    limit: '2'
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`, {
    cf: {
      cacheTtl: 30,
      cacheEverything: true
    }
  });

  if (!response.ok) {
    console.error('Last.fm request failed with status', response.status);
    return { nowPlaying: null, lastPlayed: null };
  }

  const json = await response.json();
  const list: LastfmTrackRaw[] | undefined = json?.recenttracks?.track;

  if (!list || list.length === 0) {
    return { nowPlaying: null, lastPlayed: null };
  }

  const first = list[0];
  const second = list[1];
  const isNow = first['@attr']?.nowplaying === 'true';

  let nowPlaying: Track | null = null;
  let lastPlayed: Track | null = null;

  if (isNow) {
    // Actively playing
    nowPlaying = normaliseTrack(first, true);

    if (second) {
      lastPlayed = normaliseTrack(second, false);
    }
  } else {
    // Not playing — either just stopped or genuinely last played
    if (first.date?.uts) {
      // Properly scrobbled
      lastPlayed = normaliseTrack(first, false);
    } else if (second) {
      // Just stopped playing, but scrobble not registered yet
      lastPlayed = {
        ...normaliseTrack(first, false),
        playedAt: Date.now()
      };
    }
  }

  return { nowPlaying, lastPlayed };
}
