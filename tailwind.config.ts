import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				bg: '#151515',
				'bg-translucent': 'rgba(21, 21, 21, 0.88)',
				elevated: '#181818',
				fg: '#E8E3E3',
				border: '#252525',
				accent: '#8DA3B9',
			},
			fontFamily: {
				sans: ['var(--font-product-sans)', 'sans-serif'],
			},
			boxShadow: {
				'custom': '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.15)',
				'hover': '0 12px 40px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.2)',
			},
			textShadow: {
				'custom': '0 2px 12px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.2)',
			},
			transitionDuration: {
				'400': '400ms',
			},
		},
	},
	plugins: [],
}
export default config
