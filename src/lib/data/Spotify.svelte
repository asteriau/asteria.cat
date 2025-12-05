<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	export interface Spotify {
		track_id: string;
		timestamps: { start: number; end: number };
		song: string;
		artist: string;
		album_art_url: string;
		album: string;
	}

	interface LyricLine {
		time: number;
		text: string;
	}

	export let data: Spotify | null = null;
	export let isPlaying = false;
	export let lastPlayed: Spotify | null = null;

	// Component state
	let currentTrackId = '';
	let lyrics: LyricLine[] = [];
	let fetchingLyrics = false;
	let isScrolling = false;
	let scrollContainerElement: HTMLDivElement;
	let animationFrameId: number;
	let spotifyProgress = 0;
	
	// For syncing
	let currentTimeMs = 0;
	let currentLyricIndex = -1;
	let visibleLyrics: LyricLine[] = [];

	// Section visibility
	let nowPlayingVisible = true;
	let lyricsVisible = false;
	
	// Section tracking
	let sectionTitles: { [key: string]: boolean } = {
		'now-playing': true,
		'lyrics': false
	};

	// Derived values
	$: spotifyActivity = isPlaying && data ? data.song : (lastPlayed ? lastPlayed.song : 'Not Playing');
	$: spotifyDetails = isPlaying && data ? 'by ' + data.artist?.replace(/;/g, ',') : (lastPlayed ? 'by ' + lastPlayed.artist?.replace(/;/g, ',') : 'No recent tracks');
	$: spotifyState = isPlaying && data ? (data.album ? 'on ' + data.album : '') : (lastPlayed && lastPlayed.album ? 'on ' + lastPlayed.album : '');
	$: spotifyImage = isPlaying && data ? data.album_art_url : (lastPlayed ? lastPlayed.album_art_url : 'default.webp');
	$: spotifySongLink = isPlaying && data ? `https://open.spotify.com/track/${data.track_id}` : '';

	// Helper functions
	function parseLRC(lrcText: string): LyricLine[] {
		if (!lrcText) return [];

		const lines = lrcText.split('\n');
		const parsed: LyricLine[] = [];

		for (const line of lines) {
			const match = line.match(/\[(\d+):(\d+)\.(\d+)\](.*)/);
			if (match) {
				const minutes = parseInt(match[1]);
				const seconds = parseInt(match[2]);
				const centiseconds = parseInt(match[3]);
				const text = match[4].trim();

				if (text) { // Only add non-empty lines
					const timeInMs = (minutes * 60 + seconds) * 1000 + centiseconds * 10;
					parsed.push({ time: timeInMs, text });
				}
			}
		}

		return parsed.sort((a, b) => a.time - b.time);
	}

	async function fetchLyrics(artist: string, song: string, album: string, trackId: string) {
		if (fetchingLyrics || trackId === currentTrackId) return;

		fetchingLyrics = true;
		currentTrackId = trackId;
		lyrics = [];
		currentLyricIndex = -1;
		visibleLyrics = [];
		
		// Reset scroll
		if (scrollContainerElement) {
			scrollContainerElement.scrollTop = 0;
			nowPlayingVisible = true;
			lyricsVisible = false;
			sectionTitles = {
				'now-playing': true,
				'lyrics': false
			};
		}

		try {
			const cleanArtist = artist.replace(/;/g, ',').trim();
			const cleanSong = song.trim();
			const cleanAlbum = album ? album.trim() : '';
			
			const params = new URLSearchParams({
				artist_name: cleanArtist,
				track_name: cleanSong,
				...(cleanAlbum && { album_name: cleanAlbum })
			});
			
			const lrclibUrl = `https://lrclib.net/api/get?${params}`;
			
			const response = await fetch(lrclibUrl, {
				headers: {
					'Accept': 'application/json',
				}
			});

			if (response.ok) {
				const data = await response.json();
				
				if (data.syncedLyrics) {
					lyrics = parseLRC(data.syncedLyrics);
					// Show first 3 lyrics initially
					if (lyrics.length > 0) {
						visibleLyrics = lyrics.slice(0, Math.min(3, lyrics.length));
					}
				} else if (data.plainLyrics) {
					lyrics = [{ time: 0, text: data.plainLyrics }];
					visibleLyrics = lyrics;
				}
			}
		} catch (error) {
			console.error('Failed to fetch lyrics:', error);
		} finally {
			fetchingLyrics = false;
		}
	}

	function syncLyrics(currentTimeMs: number) {
		if (lyrics.length === 0) return;
		
		let newIndex = -1;
		
		// Find the current lyric (the one that should be active)
		for (let i = 0; i < lyrics.length; i++) {
			if (currentTimeMs >= lyrics[i].time) {
				newIndex = i;
			} else {
				break;
			}
		}
		
		if (newIndex !== currentLyricIndex) {
			currentLyricIndex = newIndex;
			
			// Update visible lyrics (show current line with context)
			if (newIndex >= 0) {
				const start = Math.max(0, newIndex - 1);
				const end = Math.min(lyrics.length, start + 3);
				visibleLyrics = lyrics.slice(start, end);
			} else if (lyrics.length > 0) {
				// Show first 3 lines if no current lyric yet
				visibleLyrics = lyrics.slice(0, Math.min(3, lyrics.length));
			}
		}
	}

	function musicProgress(spotify: Spotify) {
		const now = Date.now();
		const total = spotify.timestamps.end - spotify.timestamps.start;
		currentTimeMs = now - spotify.timestamps.start;

		if (total > 0) {
			spotifyProgress = Math.min(100, Math.max(0, (currentTimeMs / total) * 100));
			syncLyrics(currentTimeMs);
		}
	}

	function formatLastPlayedTime(timestamp: number): string {
		const now = Date.now();
		const diff = now - timestamp;
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 0) {
			return `${days} day${days > 1 ? 's' : ''} ago`;
		} else if (hours > 0) {
			return `${hours} hour${hours > 1 ? 's' : ''} ago`;
		} else if (minutes > 0) {
			return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
		} else {
			return 'Just now';
		}
	}

	function handleScroll(event: Event) {
		if (!scrollContainerElement || isScrolling) return;

		const container = scrollContainerElement;
		const scrollTop = container.scrollTop;
		const containerHeight = container.clientHeight;

		// Determine which section is visible
		const scrollMiddle = scrollTop + containerHeight / 2;
		const sectionHeight = containerHeight;
		
		if (scrollMiddle < sectionHeight) {
			// Now Playing section is visible
			nowPlayingVisible = true;
			lyricsVisible = false;
			sectionTitles['now-playing'] = true;
			sectionTitles['lyrics'] = false;
		} else {
			// Lyrics section is visible
			nowPlayingVisible = false;
			lyricsVisible = true;
			sectionTitles['now-playing'] = false;
			sectionTitles['lyrics'] = true;
		}
	}

	function cleanupAnimation() {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = undefined;
		}
	}

	function startProgressAnimation() {
		if (!data || !isPlaying) return;
		
		cleanupAnimation();
		
		function spotifyTick() {
			if (data && isPlaying) {
				musicProgress(data);
				animationFrameId = requestAnimationFrame(spotifyTick);
			} else {
				cleanupAnimation();
			}
		}
		
		spotifyTick();
	}

	function scrollToSection(section: 'now-playing' | 'lyrics') {
		if (!scrollContainerElement) return;
		
		isScrolling = true;
		
		if (section === 'now-playing') {
			scrollContainerElement.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		} else {
			scrollContainerElement.scrollTo({
				top: scrollContainerElement.clientHeight,
				behavior: 'smooth'
			});
		}
		
		setTimeout(() => isScrolling = false, 350);
	}

	// Watch for changes in data or isPlaying
	$: {
		if (isPlaying && data) {
			if (data.track_id && data.track_id !== currentTrackId) {
				fetchLyrics(data.artist, data.song, data.album || '', data.track_id);
			}
			startProgressAnimation();
		} else if (lastPlayed) {
			spotifyProgress = 100;
			lyrics = [];
			currentLyricIndex = -1;
			visibleLyrics = [];
			if (scrollContainerElement) scrollContainerElement.scrollTop = 0;
			cleanupAnimation();
		} else {
			spotifyProgress = 0;
			lyrics = [];
			currentLyricIndex = -1;
			visibleLyrics = [];
			if (scrollContainerElement) scrollContainerElement.scrollTop = 0;
			cleanupAnimation();
		}
	}

	onMount(() => {
		if (scrollContainerElement) {
			scrollContainerElement.scrollTop = 0;
		}
	});

	onDestroy(() => {
		cleanupAnimation();
	});
