<script lang="ts" context="module">
  import type { Track } from '$lib/presence/lastfm';

  interface CachedDiscordPresence {
    username: string;
    activity: string;
    details: string;
    state: string;
    image: string;
    smallImage: string;
    isActivity: boolean;
    elapsed: string;
    avatar: string;
    decoration: string;
    status: string;
    startTimestamp: number | null;
  }

  interface CachedLastfmPresence {
    nowPlaying: Track | null;
    lastPlayed: Track | null;
  }

  const DISCORD_CACHE_MS = 30_000;
  const LASTFM_CACHE_MS = 30_000;

  let cachedDiscord: CachedDiscordPresence | null = null;
  let cachedDiscordAt = 0;

  let cachedLastfm: CachedLastfmPresence | null = null;
  let cachedLastfmAt = 0;
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import Discord from '$lib/components/presence/Discord.svelte';
  import Spotify from '$lib/components/presence/Spotify.svelte';
  import type { Track } from '$lib/presence/lastfm';
  import { fetchLastfmActivity } from '$lib/presence/lastfm';

  export let discordId: string;

  // Discord state (from Lanyard HTTP)
  let discordUsername = '';
  let discordActivity = '';
  let discordDetails = '';
  let discordState = '';
  let discordImage = '';
  let discordSmallImage = '';
  let discordIsActivity = false;
  let discordElapsed = '';
  let discordAvatar = '';
  let discordDecoration = '';
  let discordStatus: string = 'offline';
  let discordStartTimestamp: number | null = null;

  // Music state (from Last.fm)
  let nowPlaying: Track | null = null;
  let lastPlayed: Track | null = null;

  const LANYARD_BASE = 'https://api.lanyard.rest/v1/users/';

  async function fetchDiscordPresence() {
    if (!discordId) return;

    const now = Date.now();
    if (cachedDiscord && now - cachedDiscordAt < DISCORD_CACHE_MS) {
      applyDiscordCache(cachedDiscord);
      return;
    }

    try {
      const res = await fetch(`${LANYARD_BASE}${discordId}`);
      if (!res.ok) return;
      const json = await res.json();
      const d = json.data;

      const user = d.discord_user;
      const status: string = d.discord_status ?? 'offline';
      const activities: any[] = d.activities ?? [];

      // Basic identity + status
      const username = user?.username || user?.global_name || 'Discord';
      discordUsername = `@${username}`;
      discordActivity = '';

      const prettyStatus = status === 'dnd'
        ? 'Do Not Disturb'
        : status.charAt(0).toUpperCase() + status.slice(1);
      discordDetails = prettyStatus;
      discordState = localTime();
      discordStatus = status;
      discordStartTimestamp = null;

      // User avatar + decoration
      const avatarHash: string | undefined = user?.avatar;
      if (avatarHash) {
        discordAvatar = `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.webp?size=256`;
      } else {
        // Default Discord avatar sprite based on discriminator bucket
        const fallbackIndex = Number(discordId) % 5;
        discordAvatar = `https://cdn.discordapp.com/embed/avatars/${fallbackIndex}.png`;
      }

      const decoAsset: string | undefined = user?.avatar_decoration_data?.asset;
      discordDecoration = decoAsset
        ? `https://cdn.discordapp.com/avatar-decoration-presets/${decoAsset}.png?size=256`
        : '';

      // Try to surface a rich activity (non-custom, non-Spotify)
      const rich = activities.find((act) => act.type !== 4 && act.name !== 'Spotify' && act.application_id !== 'spotify');
      if (rich) {
        discordIsActivity = true;
        discordActivity = rich.name || '';
        discordDetails = rich.details || '';
        discordState = rich.state || '';

        // Get start timestamp for elapsed time
        discordStartTimestamp = rich.timestamps?.start ?? null;

        discordImage = rich.assets?.large_image
          ? processImageUrl(rich.assets.large_image, rich.application_id) ?? discordAvatar
          : discordAvatar;

        discordSmallImage = rich.assets?.small_image && rich.application_id
          ? processImageUrl(rich.assets.small_image, rich.application_id) ?? ''
          : '';
      } else {
        discordIsActivity = false;
        // When idle, show the user's avatar as the main image
        discordImage = discordAvatar;
        discordSmallImage = '';
      }

      cachedDiscord = {
        username: discordUsername,
        activity: discordActivity,
        details: discordDetails,
        state: discordState,
        image: discordImage,
        smallImage: discordSmallImage,
        isActivity: discordIsActivity,
        elapsed: discordElapsed,
        avatar: discordAvatar,
        decoration: discordDecoration,
        status: discordStatus,
        startTimestamp: discordStartTimestamp
      };
      cachedDiscordAt = Date.now();
    } catch (error) {
      console.error('Failed to fetch Discord presence from Lanyard', error);
    }
  }

  function applyDiscordCache(cache: CachedDiscordPresence) {
    discordUsername = cache.username;
    discordActivity = cache.activity;
    discordDetails = cache.details;
    discordState = cache.state;
    discordImage = cache.image;
    discordSmallImage = cache.smallImage;
    discordIsActivity = cache.isActivity;
    discordElapsed = cache.elapsed;
    discordAvatar = cache.avatar;
    discordDecoration = cache.decoration;
    discordStatus = cache.status;
    discordStartTimestamp = cache.startTimestamp;
  }

  function processImageUrl(image: string | null, application_id?: string) {
    if (!image) return undefined;
    if (image.startsWith('http')) return image;
    if (application_id) return `https://cdn.discordapp.com/app-assets/${application_id}/${image}.webp?size=512`;
    return undefined;
  }

  function localTime() {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: 'Europe/Bucharest',
      hour12: true,
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  async function refreshLastfm() {
    try {
      const now = Date.now();
      if (cachedLastfm && now - cachedLastfmAt < LASTFM_CACHE_MS) {
        nowPlaying = cachedLastfm.nowPlaying;
        lastPlayed = cachedLastfm.lastPlayed;
        return;
      }

      const data = await fetchLastfmActivity();
      nowPlaying = data.nowPlaying;
      lastPlayed = data.lastPlayed;

      cachedLastfm = { nowPlaying, lastPlayed };
      cachedLastfmAt = Date.now();
    } catch (error) {
      console.error('Failed to fetch Last.fm activity', error);
    }
  }

  onMount(() => {
    fetchDiscordPresence();
    refreshLastfm();

    const discordInterval = setInterval(fetchDiscordPresence, 60_000);
    const lastfmInterval = setInterval(refreshLastfm, 30_000);

    return () => {
      clearInterval(discordInterval);
      clearInterval(lastfmInterval);
    };
  });
</script>

<div class="rpc-container">
  <div class="rpc-grid">
    <Discord
      username={discordUsername}
      activity={discordActivity}
      details={discordDetails}
      state={discordState}
      image={discordImage}
      smallImage={discordSmallImage}
      isActivity={discordIsActivity}
      elapsed={discordElapsed}
      avatar={discordAvatar}
      decoration={discordDecoration}
      status={discordStatus}
      startTimestamp={discordStartTimestamp}
    />

    <Spotify
      nowPlaying={nowPlaying}
      lastPlayed={lastPlayed}
    />
  </div>
</div>

<style lang="scss">
  .rpc-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
  }

  .rpc-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0;
    width: 100%;
    box-sizing: border-box;
  }

  .rpc-grid > * {
    padding: 0 8px;           
    box-sizing: border-box;   
  }

  .rpc-grid > :global(:first-child) {
    border-right: 1px solid var(--color-border);
  }

  :global(.rpc-box),
  :global(.spotify-box) {
    height: 180px !important;
    min-height: 180px !important;
    max-height: 180px !important;
    box-sizing: border-box;
    padding: 0; 
    width: 100%;
  }

  :global(.discord-container .image-container),
  :global(.spotify-container .album-cover) {
    margin: 0;
    box-sizing: border-box;
    width: 100px;
    height: 100px;
  }

  :global(.discord-container .avatar-decoration) {
    position: absolute;
    left: 0;
    top: 0;
    transform: translate(-7px, -7px); 
    width: calc(100% + 14px);
    height: calc(100% + 14px);
    pointer-events: none;
  }

  @media (max-width: 900px) {
    .rpc-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .rpc-grid > :global(:first-child) {
      border-right: none;
      border-bottom: 1px solid var(--color-border);
    }

    :global(.rpc-box),
    :global(.spotify-box) {
      height: 160px !important;
      min-height: 160px !important;
      max-height: 160px !important;
    }
  }

  @media (max-width: 480px) {
    .rpc-grid {
      gap: 12px;
    }

    :global(.rpc-box),
    :global(.spotify-box) {
      height: 140px !important;
      min-height: 140px !important;
      max-height: 140px !important;
    }

    :global(.discord-container .avatar-decoration) {
      transform: translate(-6px, -6px);
      width: calc(100% + 12px);
      height: calc(100% + 12px);
    }
  }
</style>
