// The code samples of the Device Code Flow page

export const diagram = {
	en: `Device                                    ErtisAuth                          Your site (user signed in)
  │  POST /codes                              │                                          │
  │─────────────────────────────────────────▶ │                                          │
  │  { user_code: "K7Q2XD9M",                 │                                          │
  │    device_code: "…", interval: 5 }        │                                          │
  │◀───────────────────────────────────────── │                                          │
  │  shows "K7Q2-XD9M"                        │              user types K7Q2XD9M         │
  │                                           │   GET /codes/K7Q2XD9M  (device info)     │
  │                                           │ ◀─────────────────────────────────────── │
  │                                           │   POST /codes/K7Q2XD9M/approve           │
  │                                           │ ◀─────────────────────────────────────── │
  │  POST /codes/token { device_code }        │                                          │
  │  (every \`interval\` seconds)               │                                          │
  │─────────────────────────────────────────▶ │                                          │
  │  201 { access_token, … }                  │                                          │
  │◀───────────────────────────────────────── │                                          │`,
	tr: `Cihaz                                     ErtisAuth                          Siteniz (kullanıcı girişli)
  │  POST /codes                              │                                          │
  │─────────────────────────────────────────▶ │                                          │
  │  { user_code: "K7Q2XD9M",                 │                                          │
  │    device_code: "…", interval: 5 }        │                                          │
  │◀───────────────────────────────────────── │                                          │
  │  ekranda K7Q2-XD9M                        │         kullanıcı K7Q2XD9M girer         │
  │                                           │   GET /codes/K7Q2XD9M  (cihaz bilgisi)   │
  │                                           │ ◀─────────────────────────────────────── │
  │                                           │   POST /codes/K7Q2XD9M/approve           │
  │                                           │ ◀─────────────────────────────────────── │
  │  POST /codes/token { device_code }        │                                          │
  │  (her \`interval\` saniyede)                │                                          │
  │─────────────────────────────────────────▶ │                                          │
  │  201 { access_token, … }                  │                                          │
  │◀───────────────────────────────────────── │                                          │`,
}

export const policy = `{
	"_id": "66f1c0d2a4b5c6d7e8f90160",
	"name": "TV Codes",
	"slug": "tv-codes",
	"description": "8 characters, easy to read on a TV",
	"length": 8,
	"contains_letters": true,
	"contains_digits": true,
	"expires_in": 300,
	"membership_id": "66f1c0d2a4b5c6d7e8f90123"
}`

export const createPolicy = `curl -X POST https://auth.example.com/memberships/<membership_id>/code-policies \\
	-H 'Authorization: Bearer <access_token>' \\
	-H 'Content-Type: application/json' \\
	-d '{ "name": "TV Codes", "length": 8, "contains_letters": true, "contains_digits": true, "expires_in": 300 }'`

export const generate = `POST /memberships/{membershipId}/codes
Authorization: Basic <application_id>:<secret>
X-IpAddress: 203.0.113.42
X-UserAgent: LivingRoomTV/2.4 (Tizen 7.0)`

export const generateResponse = `{
	"_id": "66f1c0d2a4b5c6d7e8f90170",
	"user_code": "K7Q2XD9M",
	"device_code": "Qm9xZ1pWc2F0aE5vV2xvUjNjZ2dXbFFmZ3NtWm9Kdw",
	"status": "pending",
	"expires_in": 300,
	"interval": 5,
	"created_at": "2026-01-01T12:00:00Z",
	"expire_time": "2026-01-01T12:05:00Z",
	"client_info": { "ip_address": "203.0.113.42", "user_agent": "LivingRoomTV/2.4 (Tizen 7.0)" },
	"membership_id": "66f1c0d2a4b5c6d7e8f90123"
}`

export const show = `GET /memberships/{membershipId}/codes/K7Q2XD9M
Authorization: Bearer <user_access_token>`

export const approve = `POST /memberships/{membershipId}/codes/K7Q2XD9M/approve
Authorization: Bearer <user_access_token>`

export const deny = `POST /memberships/{membershipId}/codes/K7Q2XD9M/deny
Authorization: Bearer <user_access_token>`

export const token = `POST /memberships/{membershipId}/codes/token
Content-Type: application/json

{ "device_code": "Qm9xZ1pWc2F0aE5vV2xvUjNjZ2dXbFFmZ3NtWm9Kdw" }`

export const deviceLoop = `const code = await post(\`/memberships/\${membershipId}/codes\`); // through your backend
showOnScreen(code.user_code.replace(/(.{4})/, "$1-"), "https://example.com/tv");

let interval = code.interval;
while (Date.now() < Date.parse(code.expire_time)) {
	await sleep(interval * 1000);
	const response = await post(\`/memberships/\${membershipId}/codes/token\`, { device_code: code.device_code });
	if (response.status === 201) return signIn(response.body);
	const { errorCode } = response.body;
	if (errorCode === "TokenCodeSlowDown") interval += 5;
	else if (errorCode !== "UnauthorizedTokenCode") break; // denied, expired, …
}
offerANewCode();`
