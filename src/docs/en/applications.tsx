import * as samples from "../samples/applications"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Applications() {
	return (
		<>
			<p>
				An application is a <strong>machine client</strong> of ErtisAuth: a backend service, a worker, a server-side web application. Applications don&apos;t sign in; they send a Basic token with every request:
			</p>
			<Code language="http" code={samples.basicHeader} />
			<p>
				Like users, applications have a <DocLink to="roles">role</DocLink> and may have permissions of their own (<code>permissions</code>, <code>forbidden</code>), evaluated as described in <DocLink to="authorization">Authorization</DocLink>.
			</p>
			<p>
				Typical uses:
			</p>
			<ul>
				<li>
					a backend that manages users on behalf of your product (sign-up, profile pages, admin screens),
				</li>
				<li>
					the server side of your password reset and activation pages, which call ErtisAuth with the application&apos;s token,
				</li>
				<li>
					services protected by the <DocLink to="sdk">SDK</DocLink> that call each other.
				</li>
			</ul>

			<H2 id="the-application-object">
				The application object
			</H2>
			<Code language="json" code={samples.application} />
			<Table
				head={["Field", "Required", "Description"]}
				rows={[
					[<code>name</code>, "yes", "Display name."],
					[<code>slug</code>, "no", "Unique in the membership; derived from the name when omitted."],
					[<code>role</code>, "yes", "The slug of an existing role."],
					[<><code>permissions</code>, <code>forbidden</code></>, "no", <>UBAC entries of the application (<code>resource.action.object</code>).</>],
				]} />
			<p>
				The secret is never part of the application object.
			</p>

			<H2 id="the-secret">
				The secret
			</H2>
			<ul>
				<li>
					A secret is <strong>generated</strong> when the application is created and returned <strong>only in that response</strong>.
				</li>
				<li>
					ErtisAuth stores only a hash of it. Nobody, administrators included, can read it back.
				</li>
				<li>
					It doesn&apos;t expire. Replace it with <a href="#rotate-the-secret">rotate the secret</a> when it may have leaked, or as a routine.
				</li>
			</ul>
			<p>
				Store the secret like a password: in a secret store or an environment variable, never in source control or in a browser.
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
					[<code>GET</code>, <code>{"/applications/{id}"}</code>, "Get an application (id or slug)", <code>{"applications.read.{id}"}</code>],
					[<code>GET</code>, <code>/applications</code>, "List applications", <code>applications.read</code>],
					[<code>POST</code>, <code>/applications/_query</code>, "Query applications", <code>applications.read</code>],
					[<code>GET</code>, <code>/applications/search?keyword=</code>, "Search applications", <code>applications.read</code>],
					[<code>POST</code>, <code>/applications</code>, "Create an application", <code>applications.create</code>],
					[<code>PUT</code>, <code>{"/applications/{id}"}</code>, "Update an application", <code>{"applications.update.{id}"}</code>],
					[<code>POST</code>, <code>{"/applications/{id}/secret"}</code>, "Rotate the secret", <code>{"applications.update.{id}"}</code>],
					[<code>DELETE</code>, <code>{"/applications/{id}"}</code>, "Delete an application", <code>{"applications.delete.{id}"}</code>],
					[<code>DELETE</code>, <code>/applications</code>, "Delete several applications", <code>applications.delete</code>],
				]} />
			<p>
				An application can always read and update its own record, unless its role forbids it.
			</p>

			<H3 id="create-an-application">
				Create an application
			</H3>
			<Code language="shell" code={samples.create} />
			<p>
				<strong>Response <code>201 Created</code></strong>
			</p>
			<Code language="json" code={samples.createResponse} />
			<p>
				Save <code>secret</code> now: it can&apos;t be read again.
			</p>
			<Table
				head={["Error", "When"]}
				rows={[
					[<code>400 ModelValidationError</code>, "Missing name or role, unknown role, invalid slug, or the same expression in both lists"],
					[<code>404 MembershipNotFound</code>, "The membership does not exist"],
					[<code>409 ApplicationAlreadyExists</code>, "The slug is taken"],
				]} />

			<H3 id="update-an-application">
				Update an application
			</H3>
			<Code language="http" code={samples.update} />
			<p>
				Updates <code>name</code>, <code>slug</code>, <code>role</code>, <code>permissions</code> and <code>forbidden</code>. The secret is not changed here. An update without any change answers <code>409 IdenticalDocumentError</code>.
			</p>

			<H3 id="rotate-the-secret">
				Rotate the secret
			</H3>
			<Code language="http" code={samples.rotateSecret} />
			<p>
				<strong>Response <code>200 OK</code></strong>: the application with its new <code>secret</code>.
			</p>
			<Callout type="warning">
				the old secret stops working <strong>immediately</strong>. Deploy the new secret to the application right away; services that cache Basic tokens through the SDK may keep accepting the old one for up to their <code>BasicTokenCacheTTL</code>.
			</Callout>

			<H3 id="delete-an-application">
				Delete an application
			</H3>
			<Code language="http" code={samples.remove} />
			<p>
				<strong>Response <code>204 No Content</code></strong>. Its Basic token stops working.
			</p>

			<H2 id="using-the-basic-token">
				Using the Basic token
			</H2>
			<Code language="shell" code={samples.useBasicToken} />
			<ul>
				<li>
					The token is <code>id:secret</code> as plain text, <strong>not</strong> base64-encoded.
				</li>
				<li>
					<code>GET /me</code> with a Basic token returns the application.
				</li>
				<li>
					An unknown application, a wrong secret and an unknown membership are all answered with <code>401 InvalidToken</code>.
				</li>
			</ul>

			<H2 id="migrating-legacy-applications">
				Migrating legacy applications
			</H2>
			<p>
				Applications created before per-application secrets existed authenticated with the <strong>membership&apos;s secret key</strong> as their secret. To keep them working during a migration, a membership can temporarily accept the membership secret for applications <strong>that don&apos;t have a secret of their own yet</strong>:
			</p>
			<Code language="json" code={samples.legacySwitch} />
			<p>
				This field is part of the <DocLink to="memberships" hash="update-a-membership">membership update</DocLink> request. Migrate each application by <a href="#rotate-the-secret">rotating its secret</a> and deploying the new one; from then on only its own secret works. When all applications are migrated, set the switch to <code>false</code>.
			</p>
			<Callout>
				this switch is temporary and will be removed in a future version. New memberships have it turned off.
			</Callout>

			<H2 id="events">
				Events
			</H2>
			<p>
				<code>ApplicationCreated</code>, <code>ApplicationUpdated</code> and <code>ApplicationDeleted</code>. See <DocLink to="events">Events</DocLink>.
			</p>
		</>
	)
}
