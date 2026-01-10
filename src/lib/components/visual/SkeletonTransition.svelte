<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  
  export let isLoading = false;
  export let data: any = null;
  
  let hasLoaded = false;
  
  $: if (data && !hasLoaded) {
    hasLoaded = true;
  }
  
  $: if (!data) {
    hasLoaded = false;
  }
</script>

{#if isLoading || !data}
  <!-- Skeleton state -->
  <div 
    class="skeleton-mode" 
    transition:fade={{ duration: 300 }}
  >
    <slot name="skeleton" {data}>
      <!-- Default skeleton if no slot provided -->
      <div class="default-skeleton" />
    </slot>
  </div>
{:else}
  <!-- Real content -->
  <div 
    class="content-mode"
    in:fly={{ y: 20, duration: 500, easing: 'easeOut' }}
    out:fade={{ duration: 200 }}
  >
    <slot {data} {hasLoaded} />
  </div>
{/if}

<style>
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .skeleton-mode {
    width: 100%;
    height: 100%;
    
    /* Apply skeleton effect to all children */
    :global(*) {
      color: transparent !important;
      position: relative;
      overflow: hidden;
      
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.05) 50%,
          rgba(255, 255, 255, 0) 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: inherit;
        pointer-events: none;
      }
    }
    
    /* Hide images/visual elements */
    :global(img),
    :global(svg),
    :global(video),
    :global(canvas),
    :global(.visualizer *) {
      opacity: 0 !important;
    }
    
    /* Keep backgrounds visible but dimmed */
    :global(*):not(img):not(svg):not(video):not(canvas) {
      background: rgba(255, 255, 255, 0.03) !important;
    }
    
    /* Keep borders but dim them */
    :global(*) {
      border-color: rgba(255, 255, 255, 0.05) !important;
    }
  }
  
  .content-mode {
    width: 100%;
    height: 100%;
    animation: fadeIn 0.3s ease-out;
  }
  
  .default-skeleton {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.08) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
  }
</style>