<script lang="ts">
  import Footer from '$lib/components/layout/Footer.svelte';
  import Navbar from '$lib/components/layout/Navbar.svelte';
  import MobileNav from '$lib/components/layout/MobileNav.svelte';
  import "../app.css";

  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';

  export let title = "asteria's website";
  export let description = "meow meow meow meow meow meow";
  export let canonicalUrl = "/";
  export let socialImageUrl = "/social-image.png";

  // Typing animation for document.title
  onMount(() => {

    const fullTitle = "asteria";
    let current = "";
    let index = 0;
    let typing = true;
    const placeholder = "•";

    function typeTitle() {
      if (typing) {
        current += fullTitle[index];
        index++;
        document.title = current;
        if (index === fullTitle.length) {
          typing = false;
          setTimeout(typeTitle, 1000);
          return;
        }
        setTimeout(typeTitle, 200);
      } else {
        current = current.slice(0, -1);
        document.title = current.length ? current : placeholder;
        if (current.length === 0) {
          typing = true;
          index = 0;
        }
        setTimeout(typeTitle, 100);
      }
    }

    typeTitle();
  });
</script>

<svelte:head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#8DA3B9" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalUrl} />

  <!-- Open Graph -->
  <meta property="og:site_name" content="asteria.himejoshi.gay" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={socialImageUrl} />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:site" content="@asteriau" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={socialImageUrl} />

  <link rel="icon" href="/favicon.ico" type="image/x-icon" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
</svelte:head>

<Navbar />

<main class="main-content">
  {#key $page.url.pathname}
    <div
      in:fade={{ duration: 350, easing: cubicInOut }}
    >
      <slot />
    </div>
  {/key}
</main>

<MobileNav />
<Footer />
