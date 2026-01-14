export const DISCORD_ID = '444582693255249950'

export const NAV_ITEMS = [
	{ path: '/', label: 'home' },
	{ path: '/about', label: 'about' },
	{ path: '/contact', label: 'contact' },
	{ path: '/projects', label: 'projects' },
] as const

export const SOCIAL_LINKS = [
	{
		name: 'Discord',
		handle: '@asteriau',
		url: 'https://discord.com/users/444582693255249950',
		icon: '/icons/discord.svg',
	},
	{
		name: 'Telegram',
		handle: '@obregia',
		url: 'https://t.me/obregia',
		icon: '/icons/telegram.svg',
	},
	{
		name: 'GitHub',
		handle: '@asteriau',
		url: 'https://github.com/asteriau',
		icon: '/icons/github.svg',
	},
	{
		name: 'Steam',
		handle: '@asteriau',
		url: 'https://steamcommunity.com/id/asteriau',
		icon: '/icons/steam.svg',
	},
] as const

export const GITHUB_REPOS = [
	'https://api.github.com/repos/asteriau/asteria.cat',
	'https://api.github.com/repos/asteriau/Whimsy',
	'https://api.github.com/repos/asteriau/dotfiles',
] as const

export const CACHE_DURATION = {
	DISCORD: 30_000, // 30 seconds
	LASTFM: 30_000, // 30 seconds
} as const
