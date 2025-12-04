<script lang="ts">
  import { writable } from 'svelte/store';
  import { fade } from 'svelte/transition';
  import Navbar from '../Navbar.svelte';
  import Home from '../sections/Home.svelte';
  import About from '../sections/About.svelte';
  import Projects from '../sections/Projects.svelte';
  import Contact from '../sections/Contact.svelte';

  const route = writable('/');

  let current: string;
  route.subscribe((v) => current = v);

  function go(e: Event, path: string) {
    e.preventDefault();
    route.set(path);
  }
</script>

<Navbar {current} {go} />

<main class="main-content">
  <!-- Stack container keeps relative flow -->
  <div class="page-stack">
    {#if current === '/'}
      <div class="page" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
        <Home />
      </div>
    {:else if current === '/about'}
      <div class="page" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
        <About />
      </div>
    {:else if current === '/projects'}
      <div class="page" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
        <Projects />
      </div>
    {:else if current === '/contact'}
      <div class="page" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
        <Contact />
      </div>
    {/if}
  </div>
</main>

<style>
.main-content {
  position: relative;
  width: 100%;
  height: 100vh;
}

.page-stack {
  position: relative;
  width: 100%;
  height: 100%;
}

.page {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

  .model-wrapper {
    position: relative;
    width: 100%;
    height: 500px; 
    overflow: hidden;
    border-radius: 20px;
  }
</style>
