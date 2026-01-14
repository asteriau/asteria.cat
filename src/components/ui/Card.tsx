import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	variant?: 'default' | 'contact' | 'project'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
	({ className, variant = 'default', children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					'rounded-xl backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
					variant === 'default' &&
						'bg-[rgba(21,21,21,0.15)] border border-border/50 hover:border-[rgba(141,163,185,0.35)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]',
					variant === 'contact' &&
						'bg-[rgba(21,21,21,0.65)] border border-border/60 hover:border-accent/70 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(141,163,185,0.15)]',
					variant === 'project' &&
						'bg-[rgba(21,21,21,0.65)] border border-border/60 hover:border-[rgba(141,163,185,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]',
					className
				)}
				{...props}
			>
				{children}
			</div>
		)
	}
)

Card.displayName = 'Card'
