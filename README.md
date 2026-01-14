# asteria.cat 💙

My overly-engineered website built with next.js

### Prerequisites

- Node.js 18+ 
- npm, pnpm or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
bun install
```

3. Copy `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## Environment Variables

- `NEXT_PUBLIC_DISCORD_ID` - Your Discord user ID
- `NEXT_PUBLIC_LASTFM_API_KEY` - Your Last.fm API key 
- `NEXT_PUBLIC_LASTFM_USERNAME` - Your Last.fm username 
- `NEXT_PUBLIC_GITHUB_TOKEN` - GitHub personal access token 

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── activity/     # Discord/Spotify presence components
│   ├── layout/       # Layout components (Navbar, Footer, etc.)
│   ├── ui/           # Reusable UI components
│   └── visual/       # 3D stuff
├── hooks/            # Custom React hooks
├── lib/              # Utilities and API clients
└── types/            # TypeScript type definitions
```

## Build

```bash
bun run build
```
