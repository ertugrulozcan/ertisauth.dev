// The code samples of the External Identity Providers page

export const diagram = {
	en: `Your app ──(1) provider sign-in──▶ Google / Apple / Facebook / Microsoft
    │                                          │
    │◀──────────(2) provider token ────────────┘
    │
    └──(3) POST /oauth/{slug}/login ──▶ ErtisAuth ──(4) verify──▶ provider
                                           │
    ◀──────────(5) ErtisAuth tokens ───────┘`,
	tr: `Uygulama ──(1) sağlayıcı girişi──▶ Google / Apple / Facebook / Microsoft
    │                                          │
    │◀──────────(2) sağlayıcı token'ı ─────────┘
    │
    └──(3) POST /oauth/{slug}/login ──▶ ErtisAuth ──(4) doğrula─▶ sağlayıcı
                                           │
    ◀──────────(5) ErtisAuth token'ları ───┘`,
}

export const provider = `{
	"_id": "66f1c0d2a4b5c6d7e8f90180",
	"type": "Google",
	"name": "Google",
	"slug": "google",
	"description": "Sign in with Google for the web app",
	"defaultRole": "customer",
	"defaultUserType": "customer",
	"appClientId": "1234567890-abc.apps.googleusercontent.com",
	"isActive": true,
	"trust_email": false,
	"membership_id": "66f1c0d2a4b5c6d7e8f90123"
}`

export const signIn = `POST /oauth/{slug}/login
X-Ertis-Alias: <membership_id>
Content-Type: application/json`

export const google = `{
	"clientId": "1234567890-abc.apps.googleusercontent.com",
	"token": {
		"idToken": "eyJhbGciOiJSUzI1NiIs…"
	}
}`

export const facebook = `{
	"appId": "<facebook_app_id>",
	"user": {
		"id": "<facebook_user_id>",
		"first_name": "Ada",
		"last_name": "Lovelace",
		"email": "ada@example.com",
		"accessToken": "<facebook_access_token>"
	}
}`

export const microsoft = `{
	"clientId": "<application_client_id>",
	"token": {
		"accessToken": "<access_token_for_microsoft_graph>"
	}
}`

export const apple = `{
	"authorization": {
		"code": "<authorization_code>",
		"id_token": "<id_token>"
	},
	"user": {
		"name": { "firstName": "Ada", "lastName": "Lovelace" },
		"email": "ada@example.com"
	}
}`

export const connectedAccounts = `"connected_accounts": [
	{ "provider": "Google", "slug": "google", "user_id": "109876543210987654321" }
]`

export const activeProviders = `[
	{ "_id": "…", "name": "Google", "slug": "google", "type": "Google", "appClientId": "1234567890-abc.apps.googleusercontent.com", "membership_id": "…" },
	{ "_id": "…", "name": "Apple", "slug": "apple", "type": "Apple", "appClientId": "com.example.web", "redirectUri": "https://app.example.com/auth/apple", "membership_id": "…" },
	{ "_id": "…", "name": "Microsoft", "slug": "microsoft", "type": "Microsoft", "appClientId": "…", "tenantId": "…", "membership_id": "…" }
]`

export const create = `curl -X POST https://auth.example.com/memberships/<membership_id>/providers \\
	-H 'Authorization: Bearer <access_token>' \\
	-H 'Content-Type: application/json' \\
	-d '{
		"type": "Apple",
		"name": "Sign in with Apple",
		"slug": "apple",
		"defaultRole": "customer",
		"defaultUserType": "customer",
		"appClientId": "com.example.web",
		"teamId": "ABCDE12345",
		"privateKeyId": "XYZ987WVU6",
		"privateKey": "-----BEGIN PRIVATE KEY-----\\nMIGTAgEAMBMG…\\n-----END PRIVATE KEY-----",
		"redirectUri": "https://app.example.com/auth/apple",
		"isActive": true
	}'`

export const update = `PUT /memberships/{membershipId}/providers/{id}`

export const remove = `DELETE /memberships/{membershipId}/providers/{id}`
