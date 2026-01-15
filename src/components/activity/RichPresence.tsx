'use client'

import { memo } from 'react'
import { useActivity } from '@/hooks/useActivity'
import { DISCORD_ID } from '@/lib/constants'
import { DiscordStatus } from './DiscordStatus'
import { SpotifyStatus } from './SpotifyStatus'

function RichPresenceContent() {
  const { discord, lastfm, loading } = useActivity(
    DISCORD_ID,
    process.env.NEXT_PUBLIC_LASTFM_API_KEY,
    process.env.NEXT_PUBLIC_LASTFM_USERNAME
  )

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 md:gap-3">
      {/* Discord Activity */}
      <div className="flex-1 min-w-0 p-6 md:p-7 h-full bg-elevated rounded-lg border border-border/50 shadow-xl">
        <DiscordStatus presence={discord} loading={loading} />
      </div>

      {/* Spotify Status */}
      <div className="flex-1 min-w-0 p-6 md:p-7 h-full bg-elevated rounded-lg border border-border/50 shadow-xl">
        <SpotifyStatus
          nowPlaying={lastfm.nowPlaying}
          lastPlayed={lastfm.lastPlayed}
          loading={loading}
        />
      </div>
    </div>
  )
}

export const RichPresence = memo(RichPresenceContent)
