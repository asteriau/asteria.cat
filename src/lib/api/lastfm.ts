import type { LastfmActivity, Track, LastfmTrackRaw } from '@/types/lastfm'

const BASE_URL = 'https://ws.audioscrobbler.com/2.0/'

function pickImage(images: { '#text': string; size: string }[] | undefined): string {
	if (!images || images.length === 0) return 'default.webp'

	const preferred =
		images.find((img) => img.size === 'extralarge') ??
		images[images.length - 1]

	return preferred?.['#text'] || 'default.webp'
}

function normaliseTrack(raw: LastfmTrackRaw, nowPlaying: boolean): Track {
	const id = raw.mbid || raw.url || `${raw.artist['#text']} - ${raw.name}`

	const playedAt =
		!nowPlaying && raw.date?.uts
			? Number(raw.date.uts) * 1000
			: undefined

	return {
		id,
		title: raw.name,
		artist: raw.artist['#text'],
		album: raw.album['#text'] ?? '',
		image: pickImage(raw.image),
		playedAt,
		nowPlaying,
	}
}

export async function fetchLastfmActivity(
	apiKey: string,
	username: string
): Promise<LastfmActivity> {
	if (!apiKey || !username) {
		return { nowPlaying: null, lastPlayed: null }
	}

	const params = new URLSearchParams({
		method: 'user.getrecenttracks',
		user: username,
		api_key: apiKey,
		format: 'json',
		limit: '2',
	})

	try {
		const response = await fetch(`${BASE_URL}?${params.toString()}`, {
			next: { revalidate: 30 },
		})

		if (!response.ok) {
			console.error('Last.fm request failed with status', response.status)
			return { nowPlaying: null, lastPlayed: null }
		}

		const json = await response.json()
		const list: LastfmTrackRaw[] | undefined = json?.recenttracks?.track

		if (!list || list.length === 0) {
			return { nowPlaying: null, lastPlayed: null }
		}

		const first = list[0]
		const second = list[1]
		const isNow = first['@attr']?.nowplaying === 'true'

		let nowPlaying: Track | null = null
		let lastPlayed: Track | null = null

		if (isNow) {
			nowPlaying = normaliseTrack(first, true)
			if (second) {
				lastPlayed = normaliseTrack(second, false)
			}
		} else {
			if (first.date?.uts) {
				lastPlayed = normaliseTrack(first, false)
			} else if (second) {
				lastPlayed = {
					...normaliseTrack(first, false),
					playedAt: Date.now(),
				}
			}
		}

		return { nowPlaying, lastPlayed }
	} catch (error) {
		console.error('Failed to fetch Last.fm activity', error)
		return { nowPlaying: null, lastPlayed: null }
	}
}
