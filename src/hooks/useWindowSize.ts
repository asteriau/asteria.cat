import { useEffect, useState } from 'react'

export function useWindowSize() {
	const [windowSize, setWindowSize] = useState<{
		width: number
		height: number
	}>({
		width: typeof window !== 'undefined' ? window.innerWidth : 0,
		height: typeof window !== 'undefined' ? window.innerHeight : 0,
	})

	useEffect(() => {
		let timeoutId: NodeJS.Timeout

		function handleResize() {
			clearTimeout(timeoutId)
			timeoutId = setTimeout(() => {
				setWindowSize({
					width: window.innerWidth,
					height: window.innerHeight,
				})
			}, 150)
		}

		window.addEventListener('resize', handleResize, { passive: true })

		return () => {
			clearTimeout(timeoutId)
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	return windowSize
}
