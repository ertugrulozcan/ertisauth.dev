// The code samples of the Roles page, shared by every language

export const role = `{
	"_id": "66f1c0d2a4b5c6d7e8f90131",
	"name": "Support Agent",
	"slug": "support",
	"description": "Can read and edit customers, but not delete them",
	"permissions": [
		"users.read",
		"users.update",
		"user-types.read",
		"roles.read"
	],
	"forbidden": [
		"users.delete"
	],
	"membership_id": "66f1c0d2a4b5c6d7e8f90123",
	"sys": { "created_at": "2026-01-01T12:00:00Z", "created_by": "admin" }
}`

export const create = `curl -X POST https://auth.example.com/memberships/<membership_id>/roles \\
	-H 'Authorization: Bearer <access_token>' \\
	-H 'Content-Type: application/json' \\
	-d '{
		"name": "Support Agent",
		"slug": "support",
		"permissions": [ "users.read", "users.update", "roles.read" ],
		"forbidden": [ "users.delete" ]
	}'`

export const update = `PUT /memberships/{membershipId}/roles/{id}`

export const remove = `DELETE /memberships/{membershipId}/roles/{id}`
