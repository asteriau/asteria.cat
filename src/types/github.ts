export interface Repository {
	id: number
	name: string
	full_name: string
	description: string | null
	html_url: string
	language: string | null
	updated_at: string
	owner: {
		login: string
		avatar_url: string
	}
}
