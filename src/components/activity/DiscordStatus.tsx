'use client'

import { useEffect, useState, memo } from 'react'
import Image from 'next/image'
import type { DiscordPresence } from '@/types/lanyard'
import { formatElapsedTime } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton'

interface DiscordStatusProps {
	presence: DiscordPresence | null
	loading?: boolean
}

export const DiscordStatus = memo(function DiscordStatus({ presence, loading }: DiscordStatusProps) {
	const [elapsed, setElapsed] = useState('0:00')
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		if (!presence?.startTimestamp) {
			setElapsed('0:00')
			return
		}

		const updateElapsed = () => {
			setElapsed(formatElapsedTime(presence.startTimestamp))
		}

		updateElapsed()
		const interval = setInterval(updateElapsed, 1000)

		return () => clearInterval(interval)
	}, [presence?.startTimestamp])

	useEffect(() => {
		if (!loading && presence) {
			setIsVisible(false)
			const timer = setTimeout(() => setIsVisible(true), 50)
			return () => clearTimeout(timer)
		}
	}, [loading, presence])

	if (loading || !presence) {
		return (
			<div className="w-full max-w-[420px] mx-auto h-[180px] min-h-[180px] max-h-[180px] flex items-center relative">
				<div className="w-full h-full flex items-center absolute top-0 left-0">
					<div className="flex gap-4 items-center w-full">
						<Skeleton shimmer className="w-[100px] h-[100px] flex-shrink-0 rounded-full" />
						<div className="flex-1 min-w-0 flex flex-col gap-2">
							<Skeleton shimmer className="w-[70%] h-5 skeleton-line" />
							<Skeleton shimmer className="w-[60%] h-4 skeleton-line" />
							<Skeleton shimmer className="w-[40%] h-3.5 skeleton-line" />
						</div>
					</div>
				</div>
			</div>
		)
	}

	const showActivity = presence.activity && presence.isActivity
	const showProfile = !showActivity && presence.username
	const statusLabel =
		presence.status === 'dnd'
			? 'Do Not Disturb'
			: presence.status.charAt(0).toUpperCase() + presence.status.slice(1)

	return (
		<div className="w-full max-w-[420px] mx-auto h-[180px] min-h-[180px] max-h-[180px] flex items-center relative">
			<div className={`w-full h-full flex items-center absolute top-0 left-0 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
				<div className="flex gap-4 items-center w-full relative z-[1]">
					<div className="flex-shrink-0 relative">
						<div className="w-[100px] h-[100px] relative">
							{showActivity && presence.image ? (
								<Image
									src={presence.image}
									alt={presence.activity}
									fill
									className="rounded-full object-cover shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
								/>
							) : showProfile && presence.avatar ? (
								<>
									<Image
										src={presence.avatar}
										alt={presence.username}
										fill
										className="rounded-full object-cover shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
									/>
									{presence.decoration && (
										<Image
											src={presence.decoration}
											alt=""
											fill
											className="absolute -top-[6px] -left-[6px] w-[calc(100%+12px)] h-[calc(100%+12px)] pointer-events-none object-contain"
										/>
									)}
								</>
							) : (
								<div className="w-full h-full flex items-center justify-center bg-border rounded-xl text-accent shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
									<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
										<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
									</svg>
								</div>
							)}
							{showProfile && (
								<div
									className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-[3px] border-bg/40 z-[2] shadow-[0_2px_8px_rgba(0,0,0,0.2)] ${
										presence.status === 'online'
											? 'bg-[#8C977D]'
											: presence.status === 'idle'
											? 'bg-[#D9BC8C]'
											: presence.status === 'dnd'
											? 'bg-[#B66467]'
											: presence.status === 'streaming'
											? 'bg-[#A988B0]'
											: 'bg-[#525252]'
									}`}
								/>
							)}
						</div>
					</div>

					<div className="flex-1 min-w-0 flex flex-col">
						<div className="mb-1.5">
							<h3 className="m-0 text-lg font-medium text-fg overflow-hidden text-ellipsis whitespace-nowrap flex items-center gap-2">
								{showActivity ? (
									<>
										{presence.activity || 'Playing'}
										{presence.smallImage && (
											<Image
												src={presence.smallImage}
												alt=""
												width={18}
												height={18}
												className="rounded flex-shrink-0 opacity-90"
											/>
										)}
									</>
								) : showProfile ? (
									presence.username || 'Discord User'
								) : null}
							</h3>
							{showProfile && (
								<p className="m-0 text-xs flex items-center gap-1">
									<span
										className={`font-medium ${
											presence.status === 'online'
												? 'text-[#8C977D]'
												: presence.status === 'idle'
												? 'text-[#D9BC8C]'
												: presence.status === 'dnd'
												? 'text-[#B66467]'
												: presence.status === 'streaming'
												? 'text-[#A988B0]'
												: 'text-[#525252]'
										}`}
									>
										{statusLabel}
									</span>
								</p>
							)}
						</div>

						{showActivity && presence.details && (
							<p className="m-0 mb-1 text-sm text-[rgba(232,227,227,0.6)] overflow-hidden text-ellipsis whitespace-nowrap">
								{presence.details}
							</p>
						)}

						{showActivity && presence.state && (
							<p className="m-0 mb-2.5 text-xs text-[rgba(232,227,227,0.6)] overflow-hidden text-ellipsis whitespace-nowrap">
								{presence.state}
							</p>
						)}

						{showActivity && (
							<p className="m-0 text-xs flex items-center gap-1.5">
								<span className="flex items-center gap-1.5 text-[#8C977D] font-medium tabular-nums">
									<svg className="flex-shrink-0 opacity-80" width="12" height="12" viewBox="0 0 12 12" fill="none">
										<circle cx="6" cy="6" r="5.5" stroke="currentColor" />
										<path d="M6 3V6L8 8" stroke="currentColor" strokeLinecap="round" />
									</svg>
									{elapsed} elapsed
								</span>
							</p>
						)}

						<p className="m-0 mt-1 flex items-center gap-1.5 text-xs font-medium text-[#d7bb87] whitespace-nowrap">
							via Lanyard
							<Image src="/lanyard.png" alt="Lanyard icon" width={14} height={14} className="flex-shrink-0 rounded-sm" />
						</p>
					</div>
				</div>
			</div>
		</div>
	)
})