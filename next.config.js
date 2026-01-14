/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['cdn.discordapp.com', 'i.scdn.co', 'lastfm.freetls.fastly.net', 'avatars.githubusercontent.com'],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.discordapp.com',
			},
			{
				protocol: 'https',
				hostname: 'i.scdn.co',
			},
			{
				protocol: 'https',
				hostname: 'lastfm.freetls.fastly.net',
			},
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
			},
		],
	},
}

export default nextConfig
