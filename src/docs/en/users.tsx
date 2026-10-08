import * as samples from "../samples/users"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Users() {
	return (
		<>
			<p>
				Users are the people who sign in to your applications. Each user belongs to one membership, has a <DocLink to="roles">role</DocLink> and a <DocLink to="user-types">user type</DocLink>, and may have permissions of their own (see <DocLink to="authorization">Authorization</DocLink>).
			</p>

			<H2 id="the-user-object">
				The user object
			</H2>
			<Code language="json" code={samples.user} />
			<p>
				The standard fields come from the built-in <code>base-user</code> type; every other field (<code>department</code>, <code>phone</code> above) is declared by the user&apos;s <DocLink to="user-types">user type</DocLink>.
			</p>
			<Table
				head={["Field", "Description"]}
				rows={[
					[<code>username</code>, "Required, unique in the membership. Can be used to sign in."],
					[<code>email_address</code>, "Required, a valid email address, unique in the membership. Can be used to sign in."],
					[<code>firstname</code>, "Required."],
					[<code>lastname</code>, "Optional."],
					[<code>role</code>, "Required. The slug of an existing role."],
					[<code>user_type</code>, "Required. The slug (or name) of a non-abstract user type; always stored as the slug."],
					[<><code>permissions</code>, <code>forbidden</code></>, <>Optional UBAC entries (<code>resource.action.object</code>). See <DocLink to="authorization" hash="ubac-expressions">Authorization</DocLink>.</>],
					[<code>is_active</code>, <>Whether the user can sign in. Set by the server on creation (see <DocLink to="account-recovery" hash="account-activation">Activation</DocLink>).</>],
					[<code>source_provider</code>, <>Where the user came from: <code>ErtisAuth</code>, or the type of the <DocLink to="external-providers">provider</DocLink> they signed up with. Read-only.</>],
					[<code>connected_accounts</code>, "The external provider accounts linked to the user. Read-only."],
					[<code>membership_id</code>, "Read-only."],
				]} />
			<p>
				The password hash is stored in a hidden field and is never returned, filtered or sorted on.
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
					[<code>GET</code>, <code>{"/users/{id}"}</code>, "Get a user", <code>{"users.read.{id}"}</code>],
					[<code>GET</code>, <code>/users</code>, "List users", <code>users.read</code>],
					[<code>POST</code>, <code>/users/_query</code>, "Query users", <code>users.read</code>],
					[<code>GET</code>, <code>/users/search?keyword=</code>, "Search users", <code>users.read</code>],
					[<code>POST</code>, <code>/users</code>, "Create a user", <code>users.create</code>],
					[<code>PUT</code>, <code>{"/users/{id}"}</code>, "Update a user", <code>{"users.update.{id}"}</code>],
					[<code>DELETE</code>, <code>{"/users/{id}"}</code>, "Delete a user", <code>{"users.delete.{id}"}</code>],
					[<code>DELETE</code>, <code>/users</code>, "Delete several users", <code>users.delete</code>],
					[<code>PUT</code>, <code>{"/users/{id}/change-password"}</code>, "Change a password", <code>{"users.update.{id}"}</code>],
					[<code>GET</code>, <code>/users/check-password?password=</code>, "Check the caller's own password", <code>users.read</code>],
					[<code>GET</code>, <code>{"/users/{id}/activate"}</code>, "Activate a user", <code>{"users.update.{id}"}</code>],
					[<code>GET</code>, <code>{"/users/{id}/freeze"}</code>, "Freeze a user", <code>{"users.update.{id}"}</code>],
					[<code>GET</code>, <code>/users/activation?uat=</code>, "Activate with an activation token", <code>users.update</code>],
					[<code>POST</code>, <code>/users/resend-activation-mail</code>, "Send the activation mail again", <code>users.create</code>],
					[<code>POST</code>, <code>/users/reset-password</code>, "Start a password reset", <code>users.update</code>],
					[<code>GET</code>, <code>/users/verify-reset-token?token=</code>, "Check a reset token", <code>users.read</code>],
					[<code>POST</code>, <code>/users/set-password</code>, "Set a new password with a reset token", <code>users.update</code>],
					[<code>GET</code>, <code>{"/users/{id}/generate-otp"}</code>, "Generate a one-time password", <code>{"otp.create.{id}"}</code>],
				]} />
			<p>
				The activation, reset and OTP endpoints are described in <DocLink to="account-recovery">Account Recovery and Activation</DocLink>.
			</p>
			<p>
				A user can always update their own record (the own-record rule), except for the <DocLink to="authorization" hash="changing-privileged-fields">privileged fields</DocLink>.
			</p>

			<H3 id="get-a-user">
				Get a user
			</H3>
			<Code language="http" code={samples.get} />
			<p>
				<strong>Response <code>200 OK</code></strong>: the user, with the custom fields of their user type. <code>404 UserNotFound</code> when it does not exist.
			</p>

			<H3 id="list-query-and-search-users">
				List, query and search users
			</H3>
			<Code language="http" code={samples.list} />
			<p>
				See <DocLink to="api-conventions" hash="listing-resources">API Conventions</DocLink>. The query endpoint also accepts <code>locale</code> (e.g. <code>locale=tr</code>) to sort names by the rules of a language. The search looks for the keyword in <code>username</code>, <code>firstname</code>, <code>lastname</code> and <code>email_address</code>, ignoring case and diacritics.
			</p>
			<p>
				Find a user by email address:
			</p>
			<Code language="shell" code={samples.queryByEmail} />

			<H3 id="create-a-user">
				Create a user
			</H3>
			<Code language="shell" code={samples.create} />
			<ul>
				<li>
					The body is validated against the schema of <code>user_type</code>, including its inherited fields. Unknown fields are rejected unless the user type allows additional properties.
				</li>
				<li>
					<code>password</code> is required and must be at least 6 characters long. It is hashed with the membership&apos;s algorithm and never stored in plain text.
				</li>
				<li>
					<code>is_active</code>, <code>source_provider</code> and <code>connected_accounts</code> in the body are ignored: when the membership requires <DocLink to="account-recovery" hash="account-activation">activation</DocLink>, the user is created inactive and the activation mail is sent to the link host in <code>X-Host</code>; otherwise the user is active immediately.
				</li>
				<li>
					<code>user_type</code> is required in practice: without it the built-in <code>base-user</code> type would be used, which is abstract (<code>400 InheritedTypeIsAbstract</code>).
				</li>
				<li>
					<code>email_address</code> is stored in lower case.
				</li>
			</ul>
			<p>
				<strong>Response <code>201 Created</code></strong>: the user.
			</p>
			<p>
				A duplicate username, email address or other <DocLink to="user-types" hash="unique-fields">unique field</DocLink> is reported as a field error:
			</p>
			<Code language="json" code={samples.duplicateError} />
			<Table
				head={["Error", "When"]}
				rows={[
					[<><code>400 PasswordRequired</code>, <code>400 PasswordMinLengthRuleError</code></>, "Missing or too short password"],
					[<code>400 RoleRequired</code>, <><code>role</code> is missing</>],
					[<><code>400 FieldValidationException</code>, <code>400 ValidationException</code></>, "A field does not match the user type schema"],
					[<code>400 ValidationException</code>, "The username, the email address or another unique field is already used by another user (see above)"],
					[<><code>404 RoleNotFound</code>, <code>404 UserTypeNotFound</code></>, "Unknown role or user type"],
					[<code>409 UbacsConflicted</code>, <>The same entry is in <code>permissions</code> and <code>forbidden</code></>],
					[<><code>501 NotDefinedAnyMailProvider</code>, <code>501 ActivationMailHookWasNotDefined</code></>, "Activation is required but no mail can be sent"],
				]} />

			<H3 id="update-a-user">
				Update a user
			</H3>
			<Code language="http" code={samples.update} />
			<p>
				Updates are <strong>partial</strong>: the fields you send are merged into the current user, the others keep their values.
			</p>
			<Code language="shell" code={samples.updateRequest} />
			<ul>
				<li>
					The merged user is validated against the schema of its user type.
				</li>
				<li>
					The password can&apos;t be changed here; use <a href="#change-a-password">change password</a>.
				</li>
				<li>
					Changing <code>role</code>, <code>permissions</code>, <code>forbidden</code>, <code>is_active</code> or <code>user_type</code> requires a real <code>users.update</code> permission on the user, also when users update themselves (see <DocLink to="authorization" hash="changing-privileged-fields">Authorization</DocLink>).
				</li>
				<li>
					<code>user_type</code> can&apos;t be changed once the user is created: sending another type answers <code>400 UserTypeImmutable</code>. To move a user to another type, create a new user.
				</li>
			</ul>
			<p>
				<strong>Response <code>200 OK</code></strong>: the updated user. An update without any change answers <code>409 IdenticalDocumentError</code>.
			</p>

			<H3 id="delete-a-user">
				Delete a user
			</H3>
			<Code language="http" code={samples.remove} />
			<p>
				<strong>Response <code>204 No Content</code></strong>, or <code>404 UserNotFound</code>. Several users can be deleted at once with <DocLink to="api-conventions" hash="bulk-delete">bulk delete</DocLink>.
			</p>

			<H3 id="change-a-password">
				Change a password
			</H3>
			<Code language="http" code={samples.changePassword} />
			<p>
				<strong>Response <code>200 OK</code></strong>.
			</p>
			<p>
				After a password change the user is <strong>signed out on every device</strong>: all their tokens are revoked. When users change their own password, the session they used to change it stays signed in. This protects the account after a takeover: changing the password also kicks the attacker out.
			</p>
			<p>
				A user can change their own password with the own-record rule; changing someone else&apos;s password requires <code>users.update</code> on them.
			</p>

			<H3 id="check-the-callers-password">
				Check the caller&apos;s password
			</H3>
			<p>
				Asks whether a password is the caller&apos;s own current password, for example before a sensitive operation:
			</p>
			<Code language="http" code={samples.checkPassword} />
			<p>
				Answers <code>200 OK</code> when it matches and <code>401</code> when it does not.
			</p>
			<Callout>
				the password is sent in the query string, which proxies and servers may write to their access logs. Make sure your infrastructure doesn&apos;t log query strings for this route.
			</Callout>

			<H3 id="activate-a-user">
				Activate a user
			</H3>
			<Code language="http" code={samples.activate} />
			<p>
				Activates the user without an activation mail, for example by an administrator. <strong>Response <code>200 OK</code></strong> with the user, <code>400 UserAlreadyActive</code> if already active.
			</p>

			<H3 id="freeze-a-user">
				Freeze a user
			</H3>
			<Code language="http" code={samples.freeze} />
			<p>
				Deactivates the user and <strong>revokes all their tokens</strong>: they are signed out everywhere and can&apos;t sign in again until they are activated. Pending activation links stop working too. <strong>Response <code>200 OK</code></strong> with the user, <code>400 UserAlreadyInactive</code> if already inactive.
			</p>
			<Callout>
				activate and freeze are <code>GET</code> requests that change data. Don&apos;t expose them as plain links that browsers or crawlers might prefetch.
			</Callout>

			<H2 id="events">
				Events
			</H2>
			<Table
				head={["Event", "When"]}
				rows={[
					[<code>UserCreated</code>, "A user was created (also by a provider sign-up)"],
					[<code>UserUpdated</code>, "A user was updated, activated or frozen"],
					[<code>UserDeleted</code>, "A user was deleted"],
					[<code>UserPasswordChanged</code>, "A password was changed or set"],
					[<code>UserPasswordReset</code>, "A password reset was started"],
				]} />
			<p>
				See <DocLink to="events">Events</DocLink>.
			</p>
		</>
	)
}
