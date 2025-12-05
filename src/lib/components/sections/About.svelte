<script>
  import Discord from '$lib/data/Discord.svelte';
  const DISCORD_ID = "444582693255249950";
</script>

<section id="home" class="section home-section">
  <div class="home-container">
    <h1 class="hero-title">
      about <span class="asteria">me</span>!
    </h1>

    <p class="hero-summary">
      i make (and break) silly websites
    </p>
  </div>

  <div class="bio-box">
    <p>
      I've been obsessed with anything meaning design from a young age <br>
      since then i've become every backend developer's worst nightmare (sorry not sorry) <br>
      whenever i have free time i bedrot and read yuri
    </p>

    <p>
      how are you still reading this
    </p>
  </div> 

  <div class="home-container">
    <h2 class="section-title">
      <span class="asteria">activity</span>
    </h2>

    <p class="hero-summary">
    stalk me
    <p/>


    <div class="rpc-card">
      <RichPresence discordId={DISCORD_ID} />
    </div>
  </div>
</section>

<style>
body {
  color: var(--color-fg)
}

h1.hero-title {
  font-size: 3rem;
  font-weight: 400; 
  letter-spacing: -0.5px;
  line-height: 1.2;
  margin-bottom: 1rem;
}

h2.section-title {
  font-size: 3rem;
  font-weight: 500; 
  letter-spacing: -0.3px;
  margin-bottom: 1rem;
}

.hero-summary {
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.8;
  color: var(--color-fg);
  margin-bottom: 2rem;
}

.bio-box p {
  font-size: 1.125rem;
  line-height: 1.75;
  margin-bottom: 1rem;
  letter-spacing: 0.2px;
  color: var(--color-fg);
}

.asteria {
  position: relative;
  display: inline-block;
  font-weight: 400;
  transition: filter 0.3s ease, text-shadow 0.3s ease;
}

.asteria::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
  height: 2px;
  background: var(--main-accent);
  opacity: 0;
  transform: scaleX(0);
  transform-origin: left;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.asteria:hover {
  filter: brightness(1.15);
  text-shadow: 0 0 8px var(--main-accent), 0 0 30px var(--main-accent);
}

.asteria:hover::after {
  opacity: 1;
  transform: scaleX(1);
}

.home-section {
  display: block;
  padding: 50px 20px;
}

.home-container {
  text-align: left;
  margin: 0 auto;
  max-width: 900px;
}

.bio-box {
  margin: 30px auto;
  max-width: 900px;
  width: 100%;
  background: rgba(21, 21, 21, 0.95);
  border: 0.5px solid var(--color-border);
  border-radius: 12px;
  backdrop-filter: blur(12px);
  box-shadow: var(--box-shadow);
  padding: 25px 30px;
  overflow: auto; 
}

.rpc-card {
  margin: 30px auto;
  max-width: 900px;
  width: 100%;
  background: rgba(21, 21, 21, 0.85);
  border: 0.5px solid var(--color-border);
  border-radius: 12px;
  backdrop-filter: blur(12px);
  box-shadow: var(--box-shadow);
  padding: 25px 30px;
  display: flex;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.rpc-card :global(.rpc-container) {
  width: 100%;
}

@media screen and (max-width: 768px) {
  h1.hero-title {
    font-size: 2.25rem;
  }

  h2.section-title {
    font-size: 1.75rem;
  }

  .hero-summary, .bio-box p {
    font-size: 1rem;
  }

  .bio-box, .rpc-card {
    padding: 20px;
    margin: 20px auto; 
  }
}
</style>