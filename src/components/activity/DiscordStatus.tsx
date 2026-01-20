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

	useEffect(() => {
		if (!loading && presence) {
			setIsVisible(false)
			const timer = setTimeout(() => setIsVisible(true), 50)
			return () => clearTimeout(timer)
		}
	}, [loading, presence])

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
							<Skeleton shimmer className="w-[50%] h-3 skeleton-line" />
							<Skeleton shimmer className="w-[40%] h-3 skeleton-line" />
						</div>
					</div>
				</div>
			</div>
		)
	}

	const showActivity = presence.activity && presence.isActivity
	const statusLabel =
		presence.status === 'dnd'
			? 'Do Not Disturb'
			: presence.status
			? presence.status.charAt(0).toUpperCase() + presence.status.slice(1)
			: ''

	return (
		<div className="w-full max-w-[420px] mx-auto h-[180px] min-h-[180px] max-h-[180px] flex items-center relative">
			<div className={`w-full h-full flex items-center absolute top-0 left-0 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
				<div className="flex gap-4 items-center w-full relative z-[1]">
					<div className="flex-shrink-0 relative">
						<div className="relative w-[100px] h-[100px] rounded-full">
							<div className="w-full h-full rounded-full overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
								{showActivity && presence.image ? (
									<Image src={presence.image} alt={presence.activity} fill className="object-cover rounded-full" sizes="100px" />
								) : presence.avatar ? (
									<Image src={presence.avatar} alt={presence.username} fill className="object-cover rounded-full" sizes="100px" />
								) : (
									<div className="w-full h-full flex items-center justify-center bg-border rounded-full text-accent" />
								)}
							</div>

							{!showActivity && presence.decoration && (
								<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[124px] h-[124px] pointer-events-none">
									<Image src={presence.decoration} alt="" fill className="object-contain" sizes="124px" />
								</div>
							)}
						</div>
					</div>

					<div className="flex-1 min-w-0 flex flex-col justify-between h-[100px]">
						{showActivity ? (
							<>
								<div>
									<h3 className="m-0 mb-1 text-base font-medium text-fg whitespace-nowrap overflow-hidden text-ellipsis leading-tight tracking-[-0.2px]">
										{presence.activity || 'Playing'}
									</h3>
									<p className="m-0 text-sm font-[450] text-accent whitespace-nowrap overflow-hidden text-ellipsis leading-tight tracking-[0.1px]">
										{presence.details || statusLabel}
									</p>
								</div>

								<p className="m-0 text-xs font-normal text-[rgba(232,227,227,0.6)] whitespace-nowrap overflow-hidden text-ellipsis leading-normal tracking-[0.05px]">
									{presence.state}
								</p>

								<p className="m-0 text-xs font-normal text-accent opacity-85 leading-tight tracking-[0.05px]">
									<span className="flex items-center gap-1.5 font-[450] tracking-[0.05px]">
										<svg className="flex-shrink-0 opacity-80" width="12" height="12" viewBox="0 0 12 12" fill="none">
											<circle cx="6" cy="6" r="5.5" stroke="currentColor" />
											<path d="M6 3V6L8 8" stroke="currentColor" strokeLinecap="round" />
										</svg>
										{elapsed} elapsed
									</span>
								</p>
							</>
						) : (
							<>
								<div>
									<h3 className="m-0 mb-1 text-base font-medium text-fg whitespace-nowrap overflow-hidden text-ellipsis leading-tight tracking-[-0.2px]">
										{presence.username || 'Discord User'}
									</h3>
									<p className="m-0 text-sm font-[450] text-accent whitespace-nowrap overflow-hidden text-ellipsis leading-tight tracking-[0.1px]">
										{statusLabel}
									</p>
								</div>

								<p className="m-0 text-xs font-normal text-[rgba(232,227,227,0.6)] whitespace-nowrap overflow-hidden text-ellipsis leading-normal tracking-[0.05px]">
									{localTime}
								</p>

								<p className="m-0 text-xs font-normal text-accent opacity-85 leading-tight tracking-[0.05px]">
									<span className="flex items-center gap-1.5 font-[450] tracking-[0.05px]">
										via Lanyard
										<Image src="/lanyard.png" alt="Lanyard icon" width={14} height={14} className="flex-shrink-0 rounded-sm opacity-90" />
									</span>
								</p>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
})
