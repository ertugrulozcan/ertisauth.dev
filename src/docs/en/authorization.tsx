import * as samples from "../samples/authorization"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Authorization() {
	return (
		<>
			<p>
				Once a caller is authenticated, ErtisAuth decides whether it may perform the request. The decision combines two models:
			</p>
			<ul>
				<li>
					<strong>RBAC</strong> (role based access control): the permissions of the caller&apos;s <DocLink to="roles">role</DocLink>.
				</li>
				<li>
					<strong>UBAC</strong> (user based access control): the permissions of the caller itself, stored on the <DocLink to="users">user</DocLink> or the <DocLink to="applications">application</DocLink>.
				</li>
			</ul>
			<p>
				The same model protects ErtisAuth&apos;s own API and, through the <DocLink to="sdk">SDK</DocLink>, your APIs too.
			</p>

			<H2 id="permission-expressions">
				Permission expressions
			</H2>
			<p>
				A permission is a dot-separated expression of up to four segments:
			</p>
			<Code language="text" code={samples.expression} />
			<Table
				head={["Segment", "Meaning", "Examples"]}
				rows={[
					[<code>subject</code>, "Who acts: a user or application id", <><code>*</code>, <code>66f1c0d2a4b5c6d7e8f90124</code></>],
					[<code>resource</code>, "What kind of thing", <><code>users</code>, <code>roles</code>, <code>orders</code></>],
					[<code>action</code>, "What is done", <><code>create</code>, <code>read</code>, <code>update</code>, <code>delete</code>, or any custom action such as <code>approve</code></>],
					[<code>object</code>, "Which single thing: a resource id", <><code>*</code>, <code>66f1c0d2a4b5c6d7e8f90127</code></>],
				]} />
			<p>
				<code>*</code> matches any value of its segment. Shorter forms leave the missing segments as <code>*</code>:
			</p>
			<Table
				head={["Written", "Means", "Allows"]}
				rows={[
					[<code>users</code>, <code>*.users.*.*</code>, "everything on users"],
					[<code>users.read</code>, <code>*.users.read.*</code>, "reading any user"],
					[<code>users.update.66f1…27</code>, <code>*.users.update.66f1…27</code>, "updating that one user"],
					[<code>66f1…24.orders.approve.*</code>, "(as written)", "that subject approving any order"],
				]} />
			<p>
				Rules for the segments:
			</p>
			<ul>
				<li>
					<code>resource</code> and <code>action</code> are names, compared <strong>case-insensitively</strong> (<code>Users.Read</code> is <code>users.read</code>).
				</li>
				<li>
					<code>subject</code> and <code>object</code> are ids, compared exactly.
				</li>
				<li>
					A segment can&apos;t be empty, can&apos;t start or end with <code>.</code> or <code>*</code>, and <code>*</code> can&apos;t be used as part of a value (<code>user*</code> is invalid). Invalid expressions are rejected with <code>400 InvalidRbac</code>.
				</li>
			</ul>

			<H3 id="ubac-expressions">
				UBAC expressions
			</H3>
			<p>
				The <code>permissions</code> and <code>forbidden</code> lists of a user or an application use the same format <strong>without the subject</strong> (the subject is the user or application itself): <code>resource.action.object</code>, with the same shorter forms (<code>users</code>, <code>users.read</code>).
			</p>

			<H2 id="how-a-request-is-checked">
				How a request is checked
			</H2>
			<p>
				For every request to a protected endpoint, ErtisAuth builds the expression of the request from the endpoint and the caller:
			</p>
			<ul>
				<li>
					<code>subject</code>: the id of the caller,
				</li>
				<li>
					<code>resource</code> and <code>action</code>: declared by the endpoint (for example <code>users</code> and <code>read</code>),
				</li>
				<li>
					<code>object</code>: the id in the route for single-resource endpoints (<code>GET /users/{"{id}"}</code>), otherwise <code>*</code>.
				</li>
			</ul>
			<p>
				For example <code>GET /memberships/{"{m}"}/users/66f1…27</code> by user <code>66f1…24</code> is checked as <code>66f1…24.users.read.66f1…27</code>.
			</p>
			<p>
				Then the decision is made in this order:
			</p>
			<ol>
				<li>
					<strong>UBAC first.</strong> If any entry of the caller&apos;s own <code>permissions</code> or <code>forbidden</code> matches, the caller&apos;s own entries decide alone: allowed if a permission matches and no forbidden entry matches, denied otherwise.
				</li>
				<li>
					<strong>Then the role.</strong> Otherwise the role decides: allowed if one of its <code>permissions</code> matches and none of its <code>forbidden</code> entries matches. A forbidden entry always wins over a permission of the same role.
				</li>
				<li>
					<strong>Then the own-record rules.</strong> If neither allows the request, two exceptions still apply, unless the role explicitly forbids the action:
					<ul>
						<li>
							a user may <strong>update</strong> their own user record, and an application its own application record;
						</li>
						<li>
							an application may <strong>read</strong> its own application record.
						</li>
					</ul>
				</li>
				<li>
					<strong>Finally the scopes.</strong> If the token is a <DocLink to="authentication" hash="scoped-tokens">scoped token</DocLink>, its scopes must also cover the request, whatever granted it above.
				</li>
			</ol>
			<p>
				A denied request answers <code>403 AccessDenied</code>.
			</p>
			<p>
				Every user and application must have a role. One whose role is empty or no longer exists is denied on every protected endpoint, whatever its own permissions are (<code>403 AccessDenied</code>, &quot;The user has no role&quot; or &quot;The user role is not found by the given slug&quot;). The API always requires a role, so this only happens when the data was changed outside of it, or when a role that is still in use is deleted.
			</p>

			<H3 id="examples">
				Examples
			</H3>
			<p>
				A role:
			</p>
			<Code language="json" code={samples.role} />
			<Table
				head={["Request", "Result", "Why"]}
				rows={[
					["Read any user", "allowed", <code>users.read</code>],
					[<>Update user <code>…27</code></>, "allowed", <code>users.update</code>],
					[<>Update user <code>…24</code></>, "denied", "the role forbids it"],
					["Delete any user", "denied", "no matching permission"],
					["Read roles", "allowed", <code>roles.read</code>],
				]} />
			<p>
				A user with that role and their own entries:
			</p>
			<Code language="json" code={samples.user} />
			<Table
				head={["Request", "Result", "Why"]}
				rows={[
					["Delete any user", "allowed", "the user's own permission decides (UBAC first)"],
					["Read roles", "denied", "the user's own forbidden entry decides"],
					["Read any user", "allowed", "no UBAC entry matches, the role allows it"],
				]} />
			<Callout>
				because UBAC entries decide before the role, a user&apos;s own permission can grant something that the role forbids. Use UBAC for deliberate per-user exceptions.
			</Callout>
			<p>
				The same expression can&apos;t be in both <code>permissions</code> and <code>forbidden</code>: such a role or application is rejected with <code>400 ModelValidationError</code>, such a user with <code>409 UbacsConflicted</code>.
			</p>

			<H2 id="changing-privileged-fields">
				Changing privileged fields
			</H2>
			<p>
				The own-record rule lets users edit their own profile, but some fields grant power. Changing any of these on a user requires a <strong>real</strong> <code>users.update</code> permission on that user, from the role or from UBAC; the own-record rule does not cover them:
			</p>
			<ul>
				<li>
					<code>role</code>
				</li>
				<li>
					<code>permissions</code>
				</li>
				<li>
					<code>forbidden</code>
				</li>
				<li>
					<code>is_active</code>
				</li>
				<li>
					<code>user_type</code>
				</li>
			</ul>
			<p>
				Otherwise the update is rejected with <code>403 AccessDenied</code> and the list of the fields.
			</p>
			<p>
				<code>source_provider</code> and <code>connected_accounts</code> are managed by ErtisAuth itself: values sent by clients are ignored.
			</p>

			<H2 id="resources-of-the-ertisauth-api">
				Resources of the ErtisAuth API
			</H2>
			<Table
				head={["Resource", "Endpoints", "Actions"]}
				rows={[
					[<code>memberships</code>, <code>/memberships</code>, <><code>create</code>, <code>read</code>, <code>update</code>, <code>delete</code></>],
					[<code>users</code>, <code>/memberships/{"{m}"}/users</code>, <><code>create</code>, <code>read</code>, <code>update</code>, <code>delete</code></>],
					[<code>otp</code>, <code>/memberships/{"{m}"}/users/{"{id}"}/generate-otp</code>, <code>create</code>],
					[<code>user-types</code>, <code>/memberships/{"{m}"}/user-types</code>, <><code>create</code>, <code>read</code>, <code>update</code>, <code>delete</code></>],
					[<code>roles</code>, <code>/memberships/{"{m}"}/roles</code>, <><code>create</code>, <code>read</code>, <code>update</code>, <code>delete</code></>],
					[<code>applications</code>, <code>/memberships/{"{m}"}/applications</code>, <><code>create</code>, <code>read</code>, <code>update</code>, <code>delete</code></>],
					[<code>providers</code>, <code>/memberships/{"{m}"}/providers</code>, <><code>create</code>, <code>read</code>, <code>update</code>, <code>delete</code></>],
					[<code>tokens</code>, <><code>/memberships/{"{m}"}/active-tokens</code>, <code>/revoked-tokens</code>, <code>/codes</code></>, <><code>read</code>, <code>create</code></>],
					[<code>events</code>, <code>/memberships/{"{m}"}/events</code>, <code>read</code>],
					[<code>webhooks</code>, <code>/memberships/{"{m}"}/webhooks</code>, <><code>create</code>, <code>read</code>, <code>update</code>, <code>delete</code></>],
					[<code>mailhooks</code>, <code>/memberships/{"{m}"}/mailhooks</code>, <><code>create</code>, <code>read</code>, <code>update</code>, <code>delete</code></>],
					[<code>code-policies</code>, <code>/memberships/{"{m}"}/code-policies</code>, <><code>create</code>, <code>read</code>, <code>update</code>, <code>delete</code></>],
				]} />
			<p>
				Each reference page lists the permission of every endpoint. A few endpoints need a permission you might not expect:
			</p>
			<Table
				head={["Endpoint", "Permission"]}
				rows={[
					[<><code>GET /users/activation</code>, <code>POST /users/reset-password</code>, <code>POST /users/set-password</code></>, <code>users.update</code>],
					[<code>POST /users/resend-activation-mail</code>, <code>users.create</code>],
					[<><code>GET /users/verify-reset-token</code>, <code>GET /users/check-password</code></>, <code>users.read</code>],
					[<code>GET /users/{"{id}"}/generate-otp</code>, <code>otp.create</code>],
					[<><code>POST /codes</code>, <code>GET /codes/{"{user_code}"}</code>, <code>POST /codes/{"{user_code}"}/approve</code>, <code>POST /codes/{"{user_code}"}/deny</code></>, <code>tokens.create</code>],
				]} />
			<p>
				Public pages such as a reset password page call these endpoints from your backend, usually with an application&apos;s Basic token.
			</p>
			<Callout>
				the <code>memberships</code> resource is installation-wide. Its read permission discloses the secret keys of the memberships, so grant it only to the operators of the installation.
			</Callout>

			<H3 id="the-admin-role">
				The <code>admin</code> role
			</H3>
			<p>
				The setup creates the reserved <code>admin</code> role with <code>create</code>, <code>read</code>, <code>update</code> and <code>delete</code> on every resource above (for example <code>*.users.read.*</code>). Another role with the <code>admin</code> slug can&apos;t be created (<code>409 ReservedRole</code>), and the <code>admin</code> role can&apos;t be deleted (<code>409 SystemRolesCannotBeDeleted</code>).
			</p>

			<H2 id="checking-a-permission">
				Checking a permission
			</H2>

			<H3 id="for-the-caller">
				For the caller
			</H3>
			<p>
				Ask whether the caller&apos;s token may do something, with its role, its UBAC entries and its scopes:
			</p>
			<Code language="http" code={samples.checkForCaller} />
			<p>
				Any valid token of the membership may call it. Answers <code>200 OK</code> when allowed and <code>401</code> when denied.
			</p>
			<p>
				This is what the <DocLink to="sdk">SDK</DocLink> calls on every request to your APIs.
			</p>

			<H3 id="for-a-role">
				For a role
			</H3>
			<Code language="http" code={samples.checkForRole} />
			<p>
				Requires <code>roles.read</code>. Answers <code>200 OK</code> when the role has the permission and <code>401</code> when not.
			</p>
			<Callout>
				both check endpoints answer a denied permission with <code>401</code>, not <code>403</code>.
			</Callout>
			<Table
				head={["Error", "When"]}
				rows={[
					[<code>400 PermissionParameterRequired</code>, <><code>permission</code> is missing</>],
					[<code>400 InvalidRbac</code>, <><code>permission</code> is not a valid expression</>],
					[<code>404 RoleNotFound</code>, "The role does not exist"],
				]} />

			<H2 id="designing-permissions-for-your-own-apis">
				Designing permissions for your own APIs
			</H2>
			<p>
				Resources and actions are free-form names, so you can model your own domain:
			</p>
			<Code language="json" code={samples.ownApiRole} />
			<p>
				Then protect your endpoints with the same names; see <DocLink to="sdk" hash="protecting-endpoints">.NET SDK</DocLink>.
			</p>
		</>
	)
}
