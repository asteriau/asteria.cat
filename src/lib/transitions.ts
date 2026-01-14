export type TransitionType = 'fade' | 'slide' | 'fadeUp' | 'fadeDown' | 'scale'

export interface TransitionConfig {
	type: TransitionType
	duration: number
	ease: [number, number, number, number]
	initial?: {
		opacity?: number
		x?: number
		y?: number
		scale?: number
	}
	animate?: {
		opacity?: number
		x?: number
		y?: number
		scale?: number
	}
	exit?: {
		opacity?: number
		x?: number
		y?: number
		scale?: number
	}
}

const transitionPresets: Record<TransitionType, Omit<TransitionConfig, 'type'>> = {
	fade: {
		duration: 0.35,
		ease: [0.4, 0, 0.2, 1],
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	},
	slide: {
		duration: 0.35,
		ease: [0.4, 0, 0.2, 1],
		initial: { opacity: 0, x: 20 },
		animate: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: -20 },
	},
	fadeUp: {
		duration: 0.4,
		ease: [0.4, 0, 0.2, 1],
		initial: { opacity: 0, y: 10 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -10 },
	},
	fadeDown: {
		duration: 0.4,
		ease: [0.4, 0, 0.2, 1],
		initial: { opacity: 0, y: -10 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: 10 },
	},
	scale: {
		duration: 0.3,
		ease: [0.4, 0, 0.2, 1],
		initial: { opacity: 0, scale: 0.95 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.95 },
	},
}

export const defaultTransition: TransitionConfig = {
	...transitionPresets.fadeUp,
	type: 'fadeUp',
}

export function getTransitionConfig(type: TransitionType = 'fadeUp'): TransitionConfig {
	return {
		...transitionPresets[type],
		type,
	}
}
