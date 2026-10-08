// The code samples of the API Conventions page, shared by every language

export const error = `{
	"message": "User not found in db by given _id: <66f1c0d2a4b5c6d7e8f90124>",
	"errorCode": "UserNotFound",
	"statusCode": 404
}`

export const modelValidationError = `{
	"message": "Some fields are not validated, invalid or missing. Check response detail.",
	"errorCode": "ModelValidationError",
	"statusCode": 400,
	"data": [ "Expires-in is required", "Secret key is required" ]
}`

export const fieldValidationError = `{
	"message": "String length can not be greater than 20",
	"fieldName": "phone",
	"fieldPath": "phone",
	"errorCode": "FieldValidationException",
	"statusCode": 400
}`

export const validationErrors = `{
	"message": "…",
	"errorCode": "ValidationException",
	"statusCode": 400,
	"errors": [
		{ "message": "phone is required", "fieldName": "phone", "fieldPath": "phone" },
		{ "message": "String length can not be less than 2", "fieldName": "firstname", "fieldPath": "firstname" }
	]
}`

export const list = `curl 'https://auth.example.com/memberships/<membership_id>/users?skip=0&limit=2&with_count=true&sort=sys.created_at%20desc' \\
	-H 'Authorization: Bearer <access_token>'`

export const listResponse = `{
	"count": 1250,
	"items": [
		{ "_id": "…", "username": "jane", "…": "…" },
		{ "_id": "…", "username": "john", "…": "…" }
	]
}`

export const query = `curl -X POST 'https://auth.example.com/memberships/<membership_id>/users/_query?limit=50&sort=lastname' \\
	-H 'Authorization: Bearer <access_token>' \\
	-H 'Content-Type: application/json' \\
	-d '{
		"where": {
			"user_type": "customer",
			"is_active": true,
			"sys.created_at": { "$gte": "2026-01-01T00:00:00Z" }
		},
		"select": {
			"username": 1,
			"email_address": 1,
			"firstname": 1
		}
	}'`

export const aggregate = `curl -X POST 'https://auth.example.com/memberships/<membership_id>/active-tokens/_aggregate' \\
	-H 'Authorization: Bearer <access_token>' \\
	-H 'Content-Type: application/json' \\
	-d '[
		{ "$group": { "_id": "$user_id", "sessions": { "$sum": 1 } } },
		{ "$sort": { "sessions": -1 } },
		{ "$limit": 10 }
	]'`

export const search = `curl 'https://auth.example.com/memberships/<membership_id>/users/search?keyword=lovelace&limit=10' \\
	-H 'Authorization: Bearer <access_token>'`

export const bulkDelete = `curl -X DELETE 'https://auth.example.com/memberships/<membership_id>/users' \\
	-H 'Authorization: Bearer <access_token>' \\
	-H 'Content-Type: application/json' \\
	-d '[ "66f1c0d2a4b5c6d7e8f90124", "66f1c0d2a4b5c6d7e8f90127" ]'`
