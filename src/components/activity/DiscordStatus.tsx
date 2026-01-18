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
	const [localTime, setLocalTime] = useState('')

	// Update elapsed time
	useEffect(() => {
		if (!presence?.startTimestamp) {
			setElapsed('0:00')
			return
		}

		const updateElapsed = () => setElapsed(formatElapsedTime(presence.startTimestamp))

		updateElapsed()
		const interval = setInterval(updateElapsed, 1000)
		return () => clearInterval(interval)
	}, [presence?.startTimestamp])

	// Fade in content
	useEffect(() => {
		if (!loading && presence) {
			setIsVisible(false)
			const timer = setTimeout(() => setIsVisible(true), 50)
			return () => clearTimeout(timer)
		}
	}, [loading, presence])

	// Update Bucharest local time
	useEffect(() => {
		const updateTime = () => {
			const options: Intl.DateTimeFormatOptions = {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: false,
				timeZone: 'Europe/Bucharest',
			}
			setLocalTime(new Intl.DateTimeFormat('en-GB', options).format(new Date()))
		}

		updateTime()
		const interval = setInterval(updateTime, 1000)
		return () => clearInterval(interval)
	}, [])

	if (loading || !presence) {
		return (
			<div className="w-full max-w-[420px] mx-auto h-[180px] min-h-[180px] max-h-[180px] flex items-center relative">
				<div className="w-full h-full flex items-center absolute top-0 left-0">
					<div className="flex gap-4 items-center w-full">
						<Skeleton shimmer className="w-[100px] h-[100px] flex-shrink-0 rounded-full" />
						<div className="flex-1 min-w-0 flex flex-col gap-2">
							<Skeleton shimmer className="w-[70%] h-4 skeleton-line" />
							<Skeleton shimmer className="w-[60%] h-3.5 skeleton-line" />
							<Skeleton shimmer className="w-[40%] h-3 skeleton-line" />
						</div>
					</div>
				</div>
			</div>
		)
	}

	const showActivity = presence.activity && presence.isActivity
	const showProfile = !showActivity && presence.username
	const statusLabel = presence.status === 'dnd' ? 'Do Not Disturb' : presence.status?.charAt(0).toUpperCase() + (presence.status?.slice(1) ?? '')

	return (
		<div className="w-full max-w-[420px] mx-auto h-[180px] min-h-[180px] max-h-[180px] flex items-center relative">
			<div className={`w-full h-full flex items-center absolute top-0 left-0 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
				<div className="flex gap-4 items-center w-full relative z-[1]">
					{/* Avatar */}
					<div className="flex-shrink-0 relative">
						<div className="relative w-[100px] h-[100px] rounded-full">
							<div className="w-full h-full rounded-full overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
								{showActivity && presence.image ? (
									<Image src={presence.image} alt={presence.activity} fill className="object-cover rounded-full" sizes="100px" />
								) : showProfile && presence.avatar ? (
									<Image src={presence.avatar} alt={presence.username} fill className="object-cover rounded-full" sizes="100px" />
								) : (
									<div className="w-full h-full flex items-center justify-center bg-border rounded-full text-accent">
										<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
											<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
										</svg>
									</div>
								)}
							</div>

							{/* Decoration */}
							{showProfile && presence.decoration && (
								<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[124px] h-[124px] z-[0] pointer-events-none">
									<Image src={presence.decoration} alt="" fill className="object-contain" sizes="124px" />
								</div>
							)}
						</div>
					</div>

					{/* Info */}
					<div className="flex-1 min-w-0 flex flex-col justify-between h-[100px]">
						<div className="flex flex-col gap-1.5">
							<h3 className="m-0 text-base font-medium text-fg overflow-hidden text-ellipsis whitespace-nowrap leading-tight tracking-[-0.2px]">
								{showActivity ? (
									<>
										{presence.activity || 'Playing'}
										{presence.smallImage && (
											<Image src={presence.smallImage} alt="" width={18} height={18} className="rounded flex-shrink-0 opacity-90" />
										)}
									</>
								) : showProfile ? (
									presence.username || 'Discord User'
								) : null}
							</h3>

							{showProfile && (
								<>
									<p className="m-0 text-sm font-[450] text-accent leading-tight tracking-[0.1px]">
										{statusLabel}
									</p>
									<p className="m-0 text-sm font-[450] text-accent leading-tight tracking-[0.1px]">
										{localTime}
									</p>
								</>
							)}
						</div>

						{showActivity && presence.details && (
							<p className="m-0 text-sm text-[rgba(232,227,227,0.6)] overflow-hidden text-ellipsis whitespace-nowrap leading-normal tracking-[0.05px] mt-1">
								{presence.details}
							</p>
						)}

						{showActivity && presence.state && (
							<p className="m-0 text-xs text-[rgba(232,227,227,0.6)] overflow-hidden text-ellipsis whitespace-nowrap leading-normal tracking-[0.05px] mt-0.5">
								{presence.state}
							</p>
						)}

						{showActivity && (
							<p className="m-0 text-xs font-normal text-accent leading-tight tracking-[0.05px] mt-1">
								<span className="flex items-center gap-1.5 font-[450] tracking-[0.05px]">
									<svg className="flex-shrink-0 opacity-80" width="12" height="12" viewBox="0 0 12 12" fill="none">
										<circle cx="6" cy="6" r="5.5" stroke="currentColor" />
										<path d="M6 3V6L8 8" stroke="currentColor" strokeLinecap="round" />
									</svg>
									{elapsed} elapsed
								</span>
							</p>
						)}

						<p className="m-0 text-xs font-normal text-accent leading-tight tracking-[0.05px] mt-2">
							<span className="flex items-center gap-1.5 font-[450] tracking-[0.05px]">
								via Lanyard
								<Image src="/lanyard.png" alt="Lanyard icon" width={14} height={14} className="flex-shrink-0 rounded-sm opacity-90" />
							</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
})
