import * as samples from "../samples/roles"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Roles() {
	return (
		<>
			<p>
				A role is a named set of permissions shared by users and applications. Every user and every application has exactly one role, referred to by its slug. How roles are evaluated together with per-user permissions is described in <DocLink to="authorization">Authorization</DocLink>.
			</p>

			<H2 id="the-role-object">
				The role object
			</H2>
			<Code language="json" code={samples.role} />
			<Table
				head={["Field", "Required", "Description"]}
				rows={[
					[<code>name</code>, "yes", "Display name."],
					[<code>slug</code>, "no", "Unique in the membership; derived from the name when omitted. Users and applications refer to the role by its slug."],
					[<code>description</code>, "no", ""],
					[<code>permissions</code>, "no", <>What the role allows, as <DocLink to="authorization" hash="permission-expressions">permission expressions</DocLink>.</>],
					[<code>forbidden</code>, "no", "What the role denies. A forbidden entry always wins over a permission of the same role."],
				]} />
			<p>
				The same expression can&apos;t be in both lists.
			</p>

			<H2 id="the-admin-role">
				The <code>admin</code> role
			</H2>
			<p>
				The setup creates the <code>admin</code> role, which has <code>create</code>, <code>read</code>, <code>update</code> and <code>delete</code> on every resource of the ErtisAuth API. Its slug is reserved: no other role can be created with it, and it can&apos;t be deleted.
			</p>

			<H2 id="endpoints">
				Endpoints
			</H2>
			<p>
				All routes are under <code>{"/memberships/{membershipId}"}</code>.
			</p>
			<Table
				head={["Method", "Route", "Description", "Permission"]}
				rows={[
					[<code>GET</code>, <code>{"/roles/{id}"}</code>, "Get a role (id or slug)", <code>{"roles.read.{id}"}</code>],
					[<code>GET</code>, <code>/roles</code>, "List roles", <code>roles.read</code>],
					[<code>POST</code>, <code>/roles/_query</code>, "Query roles", <code>roles.read</code>],
					[<code>GET</code>, <code>/roles/search?keyword=</code>, "Search roles", <code>roles.read</code>],
					[<code>POST</code>, <code>/roles</code>, "Create a role", <code>roles.create</code>],
					[<code>PUT</code>, <code>{"/roles/{id}"}</code>, "Update a role", <code>{"roles.update.{id}"}</code>],
					[<code>DELETE</code>, <code>{"/roles/{id}"}</code>, "Delete a role", <code>{"roles.delete.{id}"}</code>],
					[<code>DELETE</code>, <code>/roles</code>, "Delete several roles", <code>roles.delete</code>],
					[<code>GET</code>, <code>{"/roles/{id}/check-permission?permission="}</code>, "Check a permission of a role", <code>roles.read</code>],
					[<code>GET</code>, <code>/roles/check-permission?permission=</code>, "Check a permission of the caller", "any valid token"],
				]} />

			<H3 id="create-a-role">
				Create a role
			</H3>
			<Code language="shell" code={samples.create} />
			<p>
				<strong>Response <code>201 Created</code></strong>: the role.
			</p>
			<Table
				head={["Error", "When"]}
				rows={[
					[<code>400 ModelValidationError</code>, "Missing name, invalid slug, or the same expression in both lists"],
					[<code>400 InvalidRbac</code>, "An expression is not valid"],
					[<code>404 MembershipNotFound</code>, "The membership does not exist"],
					[<code>409 RoleAlreadyExists</code>, "The slug is taken"],
					[<code>409 ReservedRole</code>, <>The slug is <code>admin</code></>],
				]} />

			<H3 id="update-a-role">
				Update a role
			</H3>
			<Code language="http" code={samples.update} />
			<p>
				The body has the same fields as the create request and replaces the role&apos;s <code>permissions</code> and <code>forbidden</code> lists. The change applies to every user and application with the role without reissuing their tokens. When you run several ErtisAuth instances, each instance caches roles for up to 5 minutes, so a change can take that long to reach all of them (see <DocLink to="operations" hash="caching">Operations</DocLink>).
			</p>
			<p>
				An update without any change answers <code>409 IdenticalDocumentError</code>.
			</p>

			<H3 id="delete-a-role">
				Delete a role
			</H3>
			<Code language="http" code={samples.remove} />
			<p>
				<strong>Response <code>204 No Content</code></strong>. The <code>admin</code> role can&apos;t be deleted (<code>409 SystemRolesCannotBeDeleted</code>). Several roles can be deleted at once with <DocLink to="api-conventions" hash="bulk-delete">bulk delete</DocLink>.
			</p>
			<Callout>
				check that no user or application still uses a role before you delete it: their requests would then be denied with <code>403 AccessDenied</code> (&quot;role is not found&quot;).
			</Callout>

			<H3 id="check-permissions">
				Check permissions
			</H3>
			<p>
				See <DocLink to="authorization" hash="checking-a-permission">Authorization</DocLink>.
			</p>

			<H2 id="events">
				Events
			</H2>
			<p>
				<code>RoleCreated</code>, <code>RoleUpdated</code> and <code>RoleDeleted</code>. See <DocLink to="events">Events</DocLink>.
			</p>
		</>
	)
}
