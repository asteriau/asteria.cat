<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade, slide } from 'svelte/transition';

  export let username = '';
  export let activity = '';
  export let details = '';
  export let state = '';
  export let image = '';
  export let smallImage = '';
  export let isActivity = false;
  export let elapsed = '';
  export let avatar = '';
  export let decoration = '';
  export let status: string = 'offline';
  export let startTimestamp: number | null = null;

  $: showActivity = activity && isActivity;
  $: showProfile = !showActivity && username;
  
  let hasData = false;
  let showSkeleton = true;
  let hasLoaded = false;
  let initialElapsed = '';
  
  $: {
    const hasAnyData = username || activity;
    if (hasAnyData && !hasData) {
      hasData = true;
      showSkeleton = false;
      
      if (startTimestamp) {
        const now = Date.now();
        const diff = now - startTimestamp;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        if (hours > 0) {
          initialElapsed = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
          initialElapsed = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
      } else if (elapsed) {
        initialElapsed = elapsed.replace(/^elapsed:\s*/i, '').replace(/^for\s*/i, '');
      } else {
        initialElapsed = '0:00';
      }
      
      setTimeout(() => hasLoaded = true, 50);
    }
  }

  let liveElapsed = initialElapsed;
  let timerInterval: ReturnType<typeof setInterval> | null = null;

  function updateElapsedTime() {
    if (startTimestamp) {
      const now = Date.now();
      const diff = now - startTimestamp;
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      if (hours > 0) {
        liveElapsed = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        liveElapsed = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    } else if (elapsed) {
      liveElapsed = elapsed.replace(/^elapsed:\s*/i, '').replace(/^for\s*/i, '');
    } else {
      liveElapsed = '0:00';
    }
  }

  $: statusLabel = status === 'dnd' ? 'Do Not Disturb' : status.charAt(0).toUpperCase() + status.slice(1);
  $: displayElapsed = hasLoaded ? liveElapsed : initialElapsed;

  onMount(() => {
    updateElapsedTime();
    timerInterval = setInterval(updateElapsedTime, 1000);
  });

  onDestroy(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  });
</script>

<div class="discord-container">
  {#if showSkeleton}
    <div class="discord-card skeleton" transition:fade={{ duration: 300 }}>
      <div class="discord-content">
        <div class="avatar-wrapper skeleton-box" />
        <div class="info-section">
          <div class="skeleton-line name" />
          <div class="skeleton-line details" />
          <div class="skeleton-line status" />
        </div>
      </div>
    </div>
  {/if}

  {#if hasData}
    <div class="discord-card" 
         class:fade-in={hasLoaded}
         in:slide={{ duration: 400, delay: 50 }}
         out:fade={{ duration: 200 }}>
      
      <div class="discord-content">
        <div class="avatar-section">
          <div class="image-container">
            {#if showActivity && image}
              <img src={image} alt={activity} class="avatar-image" />
            {:else if showProfile && avatar}
              <img src={avatar} alt={username} class="avatar-image" />
            {:else if showProfile}
              <div class="avatar-fallback">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                </svg>
              </div>
            {:else if showActivity}
              <div class="avatar-fallback">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  <path d="M8 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4m0 3a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
                </svg>
              </div>
            {/if}

            {#if decoration && showProfile}
              <img src={decoration} alt="" class="avatar-decoration" on:error={(e) => e.target.style.display = 'none'} />
            {/if}
          </div>
          
          {#if showProfile}
            <div class="status-dot {status}" />
          {/if}
        </div>

        <div class="info-section">
          <div class="username-section">
            <h3 class="activity-name">
              {#if showActivity}
                {activity || 'Playing'}
                {#if smallImage}
                  <img src={smallImage} alt="" class="app-icon" on:error={(e) => e.target.style.display = 'none'} />
                {/if}
              {:else if showProfile}
                {username || 'Discord User'}
              {/if}
            </h3>
            
            {#if showProfile}
              <p class="status-line">
                <span class="status-badge {status}">{statusLabel}</span>
              </p>
            {/if}
          </div>

          {#if showActivity && details}
            <p class="activity-details">{details}</p>
          {/if}

          {#if showActivity && state}
            <p class="activity-state">{state}</p>
          {/if}

          {#if showActivity}
            <p class="status-line">
              <span class="elapsed-timer">
                <svg class="time-icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5.5" stroke="currentColor"/>
                  <path d="M6 3V6L8 8" stroke="currentColor" stroke-linecap="round"/>
                </svg>
                {displayElapsed} elapsed
              </span>
            </p>
          {/if}
          
          <!-- VIA LANYARD positioned under status text -->
          <p class="via-lanyard" style="--vertical-offset: 5px;">
            via Lanyard
            <img src="/lanyard.png" alt="Lanyard icon" class="lanyard-icon" />
          </p>
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes slideUpFadeIn {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  .discord-container {
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

  .skeleton { 
    animation: fadeIn 0.3s ease forwards; 
  }

  .skeleton-box, .skeleton-line {
    background: linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.12), rgba(255,255,255,0.04));
    background-size: 200% 100%;
    animation: shimmer 1.4s ease infinite;
    border-radius: 6px;
    opacity: 0.6;
  }

  .skeleton-box { 
    width: 100px; 
    height: 100px; 
  }

  .skeleton-line { 
    display: block; 
    border-radius: 4px; 
    margin-bottom: 8px; 
    
    &.name { 
      width: 70%; 
      height: 20px; 
    }
    
    &.details { 
      width: 60%; 
      height: 16px; 
    }
    
    &.status { 
      width: 40%; 
      height: 14px; 
      margin-top: 4px; 
    }
  }

  .discord-card {
    background: transparent;
    border-radius: 12px;
    padding: 16px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    
    &.fade-in {
      .avatar-image, .avatar-fallback { 
        animation: fadeIn 0.6s ease-out 0.2s both; 
      }
      .activity-name { 
        animation: slideUpFadeIn 0.5s ease-out 0.1s both; 
      }
      .activity-details { 
        animation: slideUpFadeIn 0.5s ease-out 0.15s both; 
      }
      .activity-state { 
        animation: slideUpFadeIn 0.5s ease-out 0.2s both; 
      }
      .status-line, .via-lanyard { 
        animation: slideUpFadeIn 0.5s ease-out 0.25s both; 
      }
      .status-dot { 
        animation: fadeIn 0.6s ease-out 0.3s both; 
      }
      .elapsed-timer { 
        animation: slideUpFadeIn 0.5s ease-out 0.25s both; 
      }
      .status-badge { 
        animation: slideUpFadeIn 0.5s ease-out 0.25s both; 
      }
    }
    
    &:global(:not(.skeleton)) { 
      z-index: 2; 
    }
    
    &.skeleton { 
      z-index: 1; 
    }
  }

  .discord-content { 
    display: flex; 
    gap: 16px; 
    align-items: center; 
    width: 100%; 
  }

  .avatar-section { 
    flex-shrink: 0; 
    position: relative; 
  }

  .image-container { 
    width: 100px; 
    height: 100px; 
    position: relative; 
  }

  .avatar-image { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
    border-radius: 999px; 
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); 
    transition: transform 0.3s ease; 
  }

  .discord-card:hover .avatar-image { 
    transform: scale(1.02); 
  }

  .avatar-fallback { 
    width: 100%; 
    height: 100%; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    background: var(--color-border); 
    border-radius: 12px; 
    color: var(--main-accent); 
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); 
  }

  .avatar-decoration { 
    position: absolute; 
    top: -7px; 
    left: -7px; 
    width: 114px; 
    height: 114px; 
    pointer-events: none; 
  }

  .status-dot { 
    position: absolute; 
    bottom: 4px; 
    right: 4px; 
    width: 20px; 
    height: 20px; 
    border-radius: 50%; 
    border: 3px solid var(--color-bg); 
    z-index: 2; 
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); 
    
    &.online { 
      background: #8C977D; 
    }
    
    &.idle { 
      background: #D9BC8C; 
    }
    
    &.dnd { 
      background: #B66467; 
    }
    
    &.streaming { 
      background: #A988B0; 
    }
    
    &.offline, &.invisible { 
      background: #525252; 
    }
  }

  .info-section { 
    flex: 1; 
    min-width: 0; 
    display: flex; 
    flex-direction: column; 
  }

  .username-section {
    margin-bottom: 6px;
  }

  .activity-name { 
    margin: 0; 
    font-size: 1.15rem; 
    font-weight: 500; 
    color: var(--color-fg); 
    overflow: hidden; 
    text-overflow: ellipsis; 
    white-space: nowrap; 
    display: flex; 
    align-items: center; 
    gap: 8px; 
  }

  .app-icon { 
    width: 18px; 
    height: 18px; 
    border-radius: 4px; 
    flex-shrink: 0; 
    opacity: 0.9; 
  }

  .activity-details { 
    margin: 0 0 4px 0; 
    font-size: 0.9rem; 
    color: rgba(232, 227, 227, 0.6); 
    overflow: hidden; 
    text-overflow: ellipsis; 
    white-space: nowrap; 
  }

  .activity-state { 
    margin: 0 0 10px 0; 
    font-size: 0.85rem; 
    color: rgba(232, 227, 227, 0.6); 
    overflow: hidden; 
    text-overflow: ellipsis; 
    white-space: nowrap; 
  }

  .status-line { 
    margin: 0; 
    font-size: 0.8rem; 
    display: flex; 
    align-items: center; 
    gap: 4px; 
  }

  .elapsed-timer { 
    display: flex; 
    align-items: center; 
    gap: 6px; 
    color: #8C977D; 
    font-weight: 500; 
    font-variant-numeric: tabular-nums; 
  }

  .time-icon { 
    flex-shrink: 0; 
    opacity: 0.8; 
  }

  .status-badge { 
    font-weight: 500; 
    
    &.online { 
      color: #8C977D; 
    }
    
    &.idle { 
      color: #D9BC8C; 
    }
    
    &.dnd { 
      color: #B66467; 
    }
    
    &.streaming { 
      color: #A988B0; 
    }
    
    &.offline, &.invisible { 
      color: #525252; 
    }
  }

  .via-lanyard { 
    display: flex; 
    align-items: center; 
    gap: 6px; 
    font-size: 0.75rem; 
    font-weight: 500; 
    color: #d7bb87; 
    white-space: nowrap;
    margin: 0;
    margin-top: var(--vertical-offset); 
  }

  .lanyard-icon { 
    width: 14px; 
    height: 14px; 
    flex-shrink: 0; 
    border-radius: 2px; 
  }

  @media (max-width: 768px) {
    .discord-container { 
      height: 160px !important; 
    }
    
    .discord-card { 
      padding: 12px; 
      border-radius: 10px; 
    }
    
    .skeleton-box { 
      width: 80px; 
      height: 80px; 
    }
    
    .image-container { 
      width: 80px; 
      height: 80px; 
    }
    
    .avatar-decoration { 
      width: 94px; 
      height: 94px; 
      top: -4px; 
      left: -4px; 
    }
    
    .status-dot { 
      width: 18px; 
      height: 18px; 
    }
    
    .discord-content { 
      gap: 14px; 
    }
    
    .activity-name { 
      font-size: 1.05rem; 
    }
    
    .app-icon { 
      width: 16px; 
      height: 16px; 
    }
    
    .activity-details { 
      font-size: 0.85rem; 
    }
    
    .activity-state { 
      font-size: 0.8rem; 
    }
    
    .status-line, .via-lanyard { 
      font-size: 0.75rem; 
    }
    
    .via-lanyard {
      --vertical-offset: 6px; 
    }
  }

  @media (max-width: 480px) {
    .discord-container { 
      height: 140px !important; 
    }
    
    .discord-card { 
      padding: 10px; 
    }
    
    .skeleton-box { 
      width: 60px; 
      height: 60px; 
    }
    
    .image-container { 
      width: 60px; 
      height: 60px; 
    }
    
    .avatar-decoration { 
      width: 74px; 
      height: 74px; 
      top: -5px; 
      left: -5px; 
    }
    
    .status-dot { 
      width: 16px; 
      height: 16px; 
      border-width: 2px; 
    }
    
    .discord-content { 
      gap: 12px; 
    }
    
    .activity-name { 
      font-size: 0.95rem; 
    }
    
    .app-icon { 
      width: 14px; 
      height: 14px; 
    }
    
    .activity-details { 
      font-size: 0.8rem; 
    }
    
    .activity-state { 
      font-size: 0.75rem; 
    }
    
    .status-line, .via-lanyard { 
      font-size: 0.7rem; 
    }
    
    .via-lanyard {
      --vertical-offset: 4px;
    }
  }

  @media (max-width: 360px) {
    .discord-container { 
      height: 130px !important; 
    }
    
    .discord-card { 
      padding: 8px; 
    }
    
    .skeleton-box { 
      width: 50px; 
      height: 50px; 
    }
    
    .image-container { 
      width: 50px; 
      height: 50px; 
    }
    
    .avatar-decoration { 
      width: 64px; 
      height: 64px; 
    }
    
    .status-dot { 
      width: 14px; 
      height: 14px; 
      border-width: 2px; 
    }
    
    .discord-content { 
      gap: 12px; 
    }
    
    .activity-name { 
      font-size: 0.9rem; 
    }
    
    .app-icon { 
      width: 12px; 
      height: 12px; 
    }
    
    .activity-details { 
      font-size: 0.75rem; 
    }
    
    .activity-state { 
      font-size: 0.7rem; 
    }
    
    .status-line, .via-lanyard { 
      font-size: 0.65rem; 
    }
    
    .via-lanyard {
      --vertical-offset: 2px; 
    }
  }
</style>