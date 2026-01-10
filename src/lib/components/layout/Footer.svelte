<footer class="footer">
  <div class="footer-inner">
    <div class="footer-primary">
      <span class="footer-label">asteria.cat</span>
      <span class="footer-meta">
        made with <span class="heart">❤</span> by
        <a href="https://github.com/asteriau" target="_blank" rel="noopener noreferrer" class="footer-link">
          <span class="label">asteria</span>
          <span class="underline"></span>
        </a>
      </span>
    </div>
  </div>
</footer>

<style>
.footer {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: center;
    flex-shrink: 0;
    padding: 18px 24px;
    background: rgba(21, 21, 21, 0.8);
    border-top: 1px solid var(--color-border);
    color: var(--color-fg);
    font-size: 0.85rem;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}

.footer-inner {
    position: relative;
    width: 100%;
    max-width: 960px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
}

.footer-primary {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    margin: 0 auto;
    text-align: center;
}

.footer-label {
    font-size: 0.85rem;
    color: var(--main-accent); 
}

.footer-meta {
    opacity: 0.85; 
}

.footer-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: var(--main-accent); 
    opacity: 1; 
    text-decoration: none;
    padding: 4px 0;
    transition: color 0.3s ease;
    font-family: var(--font-main);
    font-weight: 400;
    letter-spacing: 0.02em;
    text-transform: lowercase;
}

.footer-link .label {
    opacity: 1; 
    color: var(--main-accent);
    transition: none; 
}

.footer-link .underline {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 24px;
    height: 2px;
    background: var(--main-accent);
    border-radius: 1px;
    transition: transform 0.3s ease, opacity 0.3s ease;
    opacity: 0;
}

.footer-link:hover .underline {
    transform: translateX(-50%) scaleX(0.6);
    opacity: 0.5;
}

.heart {
    color: var(--main-accent);
    transition: transform var(--transition-duration) ease;
}

@media (max-width: 768px) {
    .footer {
        padding: 16px 20px 80px;
        background: transparent;
        border-top: none;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        box-shadow: none;
    }

    .footer-inner {
        position: static;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }

    .footer-meta {
        font-size: 12px;
    }
}
</style>
