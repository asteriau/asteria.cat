<footer class="footer">
  <p>
    Made with <span class="heart">❤</span> by 
    <a href="https://github.com/asteriau" target="_blank" rel="noopener noreferrer">asteria</a>
  </p>
  <p>
    Site licensed under 
    <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" rel="noopener noreferrer">GPL v3</a> • 
    <a href="https://github.com/asteriau/asteria.moe" class="source-link">Site Source</a>
  </p>
</footer>

<style>
.footer a {
    position: relative;
    display: inline-block;
    transition: filter 0.3s ease, text-shadow 0.3s ease;
}

.footer a::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -3px;
    width: 100%;
    height: 2px;
    background: var(--main-accent);
    opacity: 0;
    transform: scaleX(0);
    transform-origin: left;
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.footer a:hover {
    filter: brightness(1.15);
    text-shadow: 0 0 10px var(--main-accent),
                 0 0 50px var(--main-accent);
}

.footer a:hover::after {
    opacity: 1;
    transform: scaleX(1);
}
</style>
