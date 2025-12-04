<!-- RichPresence.svelte -->
<script lang="ts">
	import Discord from './data/Discord.svelte';
	import Spotify from './data/Spotify.svelte';
	import type { Spotify as SpotifyType } from './data/Spotify.svelte';
	import { onMount, onDestroy } from 'svelte';

	export let discordId: string;

	// Shared state
	let pulse = 30000;
	let heartbeatInterval: ReturnType<typeof setInterval>;
	let ws: WebSocket | null = null;
	
	// Cached data
	let cachedUserData = null;
	let cachedActivities = null;
	let cachedDiscordStatus = null; // Store status separately

	// Discord state
	let discordActivity = '';
	let discordDetails = '';
	let discordState = '';
	let discordImage = 'default.webp';
	let discordSmallImage = '';
	let discordIsActivity = false;
	let discordElapsed = '';
	let discordIsSpotifyActivity = false;

	// Spotify state
	let spotifyData: SpotifyType | null = null;
	let spotifyIsPlaying = false;
	let lastPlayedSpotify: SpotifyType | null = null;

	// Connection state
	let isConnected = false;
	let reconnectAttempts = 0;
	const MAX_RECONNECT_ATTEMPTS = 10;

	// Load ALL cached data from localStorage
	function loadCachedData() {
		try {
			// Load Discord user data
			const savedUserData = localStorage.getItem('cachedDiscordUser');
			if (savedUserData) {
				cachedUserData = JSON.parse(savedUserData);
			}
			
			// Load Discord activities
			const savedActivities = localStorage.getItem('cachedDiscordActivities');
			if (savedActivities) {
				cachedActivities = JSON.parse(savedActivities);
			}
			
			// Load Discord status
			const savedStatus = localStorage.getItem('cachedDiscordStatus');
			if (savedStatus) {
				cachedDiscordStatus = savedStatus; 
				console.log('Loaded cached Discord status:', cachedDiscordStatus);
			}
			
			// Load Spotify data
			const savedLastPlayed = localStorage.getItem('lastPlayedSpotify');
			if (savedLastPlayed) {
				const parsed = JSON.parse(savedLastPlayed);
				lastPlayedSpotify = {
					track_id: parsed.track_id,
					timestamps: parsed.timestamps || { start: 0, end: 0 },
					song: parsed.song,
					artist: parsed.artist,
					album_art_url: parsed.album_art_url,
					album: parsed.album
				};
			}
			
			// If we have cached data, update UI immediately
			if (cachedUserData || cachedDiscordStatus) {
				updateUIFromCache();
			}
			
		} catch (e) {
			console.error('Failed to load cached data', e);
		}
	}

	// Save ALL Discord data to localStorage
	function saveDiscordData(userData: any, activities: any, discord_status: string) {
		try {
			if (userData) {
				localStorage.setItem('cachedDiscordUser', JSON.stringify(userData));
				cachedUserData = userData;
			}
			if (activities) {
				localStorage.setItem('cachedDiscordActivities', JSON.stringify(activities));
				cachedActivities = activities;
			}
			// Save status as a string
			if (discord_status) {
				localStorage.setItem('cachedDiscordStatus', discord_status);
				cachedDiscordStatus = discord_status;
				console.log('Saved Discord status to cache:', discord_status);
			}
			// Save timestamp
			localStorage.setItem('discordCacheTimestamp', Date.now().toString());
		} catch (e) {
			console.error('Failed to save Discord data', e);
		}
	}

	// Update UI from cached data while waiting for fresh data
	function updateUIFromCache() {
		console.log('Updating UI from cache');
		
		// Set username from cache
		let username = 'Discord User';
		if (cachedUserData) {
			username = cachedUserData.username || cachedUserData.global_name || 'Discord User';
		} else {
			// Try to get username from separate storage
			const savedUsername = localStorage.getItem('cachedDiscordUsername');
			if (savedUsername) username = savedUsername;
		}
		discordActivity = `@${username}`;
		
		// Set status from cache 
		if (cachedDiscordStatus) {
			let status = cachedDiscordStatus;
			if (status === 'dnd') {
				status = 'Do Not Disturb';
			} else {
				status = status.charAt(0).toUpperCase() + status.slice(1);
			}
			discordDetails = status;
			console.log('Set status from cache:', status);
		} else {
			// Fallback: try to get status from separate storage
			const savedStatus = localStorage.getItem('cachedStatus');
			if (savedStatus) {
				let status = savedStatus;
				if (status === 'dnd') status = 'Do Not Disturb';
				else status = status.charAt(0).toUpperCase() + status.slice(1);
				discordDetails = status;
			} else {
				discordDetails = 'Offline';
			}
		}
		
		// Set time
		discordState = localTime();
		discordIsActivity = false;
		
		// If we have cached activities, try to restore them
		if (cachedActivities && cachedActivities.length > 0) {
			processCachedActivities(cachedActivities);
		}
		
		// Update Spotify from cache if needed
		if (lastPlayedSpotify && !spotifyIsPlaying) {
			spotifyData = lastPlayedSpotify;
		}
	}

	function processCachedActivities(activities: any[]) {
	}

	function processImageUrl(image: string, application_id?: string) {
	}

	function handleDataUpdate(d: any) {
		console.log('Received fresh data:', d);
		console.log('Discord status from API:', d.discord_status);

		// Save ALL Discord data including status
		saveDiscordData(d.discord_user, d.activities, d.discord_status);

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

		// Update Discord state from fresh data
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
					discordImage = processImageUrl(act.assets.large_image, act.application_id);
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
		// Get username from fresh data or cache
		let username = 'Discord';
		if (d.discord_user) {
			username = d.discord_user.username || d.discord_user.global_name || 'Discord';
		} else if (cachedUserData) {
			username = cachedUserData.username || cachedUserData.global_name || 'Discord';
		}
		discordActivity = `@${username}`;

		// Get status from fresh data or cache
		let status = d.discord_status || cachedDiscordStatus || 'offline';
		console.log('Status for display:', status, 'from fresh:', d.discord_status, 'from cache:', cachedDiscordStatus);
		
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
			timeZone: 'Europe/Bucharest',
			hour12: true,
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function cleanup() {
		isConnected = false;
		if (heartbeatInterval) {
			clearInterval(heartbeatInterval);
			heartbeatInterval = undefined;
		}
		if (ws) {
			ws.close();
			ws = null;
		}
	}

	function connect() {
		if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
			console.warn('Max reconnection attempts reached');
			return;
		}

		cleanup();

		ws = new WebSocket('wss://api.lanyard.rest/socket');

		ws.onopen = () => {
			console.log('Connected to Lanyard');
			isConnected = true;
			reconnectAttempts = 0;
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
			isConnected = false;
			reconnectAttempts++;
			
			const delay = 2500 * Math.pow(1.5, reconnectAttempts);
			setTimeout(connect, Math.min(delay, 30000));
		};

		ws.onerror = (error) => {
			console.error('WebSocket error:', error);
			isConnected = false;
		};
	}

	onMount(() => {
		// Load all cached data immediately
		loadCachedData();
		
		// Update local time periodically
		const timeInterval = setInterval(() => {
			if (!discordIsActivity && !spotifyIsPlaying) {
				discordState = localTime();
			}
		}, 60000);

		if (discordId) {
			connect();
		} else {
			console.error('No discordId provided');
			// Show cached data
			updateUIFromCache();
		}

		return () => {
			cleanup();
			clearInterval(timeInterval);
		};
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
		box-sizing: border-box;
	}

	.rpc-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 1rem;
		width: 100%;
		box-sizing: border-box;
		max-width: 100%;
	}

	:global(.rpc-box),
	:global(.spotify-box) {
		height: 180px !important;
		min-height: 180px !important;
		max-height: 180px !important;
		box-sizing: border-box;
		width: 100%;
	}

	@media (max-width: 768px) {
		.rpc-grid {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}
		
		:global(.rpc-box),
		:global(.spotify-box) {
			height: 160px !important;
			min-height: 160px !important;
			max-height: 160px !important;
		}
	}
</style>