// a place to dump all my animations for later use

import { Variants } from 'framer-motion'

// Smooth easing curves
const smoothEase = [0.25, 0.1, 0.25, 1] as const
const elegantEase = [0.4, 0, 0.2, 1] as const
const fluidEase = [0.22, 1, 0.36, 1] as const

// Hero animations 
export const heroContainer: Variants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.12,
			delayChildren: 0.1,
		},
	},
}

export const heroTitle: Variants = {
	hidden: { opacity: 0, y: 30 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.9,
			ease: smoothEase,
		},
	},
}

export const heroText: Variants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.7,
			ease: elegantEase,
			delay: 0.15,
		},
	},
}

export const heroButton: Variants = {
	hidden: { opacity: 0, scale: 0.9 },
	show: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.5,
			ease: fluidEase,
			delay: 0.3,
		},
	},
}

export const heroModel: Variants = {
	hidden: { opacity: 0, scale: 0.95 },
	show: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.8,
			ease: smoothEase,
			delay: 0.2,
		},
	},
}

// Page container - Gentle fade-in
export const pageContainer: Variants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.05,
		},
	},
}

// Card animations - Subtle scale + fade
export const cardContainer: Variants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.08,
		},
	},
}

export const cardItem: Variants = {
	hidden: { opacity: 0, scale: 0.95, y: 10 },
	show: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			duration: 0.55,
			ease: elegantEase,
		},
	},
}

// List/grid animations - Staggered fade-up
export const listContainer: Variants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
}

export const listItem: Variants = {
	hidden: { opacity: 0, y: 15 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: smoothEase,
		},
	},
}

// Text animations - Smooth fade-in 
export const textFade: Variants = {
	hidden: { opacity: 0, y: 8 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.45,
			ease: elegantEase,
		},
	},
}

// Section header animations
export const sectionHeader: Variants = {
	hidden: { opacity: 0, y: 12 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: smoothEase,
		},
	},
}

// Divider animation
export const divider: Variants = {
	hidden: { opacity: 0, scaleX: 0 },
	show: {
		opacity: 1,
		scaleX: 1,
		transition: {
			duration: 0.6,
			ease: elegantEase,
		},
	},
}

// Legacy exports for backward compatibility (will be replaced)
export const container = pageContainer
export const item = textFade
