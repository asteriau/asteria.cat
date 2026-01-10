<script lang="ts">
  import { onMount } from "svelte";
  import languageColors from "$lib/colors.json";

  const REPOSITORIES = [
    "https://api.github.com/repos/asteriau/asteria.moe",
    "https://api.github.com/repos/asteriau/Whimsy",
    "https://api.github.com/repos/asteriau/dotfiles"
  ];

  interface Repository {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    language: string | null;
    updated_at: string;
    owner: {
      login: string;
      avatar_url: string;
    };
  }

  let repositories: Repository[] = [];
  let isLoading = true;

  const getLanguageColor = (language: string | null) =>
    languageColors[language ?? ""]?.color ?? "#ccc";

  async function fetchRepo(url: string, headers: HeadersInit) {
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) return null;
      return (await res.json()) as Repository;
    } catch {
      return null;
    }
  }

  function formatUpdated(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);

    if (days < 1) return "updated today";
    if (days === 1) return "updated yesterday";
    if (days < 30) return `updated ${days} days ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `updated ${months} month${months > 1 ? "s" : ""} ago`;

    const years = Math.floor(months / 12);
    return `updated ${years} year${years > 1 ? "s" : ""} ago`;
  }

  onMount(async () => {
    const token = import.meta.env.VITE_GITHUB_TOKEN;

    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      ...(token && { Authorization: `Bearer ${token}` })
    };

    const results = await Promise.all(
      REPOSITORIES.map(url => fetchRepo(url, headers))
    );

    repositories = results.filter(
      (repo): repo is Repository => repo !== null
    );

    isLoading = false;
  });
</script>

<section id="projects" class="section">
  <div class="section-content">
    <h2 class="section-title">projects</h2>
    <p class="hero-summary">
      here are some of the projects i've made or contributed to
    </p>

    {#if isLoading}
      <div class="loading">
        <div class="loading-spinner" />
        <p>loading repos..</p>
      </div>
    {:else if repositories.length === 0}
      <div class="empty">
        <p>no repos to display</p>
      </div>
    {:else}
      <div class="projects-grid">
        {#each repositories as repo (repo.id)}
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            class="project-card"
            aria-label={`View ${repo.full_name} on GitHub`}
          >
            <div class="project-card-inner">
              <header class="project-header">
                <img
                  src={`${repo.owner.avatar_url}?s=64`}
                  alt={repo.owner.login}
                  class="avatar"
                />

                <div class="project-name">
                  <span class="owner">{repo.owner.login}</span>
                  <span class="separator">/</span>
                  <span class="name">{repo.name}</span>
                </div>

                <span class="external-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <path d="M15 3h6v6" />
                    <path d="M10 14 21 3" />
                  </svg>
                </span>
              </header>

              <p class="project-description">
                {repo.description || "No description provided"}
              </p>

              <footer class="project-stats">
                <span class="updated">{formatUpdated(repo.updated_at)}</span>

                {#if repo.language}
                  <div
                    class="language"
                    style="--lang-color: {getLanguageColor(repo.language)}"
                  >
                    <span class="language-dot" />
                    {repo.language}
                  </div>
                {/if}
              </footer>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .section {
    display: flex;
    justify-content: center;
    padding: 60px 40px;
  }

  .section-content {
    max-width: 1200px;
    width: 100%;
    text-align: center;
  }

  .section-title {
    color: var(--main-accent);
    font-size: var(--font-size-large);
    font-weight: normal;
    margin-bottom: 30px;
    text-shadow: var(--text-shadow);
  }

  .hero-summary {
    font-size: var(--font-size-small);
    margin-bottom: 40px;
    opacity: 0.8;
  }

  .projects-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .project-card {
    text-decoration: none;
    color: inherit;
  }

  .project-card-inner {
    padding: 24px 26px;
    background: rgba(21, 21, 21, 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    transition: transform 0.3s ease, border-color 0.3s ease;
  }

  .project-card:hover .project-card-inner {
    transform: translateY(-2px);
    border-color: rgba(141, 163, 185, 0.25);
  }

  .project-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
    position: relative;
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid var(--color-border);
  }

  .project-name {
    display: flex;
    gap: 6px;
    font-size: 1rem;
    line-height: 1.3;
  }

  .owner {
    opacity: 0.6;
  }

  .separator {
    opacity: 0.4;
  }

  .name {
    color: var(--main-accent);
    font-weight: 500;
  }

  .external-icon {
    position: absolute;
    right: 0;
    top: 2px;
    opacity: 0.3;
    transition: opacity 0.3s ease;
  }

  .project-card:hover .external-icon {
    opacity: 0.6;
  }

  .external-icon svg {
    width: 15px;
    height: 15px;
  }

  .project-description {
    font-size: 0.95rem;
    line-height: 1.7;
    opacity: 0.75;
    margin-bottom: 20px;
    text-align: left;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .project-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    opacity: 0.75;
  }

  .updated {
    font-size: 0.85rem;
    opacity: 0.55;
    letter-spacing: 0.2px;
    white-space: nowrap;
  }

  .project-card:hover .updated {
    opacity: 0.7;
  }

  .language {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
  }

  .language-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--lang-color);
  }

  @media (min-width: 768px) {
    .projects-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .project-name {
      flex-direction: column;
      gap: 2px;
    }

    .separator {
      display: none;
    }
  }
</style>
