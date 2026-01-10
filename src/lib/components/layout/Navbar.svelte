<script lang="ts">
  import LightRays from '$lib/components/layout/LightRays.svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  type NavItem = {
    path: string;
    label: string;
  };

  const items: NavItem[] = [
    { path: '/', label: 'home' },
    { path: '/about', label: 'about' },
    { path: '/contact', label: 'contact' },
    { path: '/projects', label: 'projects' }
  ];

  $: currentPath = $page.url.pathname;

  function navigate(event: Event, path: string) {
    event.preventDefault();
    if (currentPath === path) return;
    goto(path);
  }
</script>

<LightRays />

<nav class="navbar">
  <ul class="nav-menu">
    {#each items as item}
      <li>
        <button
          type="button"
          class="nav-link"
          class:active={currentPath === item.path}
          on:click={(e) => navigate(e, item.path)}
        >
          <span class="label">{item.label}</span>
          <span class="underline"></span>
        </button>
      </li>
    {/each}
  </ul>
</nav>

<style>
  .navbar {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: var(--navbar-height);
    background: rgba(21, 21, 21, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--color-border);
    z-index: 110;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .nav-menu {
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin: 0;
    padding: 0;
    gap: 8px;
  }

  .nav-menu li {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .nav-link {
    position: relative;
    padding: 8px 20px;
    border: none;
    background: transparent;
    color: var(--color-fg);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 400;
    letter-spacing: 0.02em;
    text-transform: lowercase;
    transition: color 0.3s ease;
    font-family: var(--font-main);
  }

  .label {
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }

  .nav-link:hover .label,
  .nav-link.active .label {
    opacity: 1;
  }

  .nav-link.active .label {
    color: var(--main-accent);
  }

  .underline {
    position: absolute;
    bottom: -1px;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 24px;
    height: 2px;
    background: var(--main-accent);
    border-radius: 1px;
    transition: transform 0.3s ease, opacity 0.3s ease;
    opacity: 0;
  }

  .nav-link.active .underline {
    transform: translateX(-50%) scaleX(1);
    opacity: 1;
  }

  .nav-link:hover .underline {
    transform: translateX(-50%) scaleX(0.6);
    opacity: 0.5;
  }

  .nav-link.active:hover .underline {
    transform: translateX(-50%) scaleX(1);
    opacity: 1;
  }

  @media (max-width: 768px) {
    .navbar {
      display: none;
    }
  }
</style>
