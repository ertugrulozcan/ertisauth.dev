import * as samples from "../samples/core-concepts"
import { Code, DocLink, H2, Table } from "@/components/docs/prose"

export default function CoreConcepts() {
	return (
		<>
			<p>
				This page introduces the building blocks of ErtisAuth and how they relate to each other. Each concept has its own reference page with the full details.
			</p>
			<Code language="text" title="overview" code={samples.tree.en} />

			<H2 id="membership">
				Membership
			</H2>
			<p>
				A <strong>membership</strong> is an isolated tenant, like a <em>realm</em> in Keycloak. Everything else belongs to exactly one membership, and a token issued in one membership can&apos;t access the resources of another one.
			</p>
			<p>
				A membership also holds the settings of its users&apos; authentication:
			</p>
			<ul>
				<li>
					the lifetimes of access, refresh, scoped and reset tokens,
				</li>
				<li>
					the <strong>secret key</strong> the tokens are signed with,
				</li>
				<li>
					the <strong>password hash algorithm</strong> and the text encoding,
				</li>
				<li>
					the mail providers, the activation policy, the OTP settings and the device code policy.
				</li>
			</ul>
			<p>
				One installation can host many memberships, for example one per product or per customer. See <DocLink to="memberships">Memberships</DocLink>.
			</p>

			<H2 id="user">
				User
			</H2>
			<p>
				A <strong>user</strong> is a person who signs in. Every user has:
			</p>
			<ul>
				<li>
					a <code>username</code> and an <code>email_address</code>, both unique in the membership (either can be used to sign in),
				</li>
				<li>
					a <code>role</code>, which grants most of their permissions,
				</li>
				<li>
					a <code>user_type</code>, which defines which other fields the user has,
				</li>
				<li>
					optional <code>permissions</code> and <code>forbidden</code> lists of their own (UBAC),
				</li>
				<li>
					an <code>is_active</code> flag: inactive users can&apos;t sign in.
				</li>
			</ul>
			<p>
				See <DocLink to="users">Users</DocLink>.
			</p>

			<H2 id="user-type">
				User type
			</H2>
			<p>
				A <strong>user type</strong> is the schema of a kind of user, for example <em>Customer</em> or <em>Employee</em>. It declares the custom fields (a phone number, a birth date, a list of addresses…) with their types and validation rules. User types can inherit from each other; all of them ultimately inherit from the built-in <code>base-user</code> type, which declares the standard fields (<code>firstname</code>, <code>lastname</code>, <code>username</code>, <code>email_address</code>, <code>role</code>…).
			</p>
			<p>
				See <DocLink to="user-types">User Types</DocLink>.
			</p>

			<H2 id="role">
				Role
			</H2>
			<p>
				A <strong>role</strong> is a named set of permissions (<code>permissions</code>) and denials (<code>forbidden</code>), shared by many users and applications. The setup creates the reserved <code>admin</code> role, which can do everything.
			</p>
			<p>
				See <DocLink to="roles">Roles</DocLink> and <DocLink to="authorization">Authorization</DocLink>.
			</p>

			<H2 id="application">
				Application
			</H2>
			<p>
				An <strong>application</strong> is a machine client: a backend service, a scheduled job, a server-side web app. It authenticates with a <strong>Basic token</strong> made of its id and a secret, and like a user it has a role and optional permissions of its own.
			</p>
			<p>
				See <DocLink to="applications">Applications</DocLink>.
			</p>

			<H2 id="utilizer">
				Utilizer
			</H2>
			<p>
				<em>Utilizer</em> is ErtisAuth&apos;s word for <strong>whoever makes a request</strong>: a user (with a Bearer token) or an application (with a Basic token). Events record the utilizer who caused them, and permissions are evaluated for the utilizer.
			</p>

			<H2 id="tokens">
				Tokens
			</H2>
			<Table>
				<thead>
					<tr>
						<th>
							Token
						</th>
						<th>
							Who
						</th>
						<th>
							Format
						</th>
						<th>
							Used for
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							Access token
						</td>
						<td>
							users
						</td>
						<td>
							JWT, <code>Authorization: Bearer …</code>
						</td>
						<td>
							calling the API
						</td>
					</tr>
					<tr>
						<td>
							Refresh token
						</td>
						<td>
							users
						</td>
						<td>
							JWT
						</td>
						<td>
							getting a new access token
						</td>
					</tr>
					<tr>
						<td>
							Scoped token
						</td>
						<td>
							users
						</td>
						<td>
							JWT, <code>Authorization: Bearer …</code>
						</td>
						<td>
							an access token limited to some permissions
						</td>
					</tr>
					<tr>
						<td>
							Basic token
						</td>
						<td>
							applications
						</td>
						<td>
							<code>Authorization: Basic &lt;id&gt;:&lt;secret&gt;</code>
						</td>
						<td>
							calling the API
						</td>
					</tr>
					<tr>
						<td>
							Reset token
						</td>
						<td>
							users
						</td>
						<td>
							opaque string
						</td>
						<td>
							setting a new password
						</td>
					</tr>
					<tr>
						<td>
							Activation token
						</td>
						<td>
							users
						</td>
						<td>
							opaque string
						</td>
						<td>
							activating an account
						</td>
					</tr>
				</tbody>
			</Table>
			<p>
				See <DocLink to="authentication">Authentication</DocLink>.
			</p>

			<H2 id="provider">
				Provider
			</H2>
			<p>
				A <strong>provider</strong> connects an external identity provider (Google, Apple, Facebook, Microsoft) to a membership. Users who sign in with it are created on their first sign-in, or linked to an existing account.
			</p>
			<p>
				See <DocLink to="external-providers">External Identity Providers</DocLink>.
			</p>

			<H2 id="events-webhooks-and-mail-hooks">
				Events, webhooks and mail hooks
			</H2>
			<p>
				Most operations record an <strong>event</strong>: a user was created, a token was generated, a role was updated… Events can be read through the API, and they trigger:
			</p>
			<ul>
				<li>
					<strong>webhooks</strong>, which send an HTTP request to a URL of your choice,
				</li>
				<li>
					<strong>mail hooks</strong>, which send a templated email.
				</li>
			</ul>
			<p>
				See <DocLink to="events">Events</DocLink>, <DocLink to="webhooks">Webhooks</DocLink> and <DocLink to="mail-hooks">Mail Hooks</DocLink>.
			</p>

			<H2 id="identifiers-and-slugs">
				Identifiers and slugs
			</H2>
			<ul>
				<li>
					Every resource has an <code>_id</code> (a MongoDB ObjectId string).
				</li>
				<li>
					Memberships, roles, applications, user types, providers, webhooks, mail hooks and code policies also have a <strong>slug</strong>: a URL-friendly name derived from the <code>name</code> when you don&apos;t set one. A slug can&apos;t contain whitespace and can&apos;t start with a digit.
				</li>
				<li>
					Where a resource is referred to by another one, the slug is used: a user&apos;s <code>role</code> and <code>user_type</code> are slugs, as are a provider&apos;s <code>defaultRole</code> and <code>defaultUserType</code>.
				</li>
				<li>
					The single-resource endpoints of memberships, roles, applications, user types and providers accept either the id or the slug.
				</li>
			</ul>

			<H2 id="the-sys-field">
				The <code>sys</code> field
			</H2>
			<p>
				Resources carry a <code>sys</code> object maintained by the server:
			</p>
			<Code language="json" code={samples.sys} />
			<p>
				<code>created_by</code> and <code>modified_by</code> hold the username of the user, or the slug of the application, who made the change (<code>system</code> for changes made by ErtisAuth itself, such as the setup or a provider sign-up). A <code>sys</code> sent in a request body is ignored. All dates are in UTC.
			</p>
		</>
	)
}
