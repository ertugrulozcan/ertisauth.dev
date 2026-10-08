// The code samples of the Authentication page, shared by every language

export const headers = `Authorization: Bearer eyJhbGciOiJIUzI1NiIs…
Authorization: Basic 66f1c0d2a4b5c6d7e8f90126:<application_secret>`

export const signInRequest = `POST /generate-token`

export const signInBody = `{
	"username": "ada@example.com",
	"password": "<password>"
}`

export const tokenResponse = `{
	"token_type": "Bearer",
	"access_token": "eyJhbGciOiJIUzI1NiIs…",
	"expires_in": 3600,
	"refresh_token": "eyJhbGciOiJIUzI1NiIs…",
	"refresh_token_expires_in": 86400,
	"created_at": "2026-01-01T12:00:00Z"
}`

export const signInFromBackend = `curl -X POST https://auth.example.com/generate-token \\
	-H 'X-Ertis-Alias: <membership_id>' \\
	-H 'X-IpAddress: 203.0.113.42' \\
	-H 'X-UserAgent: Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) …' \\
	-H 'Content-Type: application/json' \\
	-d '{ "username": "ada", "password": "<password>" }'`

export const scopedTokenRequest = `curl -X POST https://auth.example.com/generate-token \\
	-H 'X-Ertis-Alias: <membership_id>' \\
	-H 'Authorization: Bearer <access_token>' \\
	-H 'Content-Type: application/json' \\
	-d '{ "scopes": [ "users.read", "roles.read" ] }'`

export const scopedTokenResponse = `{
	"token_type": "Bearer",
	"access_token": "eyJhbGciOiJIUzI1NiIs…",
	"expires_in": 43200,
	"created_at": "2026-01-01T12:00:00Z",
	"scopes": [ "users.read", "roles.read" ]
}`

export const refreshGet = `GET /refresh-token
Authorization: Bearer <refresh_token>`

export const refreshPost = `POST /refresh-token
Content-Type: application/json

{ "token": "<refresh_token>" }`

export const verifyGet = `GET /verify-token
Authorization: Bearer <token>`

export const verifyPost = `POST /verify-token
Content-Type: application/json

{ "token": "Bearer <token>" }`

export const verifyResponse = `{
	"verified": true,
	"token": "eyJhbGciOiJIUzI1NiIs…",
	"token_kind": "access_token",
	"remaining_time": 2875
}`

export const me = `GET /me
Authorization: Bearer <access_token>`

export const meResponse = `{
	"_id": "66f1c0d2a4b5c6d7e8f90124",
	"username": "ada",
	"firstname": "Ada",
	"lastname": "Lovelace",
	"email_address": "ada@example.com",
	"role": "admin",
	"user_type": "employee",
	"permissions": [],
	"forbidden": [],
	"is_active": true,
	"source_provider": "ErtisAuth",
	"membership_id": "66f1c0d2a4b5c6d7e8f90123",
	"sys": { "created_at": "2026-01-01T12:00:00Z", "created_by": "system" }
}`

export const revokeGet = `GET /revoke-token
Authorization: Bearer <access_token>`

export const revokePost = `POST /revoke-token
Content-Type: application/json

{ "token": "<access_token>" }`
