export interface LanyardResponse {
	success: boolean
	data: LanyardData
}

export interface LanyardData {
	discord_user: DiscordUser
	discord_status: 'online' | 'idle' | 'dnd' | 'offline' | 'invisible'
	activities: Activity[]
}

export interface DiscordUser {
	id: string
	username: string
	global_name?: string
	avatar?: string
	avatar_decoration_data?: {
		asset: string
	}
}

export interface Activity {
	type: number
	name: string
	details?: string
	state?: string
	application_id?: string
	assets?: {
		large_image?: string
		small_image?: string
	}
	timestamps?: {
		start?: number
		end?: number
	}
}

export interface DiscordPresence {
	username: string
	activity: string
	details: string
	state: string
	image: string
	smallImage: string
	isActivity: boolean
	elapsed: string
	avatar: string
	decoration: string
	status: string
	startTimestamp: number | null
}
