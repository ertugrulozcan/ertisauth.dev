// The code samples of the Getting Started page, shared by every language

export const fromSource = `git clone https://github.com/ertugrulozcan/ErtisAuth.git
cd ErtisAuth
export Database__ConnectionString="mongodb://localhost:27017"
dotnet run --project src/ErtisAuth.WebAPI`

export const dockerCompose = `git clone https://github.com/ertugrulozcan/ErtisAuth.git
cd ErtisAuth
docker compose up -d --build`

export const docker = `docker build -t ertisauth:latest .
docker run -p 9716:8080 \\
	-e Database__ConnectionString="mongodb://<host>:27017" \\
	ertisauth:latest`

export const healthCheck = `curl http://localhost:9716/healthcheck`

export const healthCheckResponse = `{
	"status": "Unhealthy",
	"message": "ErtisAuth has not been set up yet"
}`

export const setupToken = `openssl rand -hex 32`

export const insertSetupToken = `use auth
db.setup.insertOne({ token: "<setup_token>" })`

export const insertSetupTokenCompose = `docker compose exec mongo mongosh auth --eval 'db.setup.insertOne({ token: "<setup_token>" })'`

export const setup = `curl -X POST http://localhost:9716/setup \\
	-H 'X-Setup-Token: <setup_token>' \\
	-H 'Content-Type: application/json' \\
	-d '{
		"membership": {
			"name": "My Company",
			"slug": "my-company",
			"expires_in": 3600,
			"refresh_token_expires_in": 86400,
			"hash_algorithm": "ARGON2ID",
			"encoding": "UTF-8"
		},
		"user": {
			"username": "admin",
			"firstname": "Ada",
			"lastname": "Lovelace",
			"email_address": "admin@example.com",
			"password": "<a strong password>",
			"user_type": "Employee"
		},
		"application": {
			"name": "Backend",
			"role": "admin"
		}
	}'`

export const setupResponse = `{
	"membership": {
		"_id": "66f1c0d2a4b5c6d7e8f90123",
		"name": "My Company",
		"slug": "my-company",
		"expires_in": 3600,
		"refresh_token_expires_in": 86400,
		"secret_key": "…",
		"hash_algorithm": "ARGON2ID",
		"encoding": "UTF-8",
		"…": "…"
	},
	"user": { "_id": "66f1c0d2a4b5c6d7e8f90124", "username": "admin", "role": "admin", "…": "…" },
	"role": { "_id": "66f1c0d2a4b5c6d7e8f90125", "name": "Administrator", "slug": "admin", "permissions": [ "*.memberships.create.*", "…" ] },
	"application": {
		"_id": "66f1c0d2a4b5c6d7e8f90126",
		"name": "Backend",
		"slug": "backend",
		"role": "admin",
		"secret": "<application_secret>"
	}
}`

export const signIn = `curl -X POST http://localhost:9716/generate-token \\
	-H 'X-Ertis-Alias: <membership_id>' \\
	-H 'Content-Type: application/json' \\
	-d '{ "username": "admin", "password": "<password>" }'`

export const signInResponse = `{
	"token_type": "Bearer",
	"access_token": "eyJhbGciOiJIUzI1NiIs…",
	"expires_in": 3600,
	"refresh_token": "eyJhbGciOiJIUzI1NiIs…",
	"refresh_token_expires_in": 86400,
	"created_at": "2026-01-01T12:00:00Z"
}`

export const me = `curl http://localhost:9716/me -H 'Authorization: Bearer <access_token>'`

export const listUsers = `curl 'http://localhost:9716/memberships/<membership_id>/users?limit=10&with_count=true' \\
	-H 'Authorization: Bearer <access_token>'`

export const basicToken = `curl 'http://localhost:9716/memberships/<membership_id>/users' \\
	-H 'Authorization: Basic <application_id>:<application_secret>'`
