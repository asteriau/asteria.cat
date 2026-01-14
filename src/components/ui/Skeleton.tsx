// this is only used if the preload somehow fucks up

import { cn } from '@/lib/utils'

interface SkeletonProps {
	className?: string
	shimmer?: boolean
}

export function Skeleton({ className, shimmer = false }: SkeletonProps) {
	return (
		<div
			className={cn(
				'bg-white/5',
				shimmer && 'skeleton-box',
				!className?.includes('rounded') && 'rounded-md',
				className
			)}
		/>
	)
}
