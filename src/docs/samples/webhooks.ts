// The code samples of the Webhooks page, shared by every language

export const webhook = `{
	"_id": "66f1c0d2a4b5c6d7e8f901a0",
	"name": "Sync new users to CRM",
	"slug": "sync-new-users-to-crm",
	"description": "Creates a contact for every new user",
	"event": "UserCreated",
	"status": "active",
	"try_count": 3,
	"request": {
		"method": "POST",
		"url": "https://crm.example.com/hooks/ertisauth/users/{{document._id}}",
		"headers": {
			"Authorization": "Bearer <crm_api_key>",
			"X-Source": "ertisauth"
		},
		"body": {
			"email": "{{document.email_address}}",
			"name": "{{document.firstname}} {{document.lastname}}",
			"source": "signup"
		},
		"uncoveredBody": false
	},
	"membership_id": "66f1c0d2a4b5c6d7e8f90123"
}`

export const coveredBody = `{
	"document": { "_id": "66f1c0d2a4b5c6d7e8f90127", "username": "ada", "email_address": "ada@example.com", "…": "…" },
	"prior": null,
	"payload": {
		"email": "ada@example.com",
		"name": "Ada Lovelace",
		"source": "signup"
	}
}`

export const uncoveredBody = `{
	"email": "ada@example.com",
	"name": "Ada Lovelace",
	"source": "signup"
}`

export const create = `curl -X POST https://auth.example.com/memberships/<membership_id>/webhooks \\
	-H 'Authorization: Bearer <access_token>' \\
	-H 'Content-Type: application/json' \\
	-d '{
		"name": "Notify on user deletion",
		"event": "UserDeleted",
		"status": "active",
		"try_count": 3,
		"request": {
			"method": "DELETE",
			"url": "https://shop.example.com/api/customers/{{prior._id}}",
			"headers": { "Authorization": "Bearer <shop_api_key>" }
		}
	}'`
