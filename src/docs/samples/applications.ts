// The code samples of the Applications page, shared by every language

export const basicHeader = `Authorization: Basic <application_id>:<secret>`

export const application = `{
	"_id": "66f1c0d2a4b5c6d7e8f90126",
	"name": "Backend",
	"slug": "backend",
	"role": "backend-service",
	"permissions": [ "users.create" ],
	"forbidden": [],
	"membership_id": "66f1c0d2a4b5c6d7e8f90123",
	"sys": { "created_at": "2026-01-01T12:00:00Z", "created_by": "admin" }
}`

export const create = `curl -X POST https://auth.example.com/memberships/<membership_id>/applications \\
	-H 'Authorization: Bearer <access_token>' \\
	-H 'Content-Type: application/json' \\
	-d '{
		"name": "Billing Service",
		"role": "billing"
	}'`

export const createResponse = `{
	"_id": "66f1c0d2a4b5c6d7e8f90140",
	"name": "Billing Service",
	"slug": "billing-service",
	"role": "billing",
	"membership_id": "66f1c0d2a4b5c6d7e8f90123",
	"secret": "<application_secret>",
	"sys": { "created_at": "2026-01-01T12:00:00Z", "created_by": "admin" }
}`

export const update = `PUT /memberships/{membershipId}/applications/{id}`

export const rotateSecret = `POST /memberships/{membershipId}/applications/{id}/secret
Authorization: Bearer <access_token>`

export const remove = `DELETE /memberships/{membershipId}/applications/{id}`

export const useBasicToken = `curl https://auth.example.com/memberships/<membership_id>/users?limit=10 \\
	-H 'Authorization: Basic 66f1c0d2a4b5c6d7e8f90140:<application_secret>'`

export const legacySwitch = `{ "allow_membership_secret_for_applications": true }`
