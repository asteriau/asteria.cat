import type { LanyardResponse, DiscordPresence } from '@/types/lanyard'
import { processImageUrl, localTime } from '@/lib/utils'

const LANYARD_BASE = 'https://api.lanyard.rest/v1/users/'

export async function fetchDiscordPresence(discordId: string): Promise<DiscordPresence | null> {
	try {
		const res = await fetch(`${LANYARD_BASE}${discordId}`)
		if (!res.ok) return null
		
		const json: LanyardResponse = await res.json()
		const d = json.data

		const user = d.discord_user
		const status: string = d.discord_status ?? 'offline'
		const activities: any[] = d.activities ?? []

		// Basic identity + status
		const username = user?.username || user?.global_name || 'Discord'
		const discordUsername = `@${username}`
		let discordActivity = ''

		const prettyStatus = status === 'dnd'
			? 'Do Not Disturb'
			: status.charAt(0).toUpperCase() + status.slice(1)
		let discordDetails = prettyStatus
		let discordState = localTime()
		const discordStatus = status
		let discordStartTimestamp: number | null = null

		// User avatar + decoration
		const avatarHash: string | undefined = user?.avatar
		let discordAvatar = ''
		if (avatarHash) {
			discordAvatar = `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.webp?size=256`
		} else {
			const fallbackIndex = Number(discordId) % 5
			discordAvatar = `https://cdn.discordapp.com/embed/avatars/${fallbackIndex}.png`
		}

		const decoAsset: string | undefined = user?.avatar_decoration_data?.asset
		const discordDecoration = decoAsset
			? `https://cdn.discordapp.com/avatar-decoration-presets/${decoAsset}.png?size=256`
			: ''

		// Try to surface a activity (non-custom, non-Spotify)
		const rich = activities.find((act) => act.type !== 4 && act.name !== 'Spotify' && act.application_id !== 'spotify')
		let discordImage = discordAvatar
		let discordSmallImage = ''
		let discordIsActivity = false

		if (rich) {
			discordIsActivity = true
			discordActivity = rich.name || ''
			discordDetails = rich.details || ''
			discordState = rich.state || ''
			discordStartTimestamp = rich.timestamps?.start ?? null

			discordImage = rich.assets?.large_image
				? processImageUrl(rich.assets.large_image, rich.application_id) ?? discordAvatar
				: discordAvatar

			discordSmallImage = rich.assets?.small_image && rich.application_id
				? processImageUrl(rich.assets.small_image, rich.application_id) ?? ''
				: ''
		}

		return {
			username: discordUsername,
			activity: discordActivity,
			details: discordDetails,
			state: discordState,
			image: discordImage,
			smallImage: discordSmallImage,
			isActivity: discordIsActivity,
			elapsed: '',
			avatar: discordAvatar,
			decoration: discordDecoration,
			status: discordStatus,
			startTimestamp: discordStartTimestamp,
		}
	} catch (error) {
		console.error('Failed to fetch Discord presence from Lanyard', error)
		return null
	}
}
