'use client'

import { memo, useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import type { Track } from '@/types/lastfm'
import { formatLastPlayedTime } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton'

interface SpotifyStatusProps {
	nowPlaying: Track | null
	lastPlayed: Track | null
	loading?: boolean
}

function generateSeededBarHeights(isPlaying: boolean, trackId?: string): number[] {
	if (!isPlaying) return []

	const seed = trackId ? trackId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : Math.random() * 1000
	const heights: number[] = []

	for (let i = 0; i < 16; i++) {
		const pseudoRandom = Math.sin(seed + i * 0.1) * 10000
		const normalized = pseudoRandom - Math.floor(pseudoRandom)
		heights.push(15 + normalized * 85)
	}

	return heights
}

export const SpotifyStatus = memo(function SpotifyStatus({ nowPlaying, lastPlayed, loading }: SpotifyStatusProps) {
	const active = nowPlaying || lastPlayed
	const isCurrentlyPlaying = !!nowPlaying
	const [isVisible, setIsVisible] = useState(false)

	const barHeights = useMemo(
		() => generateSeededBarHeights(isCurrentlyPlaying, active?.id),
		[isCurrentlyPlaying, active?.id]
	)

	useEffect(() => {
		if (!loading && active) {
			setIsVisible(false)
			const timer = setTimeout(() => setIsVisible(true), 50)
			return () => clearTimeout(timer)
		}
	}, [loading, active])

	if (loading || !active) {
		return (
			<div className="w-full max-w-[420px] mx-auto h-[180px] min-h-[180px] max-h-[180px] flex items-center relative">
				<div className="w-full h-full flex items-center absolute top-0 left-0 z-[1]">
					<div className="flex gap-4 items-center w-full relative">
						<Skeleton shimmer className="w-[100px] h-[100px] flex-shrink-0 rounded-full" />
						<div className="flex-1 min-w-0 flex flex-col gap-2">
							<Skeleton shimmer className="w-[70%] h-4 skeleton-line" />
							<Skeleton shimmer className="w-[50%] h-3.5 skeleton-line" />
							<Skeleton shimmer className="w-[60%] h-3 skeleton-line" />
							<Skeleton shimmer className="w-[40%] h-3 skeleton-line" />
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="w-full max-w-[420px] mx-auto h-[180px] min-h-[180px] max-h-[180px] flex items-center relative">
			<div className={`w-full h-full flex items-center absolute top-0 left-0 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
				{isCurrentlyPlaying && (
				<div className="absolute top-0 left-0 right-0 bottom-0 flex items-end gap-1 px-0 opacity-[0.08] z-0 -mb-6"
 style={{ marginBottom: '-28px' }}>
						{barHeights.map((height, i) => (
							<div
								key={i}
								className="spotify-visualizer-bar flex-1 bg-gradient-to-t from-[#8C977D] to-transparent rounded-t-sm"
								style={{
									height: `${height}%`,
									animationDelay: `-${i * 0.12}s`,
								}}
							/>
						))}
					</div>
				)}

				<div className="flex gap-4 items-center w-full relative z-[1]">
					<div className="flex-shrink-0 relative">
						<div className="w-[100px] h-[100px] rounded-full overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
							{active.image && active.image !== 'default.webp' ? (
								<Image
									src={active.image}
									alt={`${active.title} by ${active.artist}`}
									fill
									className="object-cover rounded-full"
									onError={(e) => {
										const target = e.target as HTMLImageElement
										target.style.display = 'none'
									}}
								/>
							) : (
								<div className="w-full h-full bg-border flex items-center justify-center text-accent rounded-full">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
										<path d="M8 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4m0 3a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
									</svg>
								</div>
							)}
						</div>
					</div>

					<div className="flex-1 min-w-0 flex flex-col justify-between h-[100px]">
						<div>
							<h3 className="m-0 mb-1 text-base font-medium text-fg whitespace-nowrap overflow-hidden text-ellipsis leading-tight tracking-[-0.2px]">
								{active.title}
							</h3>
							<p className="m-0 text-sm font-[450] text-accent whitespace-nowrap overflow-hidden text-ellipsis leading-tight tracking-[0.1px]">
								{active.artist}
							</p>
						</div>

						{active.album && (
							<p className="m-0 text-xs font-normal text-[rgba(232,227,227,0.6)] whitespace-nowrap overflow-hidden text-ellipsis leading-normal tracking-[0.05px] text-left w-full">
								on {active.album}
							</p>
						)}

						<p className="m-0 text-xs font-normal text-accent opacity-85 leading-tight tracking-[0.05px]">
							{isCurrentlyPlaying ? (
								<span className="flex items-center gap-1.5 font-[450] tracking-[0.05px]">
									now playing on
									<svg className="text-[#8C977D] flex-shrink-0 opacity-90" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
										<path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.669 11.538a.5.5 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686m.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858m.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288" />
									</svg>
								</span>
							) : active.playedAt ? (
								`last played ${formatLastPlayedTime(active.playedAt)}`
							) : null}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
})