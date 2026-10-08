// The code samples of the Sessions page, shared by every language

export const activeToken = `{
	"_id": "66f1c0d2a4b5c6d7e8f901c0",
	"access_token": "eyJhbGciOiJIUzI1NiIs…",
	"refresh_token": "eyJhbGciOiJIUzI1NiIs…",
	"token_type": "Bearer",
	"expires_in": 3600,
	"refresh_token_expires_in": 86400,
	"created_at": "2026-01-01T12:00:00Z",
	"expire_time": "2026-01-01T13:00:00Z",
	"retain_until": "2026-01-02T12:00:00Z",
	"user_id": "66f1c0d2a4b5c6d7e8f90127",
	"username": "ada",
	"email_address": "ada@example.com",
	"first_name": "Ada",
	"last_name": "Lovelace",
	"client_info": {
		"ip_address": "203.0.113.42",
		"user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) …"
	},
	"membership_id": "66f1c0d2a4b5c6d7e8f90123"
}`

export const userSessions = `curl -X POST 'https://auth.example.com/memberships/<membership_id>/active-tokens/_query?sort=created_at%20desc' \\
	-H 'Authorization: Bearer <access_token>' \\
	-H 'Content-Type: application/json' \\
	-d '{
		"where": { "user_id": "66f1c0d2a4b5c6d7e8f90127" },
		"select": { "access_token": 0, "refresh_token": 0 }
	}'`

export const dailyUsers = `[
	{ "$group": { "_id": { "$dateToString": { "format": "%Y-%m-%d", "date": "$created_at" } }, "users": { "$addToSet": "$user_id" } } },
	{ "$project": { "day": "$_id", "count": { "$size": "$users" } } },
	{ "$sort": { "day": -1 } }
]`

export const revokedToken = `{
	"_id": "66f1c0d2a4b5c6d7e8f901d0",
	"token": "eyJhbGciOiJIUzI1NiIs…",
	"token_type": "Bearer",
	"revoked_at": "2026-01-01T12:30:00Z",
	"retain_until": "2026-01-02T12:00:00Z",
	"user_id": "66f1c0d2a4b5c6d7e8f90127",
	"username": "ada",
	"email_address": "ada@example.com",
	"first_name": "Ada",
	"last_name": "Lovelace",
	"membership_id": "66f1c0d2a4b5c6d7e8f90123"
}`
