import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatLastPlayedTime(timestamp: number | undefined): string {
	if (!timestamp) return ''
	const now = Date.now()
	const diff = now - timestamp

	const minutes = Math.floor(diff / 60000)
	const hours = Math.floor(minutes / 60)
	const days = Math.floor(hours / 24)

	if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
	if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
	if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
	return 'Just now'
}

export function formatUpdated(date: string): string {
	const diff = Date.now() - new Date(date).getTime()
	const days = Math.floor(diff / 86400000)

	if (days < 1) return 'updated today'
	if (days === 1) return 'updated yesterday'
	if (days < 30) return `updated ${days} days ago`

	const months = Math.floor(days / 30)
	if (months < 12) return `updated ${months} month${months > 1 ? 's' : ''} ago`

	const years = Math.floor(months / 12)
	return `updated ${years} year${years > 1 ? 's' : ''} ago`
}

export function localTime(): string {
	return new Date().toLocaleTimeString('en-US', {
		timeZone: 'Europe/Bucharest',
		hour12: true,
		hour: 'numeric',
		minute: '2-digit',
	})
}

export function processImageUrl(image: string | null, applicationId?: string): string | undefined {
	if (!image) return undefined
	if (image.startsWith('http')) return image
	if (applicationId) return `https://cdn.discordapp.com/app-assets/${applicationId}/${image}.webp?size=512`
	return undefined
}

export function formatElapsedTime(startTimestamp: number | null): string {
	if (!startTimestamp) return '0:00'
	
	const now = Date.now()
	const diff = now - startTimestamp
	const hours = Math.floor(diff / 3600000)
	const minutes = Math.floor((diff % 3600000) / 60000)
	const seconds = Math.floor((diff % 60000) / 1000)

	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
	}
	return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
