<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  type NavItem = {
    path: string;
    label: string;
    iconSVG: string;
  };

  const items: NavItem[] = [
    {
      path: '/',
      label: 'home',
      iconSVG: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#8DA3B9"><path d="M187.27-147.27v-440L480-807.69l292.73 220.65v439.77H558.27v-264.46H401.92v264.46H187.27Z"/></svg>`
    },
    {
      path: '/about',
      label: 'about',
      iconSVG: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#8DA3B9"><path d="M452.42-294.04h55.96v-225.15h-55.96v225.15Zm27.47-291.19q13.23 0 22.01-8.68 8.79-8.69 8.79-21.91t-8.68-22.01q-8.68-8.78-21.9-8.78-13.23 0-22.01 8.68-8.79 8.68-8.79 21.9 0 13.22 8.68 22.01 8.68 8.79 21.9 8.79Zm.2 477.15q-77.15 0-145.06-29.32-67.92-29.33-118.16-79.6-50.23-50.27-79.51-118.05-29.28-67.79-29.28-144.86 0-77.15 29.32-145.06 29.33-67.92 79.6-118.16 50.27-50.23 118.05-79.51 67.79-29.28 144.86-29.28 77.15 0 145.06 29.32 67.92 29.33 118.16 79.6 50.23 50.27 79.51 118.05 29.28 67.79 29.28 144.86 0 77.15-29.32 145.06-29.33 67.92-79.6 118.16-50.27 50.23-118.05 79.51-67.79 29.28-144.86 29.28Z"/></svg>`
    },
    {
      path: '/projects',
      label: 'projects',
      iconSVG: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#8DA3B9"><path d="m384.81-353.89 39.73-40.03L338.46-480l85.39-85.38-39.73-40.04L258.69-480l126.12 126.11Zm190.38 0L701.31-480 575.19-606.11l-39.73 39.84L621.73-480l-86.27 86.08 39.73 40.03ZM215.54-147.27q-28.5 0-48.38-19.89-19.89-19.88-19.89-48.38v-528.92q0-28.5 19.89-48.38 19.88-19.89 48.38-19.89h528.92q28.5 0 48.38 19.89 19.89 19.88 19.89 48.38v528.92q0 28.5-19.89 48.38-19.88 19.89-48.38 19.89H215.54Z"/></svg>`
    },
    {
      path: '/contact',
      label: 'contact',
      iconSVG: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#8DA3B9"><path d="M108.08-130.58v-653.9q0-28.42 19.91-48.33 19.92-19.92 48.27-19.92h607.48q28.35 0 48.27 19.92 19.91 19.91 19.91 48.27v449.08q0 28.36-19.91 48.27-19.92 19.92-48.27 19.92H244.77L108.08-130.58Zm146.77-283.46h292.73V-470H254.85v55.96Zm0-118.38h450.3v-55.96h-450.3v55.96Zm0-118.39h450.3v-55.96h-450.3v55.96Z"/></svg>`
    }
  ];

  $: currentPath = $page.url.pathname;

  function navigate(event: Event, path: string) {
    event.preventDefault();
    if (currentPath === path) return;
    goto(path);
  }
</script>

<nav class="mobile-nav">
  <ul>
    {#each items as item}
      <li class:selected={currentPath === item.path}>
        <button type="button" on:click={(e) => navigate(e, item.path)}>
          <div class="icon-container">
            {@html item.iconSVG}
          </div>
          <span class="label">{item.label}</span>
        </button>
      </li>
    {/each}
  </ul>
</nav>

<style>
  .mobile-nav {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 64px;
    background: rgba(21, 21, 21, 0.96);
    border-top: 0.5px solid var(--color-border);
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.5);
    z-index: 110;
    display: none;
    justify-content: center;
  }

  .mobile-nav ul {
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin: 0;
    padding: 0 16px;
    gap: 28px;
  }

  .mobile-nav li {
    flex: 0 0 auto;
    text-align: center;
  }

  .mobile-nav button {
    min-width: 56px;
    height: 100%;
    padding: 6px 4px;
    border: none;
    background: transparent;
    color: var(--color-fg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;
    border-radius: 999px;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    text-transform: lowercase;
    transition: background-color 0.25s ease, transform 0.25s ease, color 0.25s ease;
  }

  .mobile-nav .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 28px;
    border-radius: 999px;
    background: transparent;
    transition: background 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease, filter 0.35s ease;
  }

  .mobile-nav .icon-container svg {
    width: 24px;
    height: 24px;
    fill: var(--color-fg);
    transition: fill 0.25s ease, filter 0.25s ease;
  }

  .mobile-nav .label {
    opacity: 0.8;
    transition: opacity 0.25s ease, color 0.25s ease, text-shadow 0.25s ease;
  }

  .mobile-nav li.selected .label,
  .mobile-nav button:hover .label {
    opacity: 1;
    color: var(--main-accent);
    filter: brightness(1.15);
    text-shadow: 0 0 10px var(--main-accent), 0 0 50px var(--main-accent);
  }

  .mobile-nav li.selected .icon-container svg,
  .mobile-nav button:hover .icon-container svg {
    fill: var(--main-accent);
    filter: brightness(1.15) drop-shadow(0 0 10px var(--main-accent)) drop-shadow(0 0 50px var(--main-accent));
  }

  .mobile-nav li.selected .icon-container {
    transform: scale(1.1);
    background: rgba(141, 163, 185, 0.12);
  }

  .mobile-nav li.selected .icon-container svg {
    filter: brightness(1.25);
  }

  @media (max-width: 768px) {
    .mobile-nav {
      display: flex;
    }
  }
</style>