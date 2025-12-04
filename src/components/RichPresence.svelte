<script lang="ts">
	import Discord from './data/Discord.svelte';
	import Spotify from './data/Spotify.svelte';
	import type { Spotify as SpotifyType } from './data/Spotify.svelte';
	import { onMount } from 'svelte';

	export let discordId: string;

	// Shared state
	let pulse = 30000;
	let heartbeatInterval: ReturnType<typeof setInterval>;
	let ws: WebSocket | null = null;
	let user: { id: string; username: string; avatar: string; avatar_decoration: any; discriminator: string; global_name: string; public_flags: number } | null = null;

	// Discord state
	let discordActivity = '';
	let discordDetails = '';
	let discordState = '';
	let discordImage = 'default.webp';
	let discordSmallImage = '';
	let discordIsActivity = false;
	let discordElapsed = '';
	let discordIsSpotifyActivity = false;

	// Spotify state (to pass to Spotify component)
	let spotifyData: SpotifyType | null = null;
	let spotifyIsPlaying = false;
	let lastPlayedSpotify: SpotifyType | null = null;

	function handleDataUpdate(d: any) {
		console.log('Received data:', d);

		if (d.discord_user) {
			user = d.discord_user;
		}

		// Update Spotify state
		spotifyIsPlaying = d.listening_to_spotify || false;

		if (spotifyIsPlaying && d.spotify) {
			spotifyData = d.spotify;
			lastPlayedSpotify = d.spotify;
			localStorage.setItem('lastPlayedSpotify', JSON.stringify({
				...d.spotify,
				last_played: Date.now()
			}));
		} else if (lastPlayedSpotify) {
			spotifyIsPlaying = false;
			spotifyData = lastPlayedSpotify;
		} else {
			spotifyIsPlaying = false;
			spotifyData = null;
		}

		// Update Discord state
		discordIsActivity = false;
		discordIsSpotifyActivity = false;

		if (d.activities && d.activities.length > 0) {
			const activities = d.activities.filter((act: any) => {
				if (act.name === 'Spotify' || (act.application_id && act.application_id === 'spotify')) {
					discordIsSpotifyActivity = true;
					return false;
				}
				return act.type !== 4;
			});

			if (activities.length > 0) {
				discordIsActivity = true;
				const act = activities[0];

				discordActivity = act.name || '';
				discordDetails = act.details || '';
				discordState = act.state || '';

				if (act.assets && act.assets.large_image) {
					if (act.assets.large_image.startsWith('mp:')) {
						discordImage = `https://media.discordapp.net/${act.assets.large_image.replace('mp:', '')}`;
					} else if (act.application_id) {
						discordImage = `https://cdn.discordapp.com/app-assets/${act.application_id}/${act.assets.large_image}.webp?size=512`;
					}
				} else {
					discordImage = 'default.webp';
				}

				if (act.assets && act.assets.small_image && act.application_id) {
					discordSmallImage = `https://cdn.discordapp.com/app-assets/${act.application_id}/${act.assets.small_image}.webp?size=512`;
				} else {
					discordSmallImage = '';
				}
			} else {
				handleNoDiscordActivity(d);
			}
		} else {
			handleNoDiscordActivity(d);
		}
	}

	function handleNoDiscordActivity(d: any) {
		discordActivity = user ? `@${user.username}` : 'Discord';

		let status = d.discord_status || 'offline';
		if (status === 'dnd') {
			status = 'Do Not Disturb';
		} else {
			status = status.charAt(0).toUpperCase() + status.slice(1);
		}

		discordDetails = status;
		discordState = localTime();
		discordImage = 'default.webp';
		discordSmallImage = '';
		discordIsActivity = false;
	}

	function localTime() {
		return new Date().toLocaleTimeString('en-US', {
			timeZone: 'America/New_York',
			hour12: true,
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function cleanup() {
		if (heartbeatInterval) {
			clearInterval(heartbeatInterval);
			heartbeatInterval = undefined;
		}
		if (ws) {
			ws.close();
			ws = null;
		}
	}

	onMount(() => {
		// Load last played Spotify from localStorage
		const savedLastPlayed = localStorage.getItem('lastPlayedSpotify');
		if (savedLastPlayed) {
			try {
				const parsed = JSON.parse(savedLastPlayed);
				lastPlayedSpotify = {
					track_id: parsed.track_id,
					timestamps: parsed.timestamps || { start: 0, end: 0 },
					song: parsed.song,
					artist: parsed.artist,
					album_art_url: parsed.album_art_url,
					album: parsed.album
				};
			} catch (e) {
				console.error('Failed to parse saved lastPlayedSpotify', e);
			}
		}

		function connect() {
			cleanup();

			ws = new WebSocket('wss://api.lanyard.rest/socket');

			ws.onopen = () => {
				console.log('Connected to Lanyard');
			};

			ws.onmessage = (e) => {
				try {
					const json = JSON.parse(e.data);
					const { op, d } = json;

					if (op === 1) {
						pulse = d.heartbeat_interval;
						ws?.send(JSON.stringify({
							op: 2,
							d: { subscribe_to_id: discordId }
						}));

						if (heartbeatInterval) clearInterval(heartbeatInterval);
						heartbeatInterval = setInterval(
							() => ws?.send(JSON.stringify({ op: 3 })),
							pulse
						);
					}

					if (op === 0) {
						handleDataUpdate(d);
					}
				} catch (error) {
					console.error('Error parsing WebSocket message:', error);
				}
			};

			ws.onclose = (e) => {
				console.log('Disconnected, reconnecting...', e.code);
				setTimeout(connect, 2500);
			};

			ws.onerror = (error) => {
				console.error('WebSocket error:', error);
			};
		}

		if (discordId) {
			connect();
		} else {
			console.error('No discordId provided');
		}

		return cleanup;
	});
</script>

<div class="rpc-container">
	<div class="rpc-grid">
		<Discord
			activity={discordActivity}
			details={discordDetails}
			state={discordState}
			image={discordImage}
			smallImage={discordSmallImage}
			isActivity={discordIsActivity}
			elapsed={discordElapsed}
		/>
		
		<Spotify
			data={spotifyData}
			isPlaying={spotifyIsPlaying}
			lastPlayed={lastPlayedSpotify}
		/>
	</div>
</div>

<style lang="scss">
	.rpc-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}

	.rpc-user {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.5rem;

		.rpc-avatar {
			height: 40px;
			width: 40px;
			border-radius: 50%;
			object-fit: cover;
			border: 2px solid rgba(255, 255, 255, 0.1);
		}

		.rpc-username {
			margin: 0;
			font-size: 0.9rem;
			opacity: 0.8;
		}
	}

	.rpc-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		width: 100%;
	}

	@media (max-width: 768px) {
		.rpc-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}
	}
</style>