<script lang="ts">
  import type { Track } from '$lib/presence/lastfm';
  import { fade, slide } from 'svelte/transition';

  export let nowPlaying: Track | null = null;
  export let lastPlayed: Track | null = null;

  $: active = nowPlaying || lastPlayed;
  $: isCurrentlyPlaying = nowPlaying?.id === active?.id;
  $: isLoading = !nowPlaying && !lastPlayed;
  
  // Track when data becomes available for transition
  let hasLoaded = false;
  $: if (active && !hasLoaded) {
    hasLoaded = true;
  }

  function formatLastPlayedTime(timestamp: number | undefined): string {
    if (!timestamp) return '';
    const now = Date.now();
    const diff = now - timestamp;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }
</script>

<div class="spotify-container">
  {#if isLoading}
    <!-- Skeleton -->
    <div class="music-card skeleton" transition:fade={{ duration: 300 }}>
      <div class="music-content">
        <div class="album-section">
          <div class="album-cover skeleton-box" />
        </div>

        <div class="track-info-wrapper skeleton-wrapper">
          <div class="track-info">
            <div class="track-title-group">
              <div class="skeleton-line title" />
              <div class="skeleton-line artist" />
            </div>
            
            <div class="album-group">
              <div class="skeleton-line album" />
            </div>
            
            <div class="timestamp-group">
              <div class="skeleton-line time" />
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}

  {#if !isLoading && active}
    <!-- Real content with smooth fade-in -->
    <div class="music-card" 
         class:fade-in={hasLoaded}
         in:slide={{ duration: 400, delay: 50 }}
         out:fade={{ duration: 200 }}>
      {#if isCurrentlyPlaying}
        <div class="visualizer">
          {#each Array(16) as _, i}
            <div class="visualizer-bar" style="animation-delay: {i * 0.12}s" />
          {/each}
        </div>
      {/if}

      <div class="music-content">
        <div class="album-section">
          <div class="album-cover">
            <img
              src={active.image}
              alt={`${active.title} by ${active.artist}`}
              loading="lazy"
              on:error={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div class="album-placeholder hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="M8 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4m0 3a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="track-info-wrapper">
          <div class="track-info">
            <div class="track-title-group">
              <h3 class="track-title">{active.title}</h3>
              <p class="artist">{active.artist}</p>
            </div>
            
            <div class="album-group">
              {#if active.album}
                <p class="album">on {active.album}</p>
              {/if}
            </div>
            
            <div class="timestamp-group">
              <p class="timestamp">
                {#if isCurrentlyPlaying}
                  <span class="now-playing">
                    now playing on
                    <svg class="spotify-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.669 11.538a.5.5 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686m.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858m.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288"/>
                    </svg>
                  </span>
                {:else if active.playedAt}
                  last played {formatLastPlayedTime(active.playedAt)}
                {/if}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @keyframes visualizerPulse {
    0%, 100% { height: 15%; opacity: 0.2; }
    50% { height: 100%; opacity: 0.5; }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes slideUpFadeIn {
    0% { 
      opacity: 0;
      transform: translateY(10px);
    }
    100% { 
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes contentFadeIn {
    0% { 
      opacity: 0;
    }
    100% { 
      opacity: 1;
    }
  }

  .spotify-container {
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
    height: 180px !important;
    min-height: 180px !important;
    max-height: 180px !important;
    display: flex;
    align-items: center;
    position: relative;
  }

  .music-card {
    background: transparent;
    border-radius: 12px;
    padding: 16px;
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    
    &.fade-in {
      .music-content {
        animation: contentFadeIn 0.5s ease-out forwards;
      }
      
      .album-cover img,
      .album-placeholder {
        animation: fadeIn 0.6s ease-out 0.2s both;
      }
      
      .track-title {
        animation: slideUpFadeIn 0.5s ease-out 0.1s both;
      }
      
      .artist {
        animation: slideUpFadeIn 0.5s ease-out 0.15s both;
      }
      
      .album {
        animation: slideUpFadeIn 0.5s ease-out 0.2s both;
      }
      
      .timestamp {
        animation: slideUpFadeIn 0.5s ease-out 0.25s both;
      }
    }
  }

  .skeleton {
    animation: fadeIn 0.3s ease forwards;
  }

  .skeleton-box,
  .skeleton-line {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.04),
      rgba(255,255,255,0.12),
      rgba(255,255,255,0.04)
    );
    background-size: 200% 100%;
    animation: shimmer 1.4s ease infinite;
    border-radius: 6px;
  }

  .skeleton-box {
    width: 100px;
    height: 100px;
    opacity: 0.6;
  }

  .skeleton-line {
    display: block;
    border-radius: 4px;
    opacity: 0.6;
  }

  .skeleton-wrapper {
    flex: 1;
    min-width: 0;
    height: 100px; 
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    .track-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }
    
    .track-title-group {
      margin-bottom: auto;
    }
    
    .album-group {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 100%;
      width: 100%;
    }
    
    .timestamp-group {
      margin-top: auto;
    }
  }

  .track-title-group .skeleton-line.title { 
    width: 70%; 
    height: 16px; 
    margin-bottom: 6px; 
  }
  
  .track-title-group .skeleton-line.artist { 
    width: 50%; 
    height: 14px; 
    margin-bottom: 0;
  }
  
  .album-group .skeleton-line.album { 
    width: 60%; 
    height: 12px; 
    margin: 0;
  }
  
  .timestamp-group .skeleton-line.time { 
    width: 40%; 
    height: 12px; 
    margin-top: auto;
  }

  .visualizer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 0 4px;
    opacity: 0.08;
    z-index: 0;
  }

  .visualizer-bar {
    flex: 1;
    margin: 0 1px;
    background: linear-gradient(to top, #8C977D, transparent);
    border-radius: 2px 2px 0 0;
    animation: visualizerPulse 2s infinite ease-in-out;
    transform-origin: bottom;
  }

  .music-content {
    position: relative;
    z-index: 1;
    display: flex;
    gap: 16px;
    align-items: center;
    width: 100%;
  }

  .album-section {
    flex-shrink: 0;
    position: relative;
  }

  .album-cover {
    width: 100px;
    height: 100px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .music-card:hover .album-cover {
    transform: scale(1.02);
  }

  .album-placeholder {
    width: 100%;
    height: 100%;
    background: var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--main-accent);

    &.hidden {
      display: none;
    }
  }

  .track-info-wrapper {
    flex: 1;
    min-width: 0;
    height: 100px; 
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .track-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .track-title-group {
    margin-bottom: auto;
  }

  .album-group {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    width: 100%;
  }

  .timestamp-group {
    margin-top: auto;
  }

  .track-title {
    margin: 0 0 4px 0;
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--color-fg);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
    letter-spacing: -0.2px;
  }

  .artist {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 450;
    color: var(--main-accent);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
    letter-spacing: 0.1px;
  }

  .album {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 400;
    color: rgba(232, 227, 227, 0.6);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
    letter-spacing: 0.05px;
    text-align: left;
    width: 100%;
  }

  .timestamp {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 400;
    color: var(--main-accent);
    opacity: 0.85;
    line-height: 1.3;
    letter-spacing: 0.05px;
  }

  .now-playing {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 450;
    letter-spacing: 0.05px;
  }

  .spotify-icon {
    color: #8C977D;
    flex-shrink: 0;
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    .spotify-container {
      height: 160px !important;
      min-height: 160px !important;
      max-height: 160px !important;
    }

    .music-card {
      padding: 12px;
      border-radius: 10px;
    }

    .skeleton-box {
      width: 80px;
      height: 80px;
    }

    .skeleton-wrapper {
      height: 80px;
    }

    .album-cover {
      width: 80px;
      height: 80px;
      border-radius: 10px;
    }

    .track-info-wrapper {
      height: 80px;
    }

    .music-content {
      gap: 14px;
    }

    .track-title {
      font-size: 1rem;
      margin-bottom: 3px;
    }

    .artist {
      font-size: 0.85rem;
    }

    .album {
      font-size: 0.8rem;
    }

    .timestamp {
      font-size: 0.75rem;
    }

    .visualizer {
      padding: 0 2px;
    }

    .visualizer-bar {
      margin: 0 0.5px;
    }

    .spotify-icon {
      width: 12px;
      height: 12px;
    }
  }

  @media (max-width: 480px) {
    .spotify-container {
      height: 140px !important;
      min-height: 140px !important;
      max-height: 140px !important;
    }

    .music-card {
      padding: 10px;
    }

    .skeleton-box {
      width: 60px;
      height: 60px;
    }

    .skeleton-wrapper {
      height: 60px;
    }

    .album-cover {
      width: 60px;
      height: 60px;
      border-radius: 8px;
    }

    .track-info-wrapper {
      height: 60px;
    }

    .music-content {
      gap: 12px;
    }

    .track-title {
      font-size: 0.95rem;
      margin-bottom: 2px;
    }

    .artist {
      font-size: 0.8rem;
    }

    .album {
      font-size: 0.75rem;
    }

    .timestamp {
      font-size: 0.7rem;
    }
  }

  @media (max-width: 360px) {
    .spotify-container {
      height: 130px !important;
      min-height: 130px !important;
      max-height: 130px !important;
    }

    .music-card {
      padding: 8px;
    }

    .skeleton-box {
      width: 50px;
      height: 50px;
    }

    .skeleton-wrapper {
      height: 50px;
    }

    .album-cover {
      width: 50px;
      height: 50px;
    }

    .track-info-wrapper {
      height: 50px;
    }

    .track-title {
      font-size: 0.9rem;
    }

    .artist {
      font-size: 0.75rem;
    }

    .album {
      font-size: 0.7rem;
    }
  }
</style>