// The code samples of the Authorization page, shared by every language

export const expression = `subject.resource.action.object`

export const role = `{
	"name": "Support Agent",
	"slug": "support",
	"permissions": [ "users.read", "users.update", "roles.read" ],
	"forbidden": [ "users.update.66f1c0d2a4b5c6d7e8f90124" ]
}`

export const user = `{
	"username": "agent-007",
	"role": "support",
	"permissions": [ "users.delete" ],
	"forbidden": [ "roles.read" ]
}`

export const checkForCaller = `GET /memberships/{membershipId}/roles/check-permission?permission=orders.approve
Authorization: Bearer <access_token>`

export const checkForRole = `GET /memberships/{membershipId}/roles/{roleId}/check-permission?permission=users.delete
Authorization: Bearer <access_token>`

export const ownApiRole = `{
	"name": "Warehouse Manager",
	"slug": "warehouse-manager",
	"permissions": [
		"orders.read",
		"orders.update",
		"orders.ship",
		"products"
	],
	"forbidden": [ "products.delete" ]
}`
