// The code samples of the Mail Hooks page, shared by every language

export const mailHook = `{
	"_id": "66f1c0d2a4b5c6d7e8f901b0",
	"name": "Welcome",
	"slug": "welcome",
	"description": "Sent to every new user",
	"event": "UserCreated",
	"status": "active",
	"mailProvider": "company-smtp",
	"fromName": "My Company",
	"fromAddress": "no-reply@example.com",
	"sendToUtilizer": false,
	"recipients": [
		{ "displayName": "{{document.firstname}} {{document.lastname}}", "emailAddress": "{{document.email_address}}" }
	],
	"mailSubject": "Welcome to My Company, {{document.firstname}}!",
	"mailTemplate": "<h1>Welcome, {{document.firstname}}!</h1><p>Your username is <b>{{document.username}}</b>.</p>",
	"membership_id": "66f1c0d2a4b5c6d7e8f90123"
}`

export const passwordChangedNotice = `{
	"name": "Password Changed Notice",
	"event": "UserPasswordChanged",
	"status": "active",
	"mailProvider": "company-smtp",
	"fromName": "My Company Security",
	"fromAddress": "security@example.com",
	"recipients": [ { "displayName": "{{document.firstname}}", "emailAddress": "{{document.email_address}}" } ],
	"mailSubject": "Your password was changed",
	"mailTemplate": "<p>Hi {{document.firstname}},</p><p>The password of your account was changed on {{event_time}}. If this wasn't you, contact us immediately.</p>"
}`

export const variables = `"variables": [
	{ "key": "FIRST_NAME", "value": "{{document.firstname}}" },
	{ "key": "USERNAME", "value": "{{document.username}}" }
]`
