// The code samples of the Account Recovery page, shared by every language

export const accountPagesRole = `{
	"name": "Account Pages",
	"slug": "account-pages",
	"permissions": [ "users.read", "users.update", "users.create" ]
}`

export const activationMailHook = `{
	"name": "User Activation",
	"event": "UserCreated",
	"status": "active",
	"mailProvider": "company-smtp",
	"fromName": "My Company",
	"fromAddress": "no-reply@example.com",
	"sendToUtilizer": false,
	"recipients": [ { "displayName": "{{user.firstname}}", "emailAddress": "{{user.email_address}}" } ],
	"mailSubject": "Activate your account",
	"mailTemplate": "<p>Hi {{user.firstname}},</p><p><a href=\\"{{activationLink}}\\">Activate your account</a></p>"
}`

export const createUser = `POST /memberships/{membershipId}/users
X-Host: https://app.example.com/activate`

export const activate = `GET /memberships/{membershipId}/users/activation?uat=<code>
Authorization: Basic <application_id>:<secret>`

export const resendActivation = `POST /memberships/{membershipId}/users/resend-activation-mail
X-Host: https://app.example.com/activate
Content-Type: application/json

{ "email_address": "ada@example.com" }`

export const resendActivationResponse = `{ "emailAddress": "ada@example.com" }`

export const resetMailHook = `{
	"name": "Reset Password",
	"event": "UserPasswordReset",
	"status": "active",
	"mailProvider": "company-smtp",
	"fromName": "My Company",
	"fromAddress": "no-reply@example.com",
	"recipients": [ { "displayName": "{{user.firstname}}", "emailAddress": "{{user.email_address}}" } ],
	"mailSubject": "Reset your password",
	"mailTemplate": "<p>Hi {{user.firstname}},</p><p><a href=\\"{{resetPasswordLink}}\\">Choose a new password</a>. The link expires soon.</p>"
}`

export const requestReset = `POST /memberships/{membershipId}/users/reset-password
Authorization: Basic <application_id>:<secret>
X-Host: https://app.example.com/reset-password
Content-Type: application/json

{ "email_address": "ada@example.com" }`

export const requestResetResponse = `{
	"message": "Reset token generated",
	"expiresIn": 7200
}`

export const verifyResetToken = `GET /memberships/{membershipId}/users/verify-reset-token?token=<code>
Authorization: Basic <application_id>:<secret>`

export const verifyResetTokenResponse = `{ "email_address": "ada@example.com" }`

export const setPassword = `POST /memberships/{membershipId}/users/set-password
Authorization: Basic <application_id>:<secret>
Content-Type: application/json

{
	"email_address": "ada@example.com",
	"reset_token": "<code>",
	"password": "<new password>"
}`

export const otpSettings = `"otp_settings": {
	"host": "https://app.example.com/reset-password",
	"policy": {
		"length": 6,
		"contains_letters": false,
		"contains_digits": true,
		"expires_in": 300,
		"max_attempts": 5
	}
}`

export const generateOtp = `GET /memberships/{membershipId}/users/{userId}/generate-otp
Authorization: Basic <application_id>:<secret>`

export const generateOtpResponse = `{
	"_id": "66f1c0d2a4b5c6d7e8f90150",
	"user_id": "66f1c0d2a4b5c6d7e8f90127",
	"email_address": "ada@example.com",
	"username": "ada",
	"password": "482913",
	"expires_in": 300,
	"created_at": "2026-01-01T12:00:00Z",
	"expire_time": "2026-01-01T12:05:00Z",
	"membership_id": "66f1c0d2a4b5c6d7e8f90123"
}`

export const verifyOtp = `POST /verify-otp
X-Ertis-Alias: <membership_id>
X-Host: https://app.example.com/reset-password
Content-Type: application/json

{
	"username": "ada",
	"password": "482913"
}`

export const verifyOtpResponse = `{
	"reset_token": "NjZmMWMwZDJhNGI1YzZkN2U4ZjkwMTIzOmV5Smhi…",
	"expires_in": 300,
	"created_at": "2026-01-01T12:00:00Z"
}`
