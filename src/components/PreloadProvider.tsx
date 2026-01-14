'use client'

import { usePreload } from '@/hooks/usePreload'

export function PreloadProvider() {
	usePreload()
	return null
}
