'use client'

import { useActivity } from '@/hooks/useActivity'
import { DISCORD_ID } from '@/lib/constants'
import { DiscordStatus } from './DiscordStatus'
import { SpotifyStatus } from './SpotifyStatus'

export function RichPresence() {
	const { discord, lastfm, loading } = useActivity(
		DISCORD_ID,
		process.env.NEXT_PUBLIC_LASTFM_API_KEY,
		process.env.NEXT_PUBLIC_LASTFM_USERNAME
	)

	return (
		<div className="flex flex-col w-full">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full rounded-lg overflow-hidden p-6 md:p-8">
				<div className="pl-0 pr-3 box-border border-r-0 md:border-r border-b md:border-b-0 border-border/60 pb-4 md:pb-0 mb-4 md:mb-0">
					<DiscordStatus presence={discord} loading={loading} />
				</div>
				<div className="px-3 box-border">
					<SpotifyStatus
						nowPlaying={lastfm.nowPlaying}
						lastPlayed={lastfm.lastPlayed}
						loading={loading}
					/>
				</div>
			</div>
		</div>
	)
}