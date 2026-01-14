'use client'

import { useEffect } from 'react'
import { DISCORD_ID, GITHUB_REPOS } from '@/lib/constants'
import { fetchRepository } from '@/lib/api/github'

export function usePreload() {
	useEffect(() => {
		// Preload Discord presence
		const discordId = DISCORD_ID
		if (discordId) {
			fetch(`/api/activity/lanyard?discordId=${discordId}`).catch(() => {})
		}

		// Preload Last.fm activity
		const lastfmApiKey = process.env.NEXT_PUBLIC_LASTFM_API_KEY
		const lastfmUsername = process.env.NEXT_PUBLIC_LASTFM_USERNAME
		if (lastfmApiKey && lastfmUsername) {
			fetch(`/api/activity/lastfm?apiKey=${lastfmApiKey}&username=${lastfmUsername}`).catch(() => {})
		}

		// Preload GitHub repositories
		const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN
		if (token) {
			Promise.all(GITHUB_REPOS.map((url) => fetchRepository(url, token))).catch(() => {})
		}
	}, [])
}
