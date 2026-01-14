import { useEffect, useState, useCallback } from 'react'
import type { DiscordPresence } from '@/types/lanyard'
import type { LastfmActivity } from '@/types/lastfm'
import { CACHE_DURATION } from '@/lib/constants'

interface UseActivityReturn {
	discord: DiscordPresence | null
	lastfm: LastfmActivity
	loading: boolean
	error: string | null
	refresh: () => void
}

export function useActivity(
	discordId: string,
	lastfmApiKey?: string,
	lastfmUsername?: string
): UseActivityReturn {
	const [discord, setDiscord] = useState<DiscordPresence | null>(null)
	const [lastfm, setLastfm] = useState<LastfmActivity>({
		nowPlaying: null,
		lastPlayed: null,
	})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchDiscord = useCallback(async () => {
		try {
			const res = await fetch(`/api/activity/lanyard?discordId=${discordId}`)
			if (!res.ok) throw new Error('Failed to fetch Discord presence')
			const data = await res.json()
			setDiscord(data)
		} catch (err) {
			console.error('Failed to fetch Discord presence', err)
			setError('Failed to load Discord presence')
		}
	}, [discordId])

	const fetchLastfm = useCallback(async () => {
		if (!lastfmApiKey || !lastfmUsername) {
			setLastfm({ nowPlaying: null, lastPlayed: null })
			return
		}

		try {
			const res = await fetch(
				`/api/activity/lastfm?apiKey=${lastfmApiKey}&username=${lastfmUsername}`
			)
			if (!res.ok) throw new Error('Failed to fetch Last.fm activity')
			const data = await res.json()
			setLastfm(data)
		} catch (err) {
			console.error('Failed to fetch Last.fm activity', err)
			setError('Failed to load music activity')
		}
	}, [lastfmApiKey, lastfmUsername])

	const refresh = useCallback(() => {
		fetchDiscord()
		fetchLastfm()
	}, [fetchDiscord, fetchLastfm])

	useEffect(() => {
		let mounted = true
		let initialLoadComplete = false

		const loadData = async () => {
			setLoading(true)
			await Promise.all([fetchDiscord(), fetchLastfm()])
			if (mounted) {
				setLoading(false)
				initialLoadComplete = true
			}
		}

		loadData()

		// Only poll for changes after initial load
		const discordInterval = setInterval(() => {
			if (initialLoadComplete && mounted) {
				fetchDiscord()
			}
		}, CACHE_DURATION.DISCORD)
		
		const lastfmInterval = setInterval(() => {
			if (initialLoadComplete && mounted) {
				fetchLastfm()
			}
		}, CACHE_DURATION.LASTFM)

		return () => {
			mounted = false
			clearInterval(discordInterval)
			clearInterval(lastfmInterval)
		}
	}, [fetchDiscord, fetchLastfm])

	return { discord, lastfm, loading, error, refresh }
}
