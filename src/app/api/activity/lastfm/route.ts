import { NextRequest, NextResponse } from 'next/server'
import { fetchLastfmActivity } from '@/lib/api/lastfm'

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams
	const apiKey = searchParams.get('apiKey')
	const username = searchParams.get('username')

	if (!apiKey || !username) {
		return NextResponse.json(
			{ error: 'API key and username are required' },
			{ status: 400 }
		)
	}

	try {
		const activity = await fetchLastfmActivity(apiKey, username)
		return NextResponse.json(activity, {
			headers: {
				'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
			},
		})
	} catch (error) {
		console.error('Error fetching Last.fm activity:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
