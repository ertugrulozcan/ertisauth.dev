// The code samples of the Users page, shared by every language

export const user = `{
	"_id": "66f1c0d2a4b5c6d7e8f90127",
	"username": "ada",
	"email_address": "ada@example.com",
	"firstname": "Ada",
	"lastname": "Lovelace",
	"role": "support",
	"user_type": "employee",
	"permissions": [ "orders.approve" ],
	"forbidden": [],
	"is_active": true,
	"source_provider": "ErtisAuth",
	"connected_accounts": [],
	"membership_id": "66f1c0d2a4b5c6d7e8f90123",
	"sys": {
		"created_at": "2026-01-01T12:00:00Z",
		"created_by": "admin",
		"modified_at": "2026-01-05T09:12:44Z",
		"modified_by": "ada"
	},
	"department": "Engineering",
	"phone": "+44 20 7946 0000"
}`

export const get = `GET /memberships/{membershipId}/users/{id}
Authorization: Bearer <access_token>`

export const list = `GET /memberships/{membershipId}/users?skip=0&limit=20&with_count=true&sort=lastname
POST /memberships/{membershipId}/users/_query
GET /memberships/{membershipId}/users/search?keyword=ada`

export const queryByEmail = `curl -X POST 'https://auth.example.com/memberships/<membership_id>/users/_query' \\
	-H 'Authorization: Bearer <access_token>' \\
	-H 'Content-Type: application/json' \\
	-d '{ "where": { "email_address": "ada@example.com" } }'`

export const create = `curl -X POST https://auth.example.com/memberships/<membership_id>/users \\
	-H 'Authorization: Bearer <access_token>' \\
	-H 'X-Host: https://app.example.com/activate' \\
	-H 'Content-Type: application/json' \\
	-d '{
		"username": "ada",
		"email_address": "ada@example.com",
		"firstname": "Ada",
		"lastname": "Lovelace",
		"password": "<at least 6 characters>",
		"role": "support",
		"user_type": "employee",
		"department": "Engineering"
	}'`

export const duplicateError = `{
	"message": "…",
	"errorCode": "ValidationException",
	"statusCode": 400,
	"errors": [
		{
			"message": "The 'email_address' field has unique constraint. The same value is already using in another user.",
			"fieldName": "email_address",
			"fieldPath": "email_address"
		}
	]
}`

export const update = `PUT /memberships/{membershipId}/users/{id}`

export const updateRequest = `curl -X PUT https://auth.example.com/memberships/<membership_id>/users/<user_id> \\
	-H 'Authorization: Bearer <access_token>' \\
	-H 'Content-Type: application/json' \\
	-d '{ "lastname": "King", "department": "Research" }'`

export const remove = `DELETE /memberships/{membershipId}/users/{id}`

export const changePassword = `PUT /memberships/{membershipId}/users/{id}/change-password
Content-Type: application/json

{ "password": "<new password>" }`

export const checkPassword = `GET /memberships/{membershipId}/users/check-password?password=<password>
Authorization: Bearer <access_token>`

export const activate = `GET /memberships/{membershipId}/users/{id}/activate`

export const freeze = `GET /memberships/{membershipId}/users/{id}/freeze`
