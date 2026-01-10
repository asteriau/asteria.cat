<section id="contact" class="section contact-section">
  <div class="section-content">
    <h2 class="section-title">contact</h2>
    <p class="contact-subtitle">
      best ways to reach me, and places I exist online
    </p>

    <div class="contact-grid">
      <a
        href="https://discord.com/users/444582693255249950"
        target="_blank"
        rel="noopener noreferrer"
        class="contact-card"
      >
        <img src="/icons/discord.svg" alt="" class="contact-icon" />
        <div class="contact-text">
          <span class="contact-name">Discord</span>
          <span class="contact-handle">@asteriau</span>
        </div>
      </a>

      <a
        href="https://t.me/obregia"
        target="_blank"
        rel="noopener noreferrer"
        class="contact-card"
      >
        <img src="/icons/telegram.svg" alt="" class="contact-icon" />
        <div class="contact-text">
          <span class="contact-name">Telegram</span>
          <span class="contact-handle">@obregia</span>
        </div>
      </a>

      <a
        href="https://github.com/asteriau"
        target="_blank"
        rel="noopener noreferrer"
        class="contact-card"
      >
        <img src="/icons/github.svg" alt="" class="contact-icon" />
        <div class="contact-text">
          <span class="contact-name">GitHub</span>
          <span class="contact-handle">@asteriau</span>
        </div>
      </a>

      <a
        href="https://steamcommunity.com/id/asteriau"
        target="_blank"
        rel="noopener noreferrer"
        class="contact-card"
      >
        <img src="/icons/steam.svg" alt="" class="contact-icon" />
        <div class="contact-text">
          <span class="contact-name">Steam</span>
          <span class="contact-handle">@asteriau</span>
        </div>
      </a>
    </div>
  </div>
</section>

<style>
.contact-section {
  padding-top: 80px;
}

.contact-subtitle {
  font-size: 0.95rem;
  opacity: 0.65;
  margin-bottom: 48px;
  line-height: 1.5;
  max-width: 420px;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.contact-card {
  background: rgba(21, 21, 21, 0.6);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 16px 18px;

  display: flex;
  align-items: center;
  gap: 14px;

  text-decoration: none;
  color: var(--color-fg);

  backdrop-filter: blur(12px);
  transition:
    border-color 0.3s ease,
    transform 0.25s ease,
    box-shadow 0.25s ease;

  min-height: 70px;
}

.contact-card:hover {
  border-color: color-mix(
    in srgb,
    var(--main-accent) 45%,
    var(--color-border)
  );
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.contact-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  opacity: 0.9;
}

.contact-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  flex: 1;
  transition: transform 0.25s ease;
}

.contact-card:hover .contact-text {
  transform: translateX(2px);
}

.contact-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--main-accent);
  line-height: 1.25;
  letter-spacing: 0.01em;
}

.contact-handle {
  margin-top: 2px;
  font-size: 0.85rem;
  opacity: 0.55;
  line-height: 1.2;
  letter-spacing: 0.02em;
}

@media (max-width: 480px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }

  .contact-card {
    padding: 14px 16px;
    min-height: 65px;
  }
}
</style>
