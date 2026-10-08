// The code samples of the User Types page, shared by every language

export const hierarchy = `base-user (abstract)
└── person (abstract)       + phone, birth_date
    ├── customer            + loyalty_tier, addresses
    └── employee (sealed)   + department, employee_no`

export const userType = `{
	"_id": "66f1c0d2a4b5c6d7e8f90130",
	"name": "Customer",
	"slug": "customer",
	"description": "People who buy from us",
	"baseType": "person",
	"isAbstract": false,
	"isSealed": false,
	"allowAdditionalProperties": false,
	"properties": {
		"loyalty_tier": {
			"type": "enum",
			"displayName": "Loyalty Tier",
			"items": [
				{ "displayName": "Bronze", "value": "bronze" },
				{ "displayName": "Silver", "value": "silver" },
				{ "displayName": "Gold", "value": "gold" }
			],
			"defaultValue": "bronze"
		},
		"customer_no": {
			"type": "string",
			"isRequired": true,
			"isUnique": true,
			"regexPattern": "^C[0-9]{8}$"
		},
		"addresses": {
			"type": "array",
			"maxCount": 5,
			"itemSchema": {
				"type": "object",
				"properties": {
					"label": { "type": "string", "isRequired": true },
					"city": { "type": "string", "isRequired": true },
					"location": { "type": "location" }
				}
			}
		}
	},
	"membership_id": "66f1c0d2a4b5c6d7e8f90123",
	"sys": { "created_at": "2026-01-01T12:00:00Z", "created_by": "admin" }
}`

export const phone = `"phone": {
	"type": "string",
	"displayName": "Phone",
	"maxLength": 20,
	"regexPattern": "^\\\\+?[0-9 ()-]{7,20}$"
}`

export const birthDate = `"birth_date": {
	"type": "date",
	"minValue": "1926-01-01"
}`

export const interests = `"interests": {
	"type": "enum",
	"isMultiple": true,
	"items": [
		{ "displayName": "Sports", "value": "sports" },
		{ "displayName": "Music", "value": "music" },
		{ "displayName": "Travel", "value": "travel" }
	]
}`

export const manager = `"manager": {
	"type": "reference",
	"referenceType": "single",
	"contentType": "employee"
}`

export const get = `GET /memberships/{membershipId}/user-types/{id}`

export const relations = `GET /memberships/{membershipId}/user-types/relations/customer`

export const relationsResponse = `{
	"base-user": [ "firstname", "lastname", "username", "email_address", "role", "…" ],
	"person": [ "phone", "birth_date" ],
	"customer": [ "loyalty_tier", "customer_no", "addresses" ]
}`

export const create = `curl -X POST https://auth.example.com/memberships/<membership_id>/user-types \\
	-H 'Authorization: Bearer <access_token>' \\
	-H 'Content-Type: application/json' \\
	-d '{
		"name": "Employee",
		"baseType": "person",
		"isSealed": true,
		"properties": {
			"department": { "type": "string", "isRequired": true },
			"employee_no": { "type": "integer", "isUnique": true, "minimum": 1 }
		}
	}'`

export const update = `PUT /memberships/{membershipId}/user-types/{id}`

export const remove = `DELETE /memberships/{membershipId}/user-types/{id}`
