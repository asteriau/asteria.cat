import type { Repository } from '@/types/github'

export async function fetchRepository(
	url: string,
	token?: string
): Promise<Repository | null> {
	try {
		const headers: HeadersInit = {
			Accept: 'application/vnd.github.v3+json',
			...(token && { Authorization: `Bearer ${token}` }),
		}

		const res = await fetch(url, { headers })
		if (!res.ok) return null
		return (await res.json()) as Repository
	} catch {
		return null
	}
}
