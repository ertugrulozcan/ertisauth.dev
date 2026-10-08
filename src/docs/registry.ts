// The pages of the documentation, in the order of the sidebar. Titles and descriptions are in the message files
// (docs.pages.<slug>); the content of each page is a component per language, registered in ./content.ts.

export const docGroups = [
	{
		key: "guides",
		pages: [
			"getting-started",
			"configuration",
			"core-concepts",
			"api-conventions",
			"authentication",
			"authorization",
			"account-recovery",
			"device-code-flow",
			"external-providers",
			"sdk",
			"operations",
		],
	},
	{
		key: "api",
		pages: [
			"memberships",
			"users",
			"user-types",
			"roles",
			"applications",
			"sessions",
			"events",
			"webhooks",
			"mail-hooks",
			"error-codes",
		],
	},
] as const

export type DocGroup = (typeof docGroups)[number]["key"]
export type DocSlug = (typeof docGroups)[number]["pages"][number]
