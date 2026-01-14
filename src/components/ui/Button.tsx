'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

type ButtonProps = Omit<HTMLMotionProps<'button'>, 'ref'> & {
	variant?: 'default' | 'ghost'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = 'default', children, ...props }, ref) => {
		return (
			<motion.button
				ref={ref}
				className={cn(
					'inline-flex items-center gap-3 rounded-full px-8 py-4 text-base font-medium transition-all duration-500',
					'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-bg',
					variant === 'default' &&
						'bg-[rgba(21,21,21,0.7)] border border-border/60 text-fg hover:bg-[rgba(141,163,185,0.12)] hover:border-accent/70 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(141,163,185,0.15)]',
					className
				)}
				whileHover={{ scale: 0.97, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
				whileTap={{ scale: 0.94, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } }}
				style={{ willChange: 'transform' }}
				{...props}
			>
				{children}
			</motion.button>
		)
	}
)

Button.displayName = 'Button'
