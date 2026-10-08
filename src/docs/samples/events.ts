// The code samples of the Events page, shared by every language

export const event = `{
	"_id": "66f1c0d2a4b5c6d7e8f90190",
	"event_type": "UserUpdated",
	"utilizer_id": "66f1c0d2a4b5c6d7e8f90124",
	"document": {
		"_id": "66f1c0d2a4b5c6d7e8f90127",
		"username": "ada",
		"lastname": "King",
		"…": "…"
	},
	"prior": {
		"_id": "66f1c0d2a4b5c6d7e8f90127",
		"username": "ada",
		"lastname": "Lovelace",
		"…": "…"
	},
	"event_time": "2026-01-05T09:12:44Z",
	"membership_id": "66f1c0d2a4b5c6d7e8f90123"
}`

export const userSignIns = `curl -X POST 'https://auth.example.com/memberships/<membership_id>/events/_query?limit=20&sort=event_time%20desc' \\
	-H 'Authorization: Bearer <access_token>' \\
	-H 'Content-Type: application/json' \\
	-d '{
		"where": {
			"event_type": "TokenGenerated",
			"utilizer_id": "66f1c0d2a4b5c6d7e8f90127"
		}
	}'`

export const roleChanges = `{
	"where": {
		"event_type": { "$in": [ "RoleCreated", "RoleUpdated", "RoleDeleted" ] },
		"event_time": { "$gte": "2026-01-01T00:00:00Z" }
	},
	"select": { "event_type": 1, "utilizer_id": 1, "event_time": 1, "document.slug": 1 }
}`

export const failedWebhooks = `{ "where": { "event_type": "WebhookRequestFailed" } }`
