import { NextRequest, NextResponse } from 'next/server'
import { fetchDiscordPresence } from '@/lib/api/lanyard'

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams
	const discordId = searchParams.get('discordId')

	if (!discordId) {
		return NextResponse.json(
			{ error: 'Discord ID is required' },
			{ status: 400 }
		)
	}

	try {
		const presence = await fetchDiscordPresence(discordId)
		if (!presence) {
			return NextResponse.json(
				{ error: 'Failed to fetch Discord presence' },
				{ status: 500 }
			)
		}

		return NextResponse.json(presence, {
			headers: {
				'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
			},
		})
	} catch (error) {
		console.error('Error fetching Discord presence:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
