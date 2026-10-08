import { DocLink, H2, Table } from "@/components/docs/prose"

export default function Home() {
	return (
		<>
			<p>
				ErtisAuth is a self-hosted identity and access management (IAM) server built on ASP.NET Core and MongoDB. It signs users and applications in, issues tokens, and decides what each caller is allowed to do, for any number of applications that share the same users and permissions.
			</p>
			<p>
				This documentation is the complete guide to ErtisAuth: how it works, how to run it, and every endpoint of its REST API with request and response examples. The interactive OpenAPI reference (<code>/docs</code> on a development instance) lists the same endpoints; this documentation adds the concepts, the flows that combine several endpoints, and the rules that a schema alone can&apos;t show.
			</p>

			<H2 id="where-to-start">
				Where to start
			</H2>
			<Table>
				<thead>
					<tr>
						<th>
							If you want to...
						</th>
						<th>
							Read
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							Run ErtisAuth for the first time
						</td>
						<td>
							<DocLink to="getting-started">Getting Started</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Understand the building blocks
						</td>
						<td>
							<DocLink to="core-concepts">Core Concepts</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Learn the conventions shared by all endpoints
						</td>
						<td>
							<DocLink to="api-conventions">API Conventions</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Sign users in and work with tokens
						</td>
						<td>
							<DocLink to="authentication">Authentication</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Control who can do what
						</td>
						<td>
							<DocLink to="authorization">Authorization</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Protect your own .NET APIs with ErtisAuth
						</td>
						<td>
							<DocLink to="sdk">.NET SDK</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Run ErtisAuth in production
						</td>
						<td>
							<DocLink to="operations">Operations</DocLink>
						</td>
					</tr>
				</tbody>
			</Table>

			<H2 id="guides">
				Guides
			</H2>
			<ul>
				<li>
					<DocLink to="getting-started">Getting Started</DocLink>: install, configure, set up and get your first token.
				</li>
				<li>
					<DocLink to="configuration">Configuration</DocLink>: every setting of the server.
				</li>
				<li>
					<DocLink to="core-concepts">Core Concepts</DocLink>: memberships, users, user types, roles, applications and more.
				</li>
				<li>
					<DocLink to="api-conventions">API Conventions</DocLink>: routes, headers, pagination, queries and errors.
				</li>
				<li>
					<DocLink to="authentication">Authentication</DocLink>: tokens, sign-in, refresh, verification and sign-out.
				</li>
				<li>
					<DocLink to="authorization">Authorization</DocLink>: the RBAC and UBAC permission model.
				</li>
				<li>
					<DocLink to="account-recovery">Account Recovery and Activation</DocLink>: activation mails, password reset and one-time passwords.
				</li>
				<li>
					<DocLink to="device-code-flow">Device Code Flow</DocLink>: sign in on devices without a keyboard.
				</li>
				<li>
					<DocLink to="external-providers">External Identity Providers</DocLink>: Google, Apple, Facebook and Microsoft sign-in.
				</li>
				<li>
					<DocLink to="events">Events</DocLink>, <DocLink to="webhooks">Webhooks</DocLink> and <DocLink to="mail-hooks">Mail Hooks</DocLink>: react to what happens in a membership.
				</li>
				<li>
					<DocLink to="sdk">.NET SDK</DocLink>: the client SDK and the ASP.NET Core integration.
				</li>
				<li>
					<DocLink to="operations">Operations</DocLink>: health checks, metrics, logging, indexes and a production checklist.
				</li>
			</ul>

			<H2 id="api-reference">
				API reference
			</H2>
			<Table>
				<thead>
					<tr>
						<th>
							Resource
						</th>
						<th>
							Page
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							Setup, health check
						</td>
						<td>
							<DocLink to="getting-started">Getting Started</DocLink>, <DocLink to="operations">Operations</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Tokens
						</td>
						<td>
							<DocLink to="authentication">Authentication</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Active tokens, revoked tokens
						</td>
						<td>
							<DocLink to="sessions">Sessions</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Memberships
						</td>
						<td>
							<DocLink to="memberships">Memberships</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Users
						</td>
						<td>
							<DocLink to="users">Users</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							User types
						</td>
						<td>
							<DocLink to="user-types">User Types</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Roles
						</td>
						<td>
							<DocLink to="roles">Roles</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Applications
						</td>
						<td>
							<DocLink to="applications">Applications</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Providers
						</td>
						<td>
							<DocLink to="external-providers">External Identity Providers</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Code policies, token codes
						</td>
						<td>
							<DocLink to="device-code-flow">Device Code Flow</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Events
						</td>
						<td>
							<DocLink to="events">Events</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Webhooks
						</td>
						<td>
							<DocLink to="webhooks">Webhooks</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Mail hooks
						</td>
						<td>
							<DocLink to="mail-hooks">Mail Hooks</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Error codes
						</td>
						<td>
							<DocLink to="error-codes">Error Codes</DocLink>
						</td>
					</tr>
				</tbody>
			</Table>

			<H2 id="license">
				License
			</H2>
			<p>
				ErtisAuth is open source under the <a href="https://github.com/ertugrulozcan/ErtisAuth/blob/master/LICENSE">MIT License</a>.
			</p>
		</>
	)
}
