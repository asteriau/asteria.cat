export interface Track {
	id: string
	title: string
	artist: string
	album: string
	image: string
	playedAt?: number
	nowPlaying: boolean
}

export interface LastfmResponse {
	recenttracks: {
		track: LastfmTrackRaw[]
	}
}

export interface LastfmTrackRaw {
	name: string
	mbid?: string
	url?: string
	artist: {
		'#text': string
	}
	album: {
		'#text': string
	}
	image?: LastfmImage[]
	date?: {
		uts: string
	}
	'@attr'?: {
		nowplaying?: 'true' | 'false'
	}
}

export interface LastfmImage {
	'#text': string
	size: string
}

export interface LastfmActivity {
	nowPlaying: Track | null
	lastPlayed: Track | null
}
