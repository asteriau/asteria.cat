<script>
  import RichPresence from '$lib/components/presence/RichPresence.svelte';

  const DISCORD_ID = "444582693255249950";
</script>

<section id="home" class="section home-section">
  <header class="hero">
    <h1 class="hero-title">
      about <span class="accent">me</span>
    </h1>
    <p class="hero-tagline">#1 procrastinator</p>
  </header>

  <div class="content-wrapper">
    <div class="bio-box">
      <p>
        Hi, I'm <span class="name-gradient">asteria</span>!
      </p>

      <p>
        I'm a jack-of-all-trades who mostly does web dev and software dev on the side
      </p>

      <p>
        Currently experimenting with every framework known to man making silly sites like this one
      </p>

      <p>
        I also really love all kinds of music, especially shoegaze!
      </p>

      <p class="whisper"></p>
    </div>

    <div class="divider"></div>

    <div class="activity-section">
      <div class="section-header">
        <h2 class="section-title">
          my <span class="accent">activity</span>
        </h2>
        <p class="section-tagline">what i'm up to right now :O</p>
      </div>

      <div class="rpc-card">
        <RichPresence discordId={DISCORD_ID} />
      </div>
    </div>
  </div>
</section>

<style>
  .section.home-section {
    flex: 0 0 auto;
    padding: 0;
  }

  .hero {
    padding: 50px 20px 30px;
    text-align: center;
  }

  h1.hero-title,
  .section-title {
    font-size: clamp(2.5rem, 8vw, 3.5rem);
    font-weight: 300;
    letter-spacing: -1px;
    line-height: 1.1;
    margin: 0 0 0.75rem 0;
    color: var(--color-fg);
  }

  .hero-title .accent,
  .section-title .accent {
    color: var(--main-accent);
    font-weight: 400;
  }

  .hero-tagline,
  .section-tagline {
    font-size: 1rem;
    font-weight: 400;
    color: var(--main-accent);
    opacity: 0.8;
    margin: 0;
    letter-spacing: 0.3px;
  }

  .content-wrapper {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px 60px;
  }

  .bio-box {
    background: rgba(21, 21, 21, 0.1);
    border-radius: 16px;
    backdrop-filter: blur(12px);
    padding: 28px 32px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s ease, transform 0.3s ease;
  }

  .bio-box::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--main-accent),
      transparent
    );
    opacity: 0.3;
  }

  .bio-box:hover {
    border-color: rgba(141, 163, 185, 0.3);
    transform: translateY(-2px);
  }

  .bio-box p {
    font-size: 1.02rem;
    color: var(--color-fg);
    opacity: 0.7;
  }

  .bio-box p:first-of-type {
    font-size: 1.08rem;
  }

  .bio-box p:last-child {
    margin-bottom: 0;
  }

  .divider {
    width: 60px;
    height: 1px;
    background: var(--color-border);
    margin: 15px auto;
  }

  .activity-section {
    text-align: center;
  }

  .section-header {
    text-align: center;
    margin-bottom: 24px;
  }

  .rpc-card {
    background: rgba(21, 21, 21, 0.1);
    border-radius: 16px;
    backdrop-filter: blur(12px);
    padding: 24px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s ease, transform 0.3s ease;
    text-align: left;
  }

  .rpc-card::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--main-accent),
      transparent
    );
    opacity: 0.3;
  }

  .rpc-card:hover {
    border-color: rgba(141, 163, 185, 0.3);
    transform: translateY(-2px);
  }

  .rpc-card :global(.rpc-container) {
    width: 100%;
  }

  .name-gradient {
    background: linear-gradient(
      120deg,
      var(--color-fg),
      var(--main-accent),
      var(--color-fg)
    );
    background-size: 300% 300%;
    animation: gradient-shift 4s ease infinite;

    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;

    font-weight: 500;
    text-shadow: 0 0 12px
      color-mix(in srgb, var(--main-accent) 25%, transparent);
  }

  @keyframes gradient-shift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @media screen and (max-width: 768px) {
    .hero {
      padding: 40px 16px 24px;
    }

    h1.hero-title,
    .section-title {
      font-size: clamp(1.5rem, 5vw, 2rem);
    }

    .hero-tagline,
    .section-tagline {
      font-size: 0.9rem;
    }

    .content-wrapper {
      padding: 0 16px 40px;
    }

    .bio-box {
      padding: 22px 24px;
      border-radius: 12px;
    }

    .bio-box p {
      font-size: 0.95rem;
      line-height: 1.7;
    }

    .divider {
      margin: 24px auto;
    }

    .section-header {
      margin-bottom: 16px;
    }

    .rpc-card {
      padding: 16px;
      border-radius: 12px;
    }
  }

  @media screen and (max-width: 480px) {
    .hero {
      padding: 32px 16px 20px;
    }

    h1.hero-title,
    .section-title {
      font-size: 2.25rem;
    }

    .content-wrapper {
      padding: 0 16px 32px;
    }

    .bio-box {
      padding: 18px 20px;
    }

    .bio-box p {
      font-size: 0.9rem;
    }

    .divider {
      margin: 20px auto;
    }

    .section-header {
      margin-bottom: 12px;
    }

    .hero-tagline,
    .section-tagline {
      font-size: 0.85rem;
    }
  }
</style>
