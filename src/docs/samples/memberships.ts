// The code samples of the Memberships page, shared by every language

export const membership = `{
	"_id": "66f1c0d2a4b5c6d7e8f90123",
	"name": "My Company",
	"slug": "my-company",
	"expires_in": 3600,
	"scoped_token_expires_in": 900,
	"refresh_token_expires_in": 86400,
	"reset_password_token_expires_in": 1800,
	"secret_key": "<at least 32 bytes>",
	"hash_algorithm": "ARGON2ID",
	"encoding": "UTF-8",
	"default_language": "en",
	"user_activation": "active",
	"code_policy": "tv-codes",
	"otp_settings": {
		"host": "https://app.example.com/reset-password",
		"policy": {
			"length": 6,
			"contains_letters": false,
			"contains_digits": true,
			"expires_in": 300,
			"max_attempts": 5
		}
	},
	"mail_providers": [
		{
			"type": "SmtpServer",
			"name": "Company SMTP",
			"slug": "company-smtp",
			"host": "smtp.example.com",
			"port": 587,
			"tls_enabled": true,
			"username": "no-reply@example.com",
			"password": "<password>"
		}
	],
	"sys": { "created_at": "2026-01-01T12:00:00Z", "created_by": "system" }
}`

export const mailProviders = `"mail_providers": [
	{ "type": "SendGrid", "name": "SendGrid", "slug": "sendgrid", "apiKey": "<api_key>" },
	{ "type": "MailChimp", "name": "Mandrill", "slug": "mandrill", "apiKey": "<api_key>" }
]`

export const get = `GET /memberships/{id}
Authorization: Bearer <access_token>`

export const create = `curl -X POST https://auth.example.com/memberships \\
	-H 'Authorization: Bearer <access_token>' \\
	-H 'Content-Type: application/json' \\
	-d '{
		"name": "Mobile App",
		"expires_in": 3600,
		"refresh_token_expires_in": 2592000,
		"secret_key": "<random string of at least 32 bytes>",
		"hash_algorithm": "ARGON2ID",
		"encoding": "UTF-8"
	}'`

export const update = `PUT /memberships/{id}`

export const remove = `DELETE /memberships/{id}`

export const settings = `{
	"encodings": [ { "displayName": "Unicode (UTF-8)", "name": "UTF-8" } ],
	"defaultEncoding": "UTF-8",
	"hashAlgorithms": [ "MD5", "SHA1", "SHA2-224", "SHA2-256", "SHA2-384", "SHA2-512", "SHA2-512-224", "SHA2-512-256", "SHA3-224", "SHA3-256", "SHA3-384", "SHA3-512", "ARGON2ID", "PBKDF2-SHA256", "PBKDF2-SHA512" ],
	"defaultHashAlgorithm": "ARGON2ID",
	"dbLocales": [ { "Name": "None", "ISO6391Code": "none" }, { "Name": "Turkish", "ISO6391Code": "tr" } ],
	"defaultDbLocale": "none"
}`
