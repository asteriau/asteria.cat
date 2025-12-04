<script>
  import { onMount } from 'svelte';
  import ModelViewer from '../ModelViewer.svelte';
  
  let isHovering = false;
  let buttonRef;
  
  function handleExploreClick(event) {
    if (event.type === 'click' || (event.type === 'keydown' && (event.key === 'Enter' || event.key === ' '))) {
      event.preventDefault();
      
      // Add click animation for the button
      const button = event.currentTarget;
      button.style.transform = 'scale(0.95)';
      button.style.opacity = '0.9';
      
      setTimeout(() => {
        button.style.transform = 'scale(1)';
        button.style.opacity = '1';
        goto('/about');
      }, 150);
    }
  }

</script>

<section id="home" class="home-section">
  <div class="hero-wrapper">
    <div class="hero-container">
      <div class="hero-content">
        <h1 class="hero-title">
          hi, i'm <span class="asteria">asteria</span>!
        </h1>

        <p class="hero-summary">
          i build elegant, atmospheric interfaces with a focus on minimalism, motion,
          and immersive user experience.
        </p>

        <!-- Improved Button -->
        <button
          bind:this={buttonRef}
          class="explore-button"
          on:click={handleExploreClick}
          on:keydown={handleExploreClick}
          on:mouseenter={handleMouseEnter}
          on:mouseleave={handleMouseLeave}
          aria-label="Explore my world"
        >
          <span class="button-text">real shit?!</span>
          <svg class="button-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="button-hover-effect"></div>
        </button>
      </div>
      
      <!-- Imported 3D Model Component -->
      <div class="model-wrapper">
        <ModelViewer 
          modelUrl="/models/cirno.glb"
          scale={15}
          autoRotate={true}
          rotationSpeed={0.5}
        />
      </div>
    </div>
  </div>
</section>

<style>
  .home-section {
    color: var(--color-fg);
    overflow-x: hidden;
  }

  .hero-wrapper {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 2rem;
  }

  .hero-wrapper::before {
    content: "";
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(141, 163, 185, 0.05) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(141, 163, 185, 0.05) 0%, transparent 40%);
    z-index: -1;
    animation: pulse 8s ease-in-out infinite alternate;
  }

  @keyframes pulse {
    0% { opacity: 0.3; }
    100% { opacity: 0.7; }
  }

  .hero-container {
    width: 100%;
    max-width: 1200px;
    padding: 0 20px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    gap: 2rem;
  }

  .hero-title {
    font-size: clamp(4rem, 10vw, 6rem);
    font-weight: 350;
    letter-spacing: -2px;
    line-height: 1;
    margin: 0;
  }

  .hero-summary {
    max-width: 600px;
    font-size: clamp(1.25rem, 2.5vw, 1.75rem);
    line-height: 1.5;
    font-weight: 300;
    opacity: 0.8;
    margin: 0;
    padding-left: 0.5rem;
    border-left: 1px solid rgba(141, 163, 185, 0.2);
  }

  .explore-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 2.5rem;
    background: rgba(141, 163, 185, 0.1);
    border: 1px solid rgba(141, 163, 185, 0.2);
    border-radius: 50px;
    color: var(--color-fg);
    font-size: 1.125rem;
    font-weight: 300;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    isolation: isolate;
    margin-top: 1rem;
    outline: none;
  }

  .explore-button::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(141, 163, 185, 0.15) 0%,
      rgba(141, 163, 185, 0.05) 100%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
  }

  .explore-button:hover {
    background: rgba(141, 163, 185, 0.15);
    border-color: var(--main-accent);
    transform: translateY(-2px);
    box-shadow: 
      0 10px 30px rgba(141, 163, 185, 0.15),
      0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .explore-button:hover::before {
    opacity: 1;
  }

  .explore-button:hover .button-text {
    letter-spacing: 0.1em;
  }

  .explore-button:hover .button-arrow {
    transform: translateX(6px);
  }

  .explore-button:active {
    transform: translateY(-1px) scale(0.98);
  }

  .explore-button:focus-visible {
    outline: 2px solid var(--main-accent);
    outline-offset: 4px;
  }

  .button-text {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .button-arrow {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .button-hover-effect {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(141, 163, 185, 0.1) 0%,
      transparent 50%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: -1;
  }

  .explore-button:hover .button-hover-effect {
    opacity: 1;
  }

  .model-wrapper {
    width: 100%;
    height: 500px;
    border-radius: 20px;
    overflow: hidden;
  }

  .asteria {
    position: relative;
    display: inline-block;
    color: var(--main-accent);
    transition: all 0.4s ease;
  }

  .asteria::before {
    content: "";
    position: absolute;
    inset: -4px;
    background: radial-gradient(circle at center, 
      var(--main-accent) 0%, 
      transparent 70%);
    filter: blur(12px);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.4s ease;
  }

  .asteria:hover::before {
    opacity: 0.4;
  }

  @media (max-width: 1024px) {
    .hero-container {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
    
    .model-wrapper {
      height: 400px;
      order: -1;
      margin-bottom: 1rem;
    }
    
    .hero-content {
      text-align: center;
      align-items: center;
    }
    
    .hero-summary {
      text-align: center;
      padding-left: 0;
      border-left: none;
    }
  }

  @media (max-width: 768px) {
    .hero-content {
      align-items: center;
      text-align: center;
    }
    
    .hero-summary {
      padding-left: 0;
      border-left: none;
      text-align: center;
      max-width: 90%;
    }
    
    .hero-title {
      font-size: 3rem;
      text-align: center;
    }
    
    .model-wrapper {
      height: 350px;
    }
    
    .explore-button {
      padding: 1.125rem 2.25rem;
      font-size: 1.0625rem;
    }
    
    .button-text {
      font-size: 1.125rem;
    }
  }

  @media (max-width: 480px) {
    .hero-title {
      font-size: 2.5rem;
    }
    
    .hero-summary {
      font-size: 1.125rem;
    }
    
    .model-wrapper {
      height: 300px;
    }
    
    .explore-button {
      padding: 1rem 2rem;
      width: 100%;
      justify-content: center;
    }
  }
</style>