</script>

<div class="rpc-box spotify-box">
	<div class="spotify-scrollable"
		 on:scroll|passive={handleScroll}
		 bind:this={scrollContainerElement}>
		
		<div class="sticky-titles" aria-hidden="true">
			<div class="sticky-title {sectionTitles['now-playing'] ? 'visible' : ''}">
				<h3>Now Playing</h3>
			</div>
			<div class="sticky-title {sectionTitles['lyrics'] ? 'visible' : ''}">
				<h3>Lyrics</h3>
			</div>
		</div>
		
		<div class="scroll-indicator" aria-hidden="true">
			<div class="scroll-track" role="presentation">
				<div class="scroll-circle scroll-top {sectionTitles['now-playing'] ? 'active' : ''}" 
					 on:click={() => scrollToSection('now-playing')}
					 title="Scroll to Now Playing"></div>
				
				<div class="scroll-line" aria-hidden="true"></div>
				
				<div class="scroll-circle scroll-bottom {sectionTitles['lyrics'] ? 'active' : ''}"
					 on:click={() => scrollToSection('lyrics')}
					 title="Scroll to Lyrics"></div>
			</div>
		</div>

		<div class="sections-container">
			<section class="now-playing-section {nowPlayingVisible ? 'active' : ''}">
				<div class="section-content">
					<div class="now-playing-container">
						<div class="rpc-images">
							{#if spotifyImage}
								<img
									src={spotifyImage}
									alt={spotifyActivity}
									class="big"
									style="border-radius: 50%;"
									on:error={(e) => {
										const target = e.target as HTMLImageElement;
										target.src = 'default.webp';
									}}
								/>
							{/if}
						</div>

						<div class="rpc-text">
							{#if isPlaying && spotifySongLink}
								<a href={spotifySongLink} target="_blank" rel="noreferrer" class="song-link">
									<h3 class="song-title">{spotifyActivity || 'Unknown Song'}</h3>
								</a>
							{:else if spotifyActivity === 'Not Playing'}
								<h3 class="song-title">Not Playing</h3>
							{:else}
								<h3 class="song-title last-played">
									{spotifyActivity || 'Unknown Song'}
								</h3>
							{/if}

							{#if spotifyDetails}
								<h5 class="details">{spotifyDetails}</h5>
							{/if}

							{#if spotifyState}
								<h5 class="state">{spotifyState}</h5>
							{/if}

							{#if spotifyProgress > 0}
								<div class="progress-container">
									<progress
										max="100"
										value={spotifyProgress}
										class={isPlaying ? 'playing' : 'last-played'}
									/>
									{#if !isPlaying && lastPlayed}
										<p class="last-played-label">
											Last Played {formatLastPlayedTime(JSON.parse(localStorage.getItem('lastPlayedSpotify') || '{"last_played":0}').last_played || Date.now())}
										</p>
									{/if}
								</div>
							{/if}
						</div>
					</div>
				</div>
			</section>

			<section class="lyrics-section {lyricsVisible ? 'active' : ''}">
				<div class="section-content">
					{#if fetchingLyrics}
						<div class="loading-lyrics">
							<p>Loading lyrics...</p>
						</div>
					{:else if visibleLyrics.length > 0 && isPlaying}
						<div class="lyrics-container">
							{#each visibleLyrics as lyric (lyric.time)}
								<div class="lyric-line-wrapper" animate:flip>
									<p
										class="lyric-line"
										class:current={lyrics[currentLyricIndex] && lyric.time === lyrics[currentLyricIndex].time}
										class:past={currentLyricIndex >= 0 && lyric.time < lyrics[currentLyricIndex].time}
										class:future={currentLyricIndex >= 0 && lyric.time > lyrics[currentLyricIndex].time}
									>
										{lyric.text || '♪'}
									</p>
								</div>
							{/each}
						</div>
					{:else if isPlaying && data}
						<div class="no-lyrics">
							<p>No lyrics available for this song</p>
						</div>
					{:else}
						<div class="no-lyrics">
							<p>No song is currently playing :c</p>
						</div>
					{/if}
				</div>
			</section>
		</div>
	</div>
</div>

<style lang="scss">
	.rpc-box {
		background: rgba(25, 25, 25, 1);
		border-radius: 12px;
		padding: 1rem;

		&.spotify-box {
			height: 180px !important;
			min-height: 180px !important;
			max-height: 180px !important;
			overflow: hidden;
			padding: 0;
			position: relative;
			box-sizing: border-box;
			width: 100%;
		}
	}

	.spotify-scrollable {
		height: 100%;
		overflow-y: auto;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		scroll-snap-type: y mandatory;
		scroll-snap-stop: always;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.sticky-titles {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 20;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		padding: 0.75rem 0.5rem 0 0;
		background: transparent;
		pointer-events: none;
		width: 100%;
		box-sizing: border-box;
		height: 100%;
		
		.sticky-title {
			opacity: 0;
			transform: translateY(-10px);
			transition: all 0.25s ease;
			pointer-events: none;
			text-align: right;
			margin-bottom: 0.25rem;
			position: absolute;
			top: 0.75rem;
			right: 0.5rem;
			
			h3 {
				margin: 0;
				font-size: 0.9rem;
				font-weight: 600;
				color: #8DA3B9;
				text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
				padding: 0.15rem 0.35rem;
				background: rgba(25, 25, 25, 0.7);
				border-radius: 4px;
				backdrop-filter: blur(4px);
			}
			
			&.visible {
				opacity: 1;
				transform: translateY(0);
			}
		}
	}

	.scroll-indicator {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 40;
		height: 100%;
		width: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}

	.scroll-track {
		position: relative;
		height: 60px;
		width: 2px;
		background: rgba(141, 163, 185, 0.1);
		border-radius: 1px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		pointer-events: auto;
	}

	.scroll-circle {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: rgba(141, 163, 185, 0.3);
		transition: all 0.2s ease;
		cursor: pointer;
		position: relative;
		z-index: 2;
		
		&:hover {
			background: rgba(141, 163, 185, 0.6);
			transform: scale(1.2);
		}
		
		&.active {
			background: #8DA3B9;
			box-shadow: 0 0 8px rgba(141, 163, 185, 0.5);
		}
		
		&.scroll-top {
			order: 1;
		}
		
		&.scroll-bottom {
			order: 3;
		}
	}

	.scroll-line {
		flex: 1;
		width: 2px;
		background: linear-gradient(180deg, transparent, rgba(141, 163, 185, 0.6), transparent);
		order: 2;
	}

	.sections-container {
		height: 200%;
		padding: 0;
		margin: 0;
	}

	.now-playing-section,
	.lyrics-section {
		height: 50%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		opacity: 0.3;
		transform: scale(0.95);
		transition: all 0.36s cubic-bezier(0.4, 0, 0.2, 1);
		scroll-snap-align: start;
		scroll-snap-stop: always;
		
		&.active {
			opacity: 1;
			transform: scale(1);
		}
		
		.section-content {
			padding: 0 1rem;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding-top: 1rem;
			padding-bottom: 1rem;
		}
	}

	.now-playing-section {
		.now-playing-container {
			display: flex;
			gap: 1rem;
			align-items: center;
			justify-content: flex-start;
			width: 100%;
			flex-wrap: wrap;
			margin-top: 0;
		}

		.rpc-images {
			flex-shrink: 0;
		}

		.big {
			height: 100px;
			width: 100px;
			object-fit: cover;
			user-select: none;
			transition: all 0.3s ease;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
		}

		.rpc-text {
			flex: 1;
			min-width: 0;
			max-width: calc(100% - 120px);
			text-align: left;

			.song-title {
				margin: 0 0 0.5rem 0;
				font-size: 1.2rem;
				font-weight: 600;
				line-height: 1.3;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;

				&.last-played {
					opacity: 0.8;
				}
			}

			h5 {
				margin: 0.25rem 0;
				font-size: 0.9rem;
				font-weight: 400;
				opacity: 0.8;
				line-height: 1.4;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;

				&.details {
					font-weight: 500;
				}

				&.state {
					font-size: 0.85rem;
					opacity: 0.7;
				}
			}

			.progress-container {
				margin-top: 0.5rem;

				.last-played-label {
					margin: 0.25rem 0 0 0;
					font-size: 0.8rem;
					font-weight: 400;
					opacity: 0.6;
					text-align: left;
				}
			}

			progress {
				width: 100%;
				border-radius: 10rem;
				height: 6px;
				background-color: rgba(255, 255, 255, 0.1);
				border: none;
				overflow: hidden;

				&::-webkit-progress-bar {
					background-color: rgba(255, 255, 255, 0.1);
					border-radius: 10rem;
				}

				&.playing {
					&::-webkit-progress-value {
						background-color: #8C977D;
						border-radius: 10rem;
						transition: width 0.3s ease;
					}

					&::-moz-progress-bar {
						background-color: #8C977D;
						border-radius: 10rem;
					}
				}

				&.last-played {
					&::-webkit-progress-value {
						background-color: #252525;
						border-radius: 10rem;
					}

					&::-moz-progress-bar {
						background-color: #252525;
						border-radius: 10rem;
					}
				}
			}
		}

		.song-link {
			text-decoration: none;
			color: inherit;

			&:hover {
				text-decoration: underline;
				opacity: 0.9;
			}

			h3 {
				color: inherit;
				margin: 0;
			}
		}
	}

	.lyrics-section {
		.lyrics-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 0.5rem;
			height: 100%;
			width: 100%;
			padding-top: 0.5rem;
		}

		.lyric-line-wrapper {
			width: 100%;
			text-align: center;
			transition: all 0.3s ease;
		}

		.lyric-line {
			margin: 0;
			font-size: 0.95rem;
			line-height: 1.5;
			opacity: 0.4;
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			padding: 0.25rem 0;
			transform-origin: center;
			display: inline-block;
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 100%;
			
			&.past {
				opacity: 0.3;
				transform: translateY(-8px) scale(0.95);
			}

			&.current {
				opacity: 1;
				color: #8DA3B9;
				font-weight: 500;
				font-size: 1.05rem;
				text-shadow: 0 0 8px rgba(141, 163, 185, 0.3);
				transform: translateY(0) scale(1);
				padding: 0.5rem 0;
				transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
			}
			
			&.future {
				opacity: 0.4;
				transform: translateY(8px) scale(0.95);
			}
		}

		.loading-lyrics,
		.no-lyrics {
			text-align: center;
			opacity: 0.5;
			font-size: 1.2rem;
			padding: 1rem;
			border-radius: 8px;
			width: 100%;
		}
	}

	@media (max-width: 768px) {
		.rpc-box.spotify-box {
			height: 160px !important;
			min-height: 160px !important;
			max-height: 160px !important;
		}
		
		.sections-container {
			height: 200%;
		}
		
		.now-playing-section,
		.lyrics-section {
			height: 50%;
			
			.section-content {
				padding: 0 0.75rem;
				padding-top: 0.75rem;
			}
		}
		
		.sticky-titles {
			padding: 0.75rem 0.25rem 0 0;
			
			.sticky-title {
				top: 0.75rem;
				right: 0.25rem;
				
				h3 {
					font-size: 0.8rem;
					padding: 0.1rem 0.25rem;
				}
			}
		}
		
		.scroll-indicator {
			width: 1.25rem;
		}
		
		.now-playing-section {
			.now-playing-container {
				gap: 0.75rem;
				padding: 0.5rem 0;
			}

			.big {
				height: 80px;
				width: 80px;
			}
			
			.rpc-text {
				max-width: calc(100% - 90px);
				text-align: left;
				
				.song-title {
					font-size: 1rem;
					-webkit-line-clamp: 1;
				}
				
				h5 {
					font-size: 0.85rem;
				}
				
				progress {
					height: 5px;
				}
			}
		}
		
		.lyrics-section {
			.lyrics-container {
				padding-top: 0.25rem;
			}
			
			.lyric-line {
				font-size: 0.9rem;
				padding: 0.2rem 0;
				
				&.current {
					font-size: 1rem;
					padding: 0.3rem 0;
				}
			}
		}
	}

	@media (max-width: 480px) {
		.rpc-box.spotify-box {
			height: 140px !important;
			min-height: 140px !important;
			max-height: 140px !important;
		}
		
		.sticky-titles {
			padding: 0.75rem 0.15rem 0 0;
			
			.sticky-title {
				top: 0.75rem;
				right: 0.15rem;
				
				h3 {
					font-size: 0.75rem;
					padding: 0.08rem 0.15rem;
				}
			}
		}
		
		.scroll-indicator {
			width: 1rem;
			
			.scroll-track {
				height: 50px;
			}
			
			.scroll-circle {
				width: 6px;
				height: 6px;
			}
		}
		
		.now-playing-section {
			.now-playing-container {
				gap: 0.5rem;
			}
			
			.big {
				height: 60px;
				width: 60px;
			}
			
			.rpc-text {
				max-width: calc(100% - 70px);
				text-align: left;
				
				.song-title {
					font-size: 0.9rem;
					margin-bottom: 0.25rem;
				}
				
				h5 {
					font-size: 0.8rem;
					margin: 0.15rem 0;
				}
				
				.progress-container {
					margin-top: 0.25rem;
				}
			}
		}
		
		.lyrics-section {
			.lyric-line {
				font-size: 0.85rem;
				
				&.current {
					font-size: 0.9rem;
				}
			}
			
			.loading-lyrics,
			.no-lyrics {
				padding: 0.75rem;
				font-size: 0.8rem;
			}
		}
	}
</style>