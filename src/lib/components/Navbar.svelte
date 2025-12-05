<script lang="ts">
  import LightRays from './LightRays.svelte';
  import { onMount, afterUpdate } from 'svelte';

  export let current: string;
  export let go: (event: Event, path: string) => void;

  let navContainer: HTMLElement | null = null;
  let navIndicator: HTMLDivElement | null = null;

  function updateIndicatorPosition() {
    if (!navContainer || !navIndicator) return;

    const activeLink = navContainer.querySelector('.nav-link.active') as HTMLElement | null;
    if (!activeLink) return;

    const linkRect = activeLink.getBoundingClientRect();
    const containerRect = navContainer.getBoundingClientRect();
    const relativeLeft = linkRect.left - containerRect.left;

    navIndicator.style.width = `${linkRect.width}px`;
    navIndicator.style.left = `${relativeLeft}px`;
    navIndicator.style.bottom = '0';
  }

  onMount(() => {
    navIndicator = document.createElement('div');
    navIndicator.className = 'nav-indicator';
    navContainer?.appendChild(navIndicator);

    updateIndicatorPosition();
    window.addEventListener('resize', updateIndicatorPosition);

    return () => {
      window.removeEventListener('resize', updateIndicatorPosition);
      if (navIndicator && navIndicator.parentNode) {
        navIndicator.parentNode.removeChild(navIndicator);
      }
    };
  });

  afterUpdate(() => {
    updateIndicatorPosition();
  });
</script>

<LightRays />

<nav bind:this={navContainer} class="navbar">
  <div class="nav-container">
    <ul class="nav-menu">
      <li><a href="/" on:click={(e) => go(e, '/')} class:active={current === '/'} class="nav-link">home</a></li>
      <li><a href="/about" on:click={(e) => go(e, '/about')} class:active={current === '/about'} class="nav-link">about</a></li>
      <li><a href="/projects" on:click={(e) => go(e, '/projects')} class:active={current === '/projects'} class="nav-link">projects</a></li>
      <li><a href="/contact" on:click={(e) => go(e, '/contact')} class:active={current === '/contact'} class="nav-link">contact</a></li>
    </ul>
  </div>
</nav>