import * as samples from "../samples/sdk"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"
import { NugetBadges } from "@/components/sections/nuget-packages"

export default function Sdk() {
	return (
		<>
			<p>
				ErtisAuth comes with two .NET libraries:
			</p>
			<Table
				head={["Package", "What it does"]}
				rows={[
					[<code>ErtisAuth.Sdk</code>, "A typed client for the ErtisAuth REST API: sign-in, tokens, users, roles, applications, hooks…"],
					[<code>ErtisAuth.Sdk.AspNetCore</code>, <>Protects <strong>your own</strong> ASP.NET Core APIs with ErtisAuth tokens and permissions, using attributes. Includes <code>ErtisAuth.Sdk</code>.</>],
				]} />
			<p>
				Use <code>ErtisAuth.Sdk.AspNetCore</code> for an ASP.NET Core API whose endpoints ErtisAuth users and applications call. Use <code>ErtisAuth.Sdk</code> alone to call ErtisAuth from a worker, a console application or any other .NET program. Both target .NET 10.
			</p>

			<H2 id="packages">
				Packages
			</H2>
			<div>
				<NugetBadges className="flex flex-wrap gap-x-3 gap-y-2.5" />
			</div>

			<H2 id="quick-start">
				Quick start
			</H2>
			<p>
				Protect an ASP.NET Core API in four steps.
			</p>
			<p>
				<strong>1.</strong> Add the package:
			</p>
			<Code language="shell" code={samples.install} />
			<p>
				<strong>2.</strong> Add the settings to <code>appsettings.json</code>:
			</p>
			<Code language="json" code={samples.quickSettings} />
			<p>
				<strong>3.</strong> Register the SDK in <code>Program.cs</code>:
			</p>
			<Code language="csharp" code={samples.setup} />
			<p>
				<strong>4.</strong> Protect a controller:
			</p>
			<Code language="csharp" code={samples.quickController} />
			<p>
				Call <code>GET /orders</code> with the access token of an ErtisAuth user (<code>Authorization: Bearer &lt;access_token&gt;</code>) or the Basic token of an application:
			</p>
			<Table
				head={["Request", "Response"]}
				rows={[
					["Without a token, or with an invalid, expired or revoked token", <code>401</code>],
					[<>A user or application whose role doesn&apos;t allow <code>orders.read</code></>, <code>403 AccessDenied</code>],
					[<>A user or application whose role allows <code>orders.read</code></>, <code>200</code>],
				]} />

			<H2 id="configuration">
				Configuration
			</H2>
			<Table
				head={["Setting", "Required", "Description"]}
				rows={[
					[<code>BaseUrl</code>, "yes", <>The absolute <code>http</code> or <code>https</code> URL of ErtisAuth, including any path prefix.</>],
					[<code>MembershipId</code>, "yes", "The membership your application belongs to."],
					[<code>BasicTokenCacheTTL</code>, "no", <>Seconds for which a verified Basic token is cached by your API (<code>ErtisAuth.Sdk.AspNetCore</code>). <code>0</code> or omitted disables the cache.</>],
				]} />

			<H3 id="where-the-settings-come-from">
				Where the settings come from
			</H3>
			<p>
				<code>AddErtisAuth()</code> reads the <code>ErtisAuth</code> section of your application&apos;s configuration (<code>builder.Configuration</code>). Every configuration source of the application applies: <code>appsettings.json</code> and <code>appsettings.{"{Environment}"}.json</code>, environment variables, user secrets, command line arguments, Azure Key Vault and so on. For example, in Kubernetes:
			</p>
			<Code language="yaml" code={samples.kubernetes} />
			<p>
				The settings are validated when the application starts. Invalid settings stop it with a message that lists every problem.
			</p>
			<p>
				Other ways to give the settings:
			</p>
			<Table
				head={["Call", "Reads"]}
				rows={[
					[<code>AddErtisAuth()</code>, <>The <code>ErtisAuth</code> section</>],
					[<code>AddErtisAuth(&quot;Identity&quot;)</code>, "Another section of the configuration"],
					[<code>AddErtisAuth(builder.Configuration.GetSection(&quot;Identity&quot;))</code>, "The given section, validated at once"],
					[<code>AddErtisAuth(options =&gt; {"{ … }"})</code>, "Only the given values; no configuration is read"],
				]} />
			<Code language="csharp" code={samples.settingsInCode} />
			<p>
				<code>AddErtisAuth</code> registers the SDK once: further calls are ignored, whatever their settings.
			</p>
			<Callout>
				a program without a .NET host (no <code>WebApplication.CreateBuilder</code> or <code>Host.CreateApplicationBuilder</code>) has no application configuration. There, <code>AddErtisAuth()</code> reads <code>appsettings.json</code>, <code>appsettings.{"{ASPNETCORE_ENVIRONMENT}"}.json</code> from the output directory, and the environment variables.
			</Callout>

			<H2 id="protecting-endpoints">
				Protecting endpoints
			</H2>

			<H3 id="which-endpoints-are-protected">
				Which endpoints are protected
			</H3>
			<p>
				Mark the controller with <code>[Authorized]</code>: every action of the controller then requires a valid token and the permission described by the rbac attributes. To make an exception for a single action, mark the action:
			</p>
			<ul>
				<li>
					<code>[Unauthorized]</code>: the action is public.
				</li>
				<li>
					<code>[SelfAuthorized]</code>: the action requires a valid token but <a href="#endpoints-that-check-the-permission-themselves">checks the permission itself</a>.
				</li>
			</ul>
			<p>
				The most specific attribute applies: the action&apos;s attribute overrides the controller&apos;s.
			</p>
			<Table
				head={["Controller", "Action", "The endpoint"]}
				rows={[
					[<code>[Authorized]</code>, "", "requires a token and the permission"],
					[<code>[Authorized]</code>, <code>[Unauthorized]</code>, "is public"],
					[<code>[Authorized]</code>, <code>[SelfAuthorized]</code>, "requires a token; the action checks the permission"],
					[<code>[Unauthorized]</code>, <code>[SelfAuthorized]</code>, "requires a token; the action checks the permission"],
					["", <code>[SelfAuthorized]</code>, "requires a token; the action checks the permission"],
					["", "", <strong>is not protected at all</strong>],
				]} />
			<p>
				<code>[Authorized]</code> can only be put on a controller; there is no need to repeat it on the actions.
			</p>
			<Callout type="warning">
				without <code>[Authorized]</code> or <code>[SelfAuthorized]</code> the endpoint is public, and its rbac attributes do nothing. The SDK reports this while you build (<code>ERTISAUTH610</code>, see <a href="#compile-time-checks">Compile-time checks</a>).
			</Callout>

			<H3 id="attributes">
				Attributes
			</H3>
			<p>
				The attributes are in the <code>ErtisAuth.Extensions.Authorization.Attributes</code> namespace.
			</p>
			<Table
				head={["Attribute", "On", "Meaning"]}
				rows={[
					[<code>[Authorized]</code>, "controller", <>A valid token <strong>and</strong> the permission described by the rbac attributes are required, on every action.</>],
					[<code>[SelfAuthorized]</code>, "controller or action", "A valid token is required; the action checks the permission itself."],
					[<code>[Unauthorized]</code>, "controller or action", "Public: no token is needed."],
					[<code>[RbacResource(&quot;orders&quot;)]</code>, "controller or action", <>The <code>resource</code> segment of the permission.</>],
					[<><code>[RbacAction(&quot;approve&quot;)]</code> or <code>[RbacAction(Rbac.CrudActions.Read)]</code></>, "action", <>The <code>action</code> segment.</>],
					[<code>[RbacObject(&quot;{"{id}"}&quot;)]</code>, "action", <>The <code>object</code> segment, usually the id from the route.</>],
					[<code>[RbacSubject(&quot;…&quot;)]</code>, "action", <>The <code>subject</code> segment.</>],
				]} />

			<H3 id="the-permission-that-is-checked">
				The permission that is checked
			</H3>
			<p>
				The rbac attributes build a <DocLink to="authorization" hash="permission-expressions">permission expression</DocLink>, <code>subject.resource.action.object</code>, which ErtisAuth checks against the caller&apos;s role, their own permissions and the scopes of their token.
			</p>
			<Table
				head={["Segment", "From", "When the attribute is missing"]}
				rows={[
					["subject", <code>[RbacSubject]</code>, "The caller's id, which is what you want almost always"],
					["resource", <><code>[RbacResource]</code> of the action, otherwise of the controller</>, <>⚠️ The last segment of the route template, e.g. <code>{"{id}"}</code> for <code>{"orders/{id}"}</code></>],
					["action", <code>[RbacAction]</code>, <>⚠️ <code>*</code>: only permissions that allow every action on the resource pass</>],
					["object", <code>[RbacObject]</code>, <code>*</code>],
				]} />
			<p>
				Always set <code>[RbacResource]</code> and <code>[RbacAction]</code>. An <code>[RbacResource]</code> on an action overrides the controller&apos;s, for example <code>[RbacResource(&quot;otp&quot;)]</code> on one action of a <code>[RbacResource(&quot;users&quot;)]</code> controller.
			</p>
			<Code language="csharp" code={samples.controller} />

			<H3 id="endpoints-that-check-the-permission-themselves">
				Endpoints that check the permission themselves
			</H3>
			<p>
				When the permission depends on data the attributes can&apos;t reach, for example a field of the requested record, mark the action <code>[SelfAuthorized]</code>. The SDK authenticates the token, and the action checks the permission with <code>IRoleService.CheckPermissionAsync</code>, using the caller&apos;s token:
			</p>
			<Code language="csharp" code={samples.selfAuthorized} />
			<p>
				<code>CheckPermissionAsync</code> applies the role, the caller&apos;s own permissions and the scopes of their token, like the attributes do. It throws when ErtisAuth can&apos;t be reached.
			</p>

			<H3 id="minimal-apis">
				Minimal APIs
			</H3>
			<p>
				Minimal API endpoints take the same attributes as metadata:
			</p>
			<Code language="csharp" code={samples.minimalApi} />
			<p>
				The <a href="#compile-time-checks">compile-time checks</a> don&apos;t cover minimal API endpoints, since their attributes are only known at runtime.
			</p>

			<H3 id="what-happens-on-a-request">
				What happens on a request
			</H3>
			<p>
				For a <strong>Bearer</strong> token, the SDK:
			</p>
			<ol>
				<li>
					calls ErtisAuth&apos;s <code>/whoami</code> to authenticate the token,
				</li>
				<li>
					calls <code>/roles/check-permission</code> with the expression built from the attributes, which applies the role, the user&apos;s own permissions and the token&apos;s scopes.
				</li>
			</ol>
			<p>
				For a <strong>Basic</strong> token, it reads the application from ErtisAuth with the token itself (which authenticates it) and checks the permission the same way. With <code>BasicTokenCacheTTL</code>, a verified Basic token is cached for that many seconds, which saves the calls but delays the effect of a secret rotation by up to that time.
			</p>
			<Table
				head={["Response of your API", "When"]}
				rows={[
					[<><code>401</code> with an ErtisAuth error body</>, "No token, unsupported token type, or an invalid, expired or revoked token"],
					[<code>403 AccessDenied</code>, "The token is valid but the permission is missing"],
					[<code>503 AuthenticationServiceUnavailable</code>, "ErtisAuth could not be reached or answered with an error. Clients should retry, not sign the user out."],
				]} />

			<H3 id="placeholders">
				Placeholders
			</H3>
			<p>
				The rbac attribute values can contain placeholders, resolved for each request:
			</p>
			<Table
				head={["Placeholder", "Source"]}
				rows={[
					[<><code>{"{id}"}</code> or <code>{"{route::id}"}</code></>, "A route value"],
					[<code>{"{query::id}"}</code>, "A query string parameter"],
					[<code>{"{header::X-Tenant}"}</code>, "A request header"],
					[<code>{"{env::REGION}"}</code>, "An environment variable"],
				]} />
			<Code language="csharp" code={samples.placeholder} />
			<p>
				Rules that keep the check and the action looking at the same thing:
			</p>
			<ul>
				<li>
					a <code>query</code>, <code>header</code> or <code>env</code> placeholder that can&apos;t be resolved denies the request; a route placeholder whose value is missing is kept as written;
				</li>
				<li>
					a resolved value of <code>*</code>, or one that contains dots (<code>%2E</code>), whitespace or control characters, denies the request;
				</li>
				<li>
					<code>[RbacSubject]</code> can&apos;t use client-controlled sources (<code>query</code>, <code>header</code>).
				</li>
			</ul>

			<H3 id="compile-time-checks">
				Compile-time checks
			</H3>
			<p>
				<code>ErtisAuth.Sdk.AspNetCore</code> includes Roslyn analyzers that report mistakes while you build:
			</p>
			<Table
				head={["Diagnostic", "Severity", "Problem"]}
				rows={[
					[<code>ERTISAUTH601</code>, "warning", "The placeholder is not a route parameter of the action"],
					[<code>ERTISAUTH602</code>, "error", <>The placeholder names an unknown source (only <code>route</code>, <code>query</code>, <code>header</code> and <code>env</code> exist)</>],
					[<code>ERTISAUTH603</code>, "error", <><code>[RbacSubject]</code> reads from a client-controlled source</>],
					[<code>ERTISAUTH610</code>, "warning", <>The action has rbac attributes, but neither the action nor its controller has <code>[Authorized]</code> or <code>[SelfAuthorized]</code>: the endpoint is public</>],
					[<code>ERTISAUTH611</code>, "warning", <><code>[Authorized]</code>, <code>[SelfAuthorized]</code> and <code>[Unauthorized]</code> conflict on the same level (the controller with its base classes, or the action)</>],
					[<code>ERTISAUTH612</code>, "info", <>The rbac attributes of a <code>[SelfAuthorized]</code> or <code>[Unauthorized]</code> action are not checked</>],
					[<code>ERTISAUTH613</code>, "warning", <>An action that is not authenticated calls <code>GetUtilizer()</code>, which always returns <code>null</code> there</>],
				]} />

			<H3 id="the-caller">
				The caller
			</H3>
			<p>
				Inside an action, <code>this.GetUtilizer()</code> returns the caller authenticated by ErtisAuth: a user or an application, with <code>Id</code>, <code>Username</code>, <code>Role</code>, <code>Permissions</code>, <code>Forbidden</code>, <code>MembershipId</code>, <code>Type</code>, <code>Token</code> and <code>TokenType</code>. It returns <code>null</code> on endpoints that are not authenticated (<code>[Unauthorized]</code>, or without ErtisAuth attributes); a call in such an action is reported by <code>ERTISAUTH613</code>.
			</p>
			<p>
				<code>this.GetUnverifiedUtilizer()</code> also works on those endpoints: there, it reads the token of the request <strong>without verifying it</strong> (no signature, expiry or revocation check for Bearer tokens, no secret check for Basic tokens).
			</p>
			<Callout type="warning">
				anyone can send a token that claims any identity. Never use <code>GetUnverifiedUtilizer()</code> for authorization decisions or to access data; use <code>GetUtilizer()</code> on an <code>[Authorized]</code> or <code>[SelfAuthorized]</code> endpoint.
			</Callout>

			<H2 id="calling-the-ertisauth-api">
				Calling the ErtisAuth API
			</H2>
			<p>
				Register the client alone (without the ASP.NET Core integration) with <code>ErtisAuth.Sdk</code>:
			</p>
			<Code language="csharp" code={samples.clientRegistration} />
			<p>
				It takes the <a href="#configuration">same settings</a>. Then inject the services you need:
			</p>
			<Table
				head={["Service", "Methods"]}
				rows={[
					[<code>IAuthenticationService</code>, <><code>GetTokenAsync</code>, <code>RefreshTokenAsync</code>, <code>VerifyTokenAsync</code>, <code>RevokeTokenAsync</code>, <code>MeAsync</code>, <code>WhoAmIAsync</code></>],
					[<code>IUserService</code>, <><code>GetAsync</code>, <code>QueryAsync</code>, <code>CreateAsync</code>, <code>UpdateAsync</code>, <code>DeleteAsync</code>, <code>BulkDeleteAsync</code>, <code>GetActiveTokensAsync</code>, <code>GetRevokedTokensAsync</code></>],
					[<code>IPasswordService</code>, <><code>ChangePasswordAsync</code>, <code>ResetPasswordAsync</code>, <code>SetPasswordAsync</code></>],
					[<code>IRoleService</code>, <>CRUD, <code>CheckPermissionAsync</code>, <code>CheckPermissionByRoleAsync</code></>],
					[<><code>IApplicationService</code>, <code>IWebhookService</code>, <code>IMailHookService</code></>, "CRUD"],
					[<code>IMembershipService</code>, <><code>GetMembershipAsync</code>, <code>GetMembershipsAsync</code>, <code>QueryMembershipsAsync</code>, <code>CreateMembershipAsync</code>, <code>UpdateMembershipAsync</code>, <code>DeleteMembershipAsync</code></>],
					[<><code>IActiveTokensService</code>, <code>IRevokedTokensService</code></>, <><code>GetAsync</code>, <code>QueryAsync</code></>],
				]} />
			<p>
				<code>IAuthenticationService</code> has the same name as ASP.NET Core&apos;s <code>Microsoft.AspNetCore.Authentication.IAuthenticationService</code>; use the full name or an alias if both namespaces are imported.
			</p>

			<H3 id="tokens">
				Tokens
			</H3>
			<p>
				The resource services take the token to call with as a parameter:
			</p>
			<ul>
				<li>
					a <code>BearerToken</code> of the signed-in user, for calls on their behalf: <code>BearerToken.CreateTemp(accessToken)</code> wraps a raw access token;
				</li>
				<li>
					a <code>BasicToken</code> of your application, for calls of your backend: <code>new BasicToken($&quot;{"{applicationId}"}:{"{applicationSecret}"}&quot;)</code>.
				</li>
			</ul>
			<p>
				Keep the application secret on the server: in a secret store or an environment variable, never in a browser or a mobile app.
			</p>

			<H3 id="handling-responses">
				Handling responses
			</H3>
			<p>
				Every method returns an <code>IResponseResult</code> (or <code>IResponseResult&lt;T&gt;</code>) instead of throwing on HTTP errors:
			</p>
			<Table
				head={["Property", "Content"]}
				rows={[
					[<code>IsSuccess</code>, "Whether ErtisAuth answered with a success status"],
					[<code>Data</code>, "The result, on success"],
					[<code>StatusCode</code>, <>The HTTP status of ErtisAuth&apos;s answer; <code>null</code> when no answer arrived (e.g. a network error)</>],
					[<code>Json</code>, <>The body of the answer: on an error, ErtisAuth&apos;s <DocLink to="api-conventions" hash="errors">error JSON</DocLink></>],
					[<code>Exception</code>, "The exception, when no answer arrived"],
				]} />
			<p>
				<code>response.IsServiceUnavailable()</code> (namespace <code>ErtisAuth.Sdk.Extensions</code>) tells an outage of ErtisAuth (no answer, or a <code>5xx</code> status) from a rejection (e.g. <code>401</code>, <code>403</code>). Treat them differently: an outage should be retried, a rejection should not.
			</p>
			<p>
				A sign-in endpoint of your backend that passes ErtisAuth&apos;s errors on to the client:
			</p>
			<Code language="csharp" code={samples.signIn} />

			<H3 id="common-tasks">
				Common tasks
			</H3>
			<p>
				Refresh a token pair before the access token expires:
			</p>
			<Code language="csharp" code={samples.refresh} />
			<p>
				Sign out (on every device with <code>logoutFromAllDevices: true</code>):
			</p>
			<Code language="csharp" code={samples.revoke} />
			<p>
				Create a user with the application&apos;s token. Custom fields of the <DocLink to="user-types">user type</DocLink> are properties of a class derived from <code>UserWithPassword</code>:
			</p>
			<Code language="csharp" code={samples.createUser} />
			<p>
				Reset a password (see <DocLink to="account-recovery" hash="password-reset">Account Recovery</DocLink>): start the reset with the URL of your reset page, then set the new password with the token from the link:
			</p>
			<Code language="csharp" code={samples.resetPassword} />
			<p>
				Query users:
			</p>
			<Code language="csharp" code={samples.queryUsers} />
			<Callout>
				<code>GetAsync</code> and <code>QueryAsync</code> have two overloads that differ only in their sorting parameters (<code>sorting</code>, or <code>orderBy</code> and <code>sortDirection</code>). When you don&apos;t sort, name one of them (<code>sorting: null</code>); otherwise the call is ambiguous and doesn&apos;t compile (<code>CS0121</code>).
			</Callout>

			<H2 id="applications-without-aspnet-core">
				Applications without ASP.NET Core
			</H2>
			<p>
				A worker or a console application uses <code>ErtisAuth.Sdk</code> with the .NET generic host, which gives it the same <a href="#configuration">configuration</a>:
			</p>
			<Code language="csharp" code={samples.workerProgram} />
			<Code language="csharp" code={samples.worker} />

			<H2 id="custom-authentication-handler">
				Custom authentication handler
			</H2>
			<p>
				<code>AddErtisAuth&lt;THandler&gt;()</code> registers your own authentication handler instead of the SDK&apos;s. It takes the same arguments as <code>AddErtisAuth()</code>. Derive the handler from <code>ErtisAuthAuthenticationHandler</code> to keep the ErtisAuth checks and add your own behavior around them:
			</p>
			<Code language="csharp" code={samples.customHandler} />
			<Code language="csharp" code={samples.customHandlerRegistration} />

			<H3 id="testing-your-api">
				Testing your API
			</H3>
			<p>
				Integration tests of your API (for example with <code>WebApplicationFactory</code>) shouldn&apos;t need a running ErtisAuth. Replace the handler with one that signs in a test caller, without changing <code>Program.cs</code>: <code>AddErtisAuth</code> registers only once, so register the test handler <strong>as</strong> <code>ErtisAuthAuthenticationHandler</code> instead:
			</p>
			<Code language="csharp" code={samples.testHandler} />
			<Code language="csharp" code={samples.testFactory} />
			<p>
				Every request is then authenticated as the test caller, and no permission is checked. <code>Token</code> and <code>TokenType</code> must be set: <code>GetUtilizer()</code> requires them.
			</p>

			<H2 id="checklist">
				Checklist
			</H2>
			<ul>
				<li>
					Every controller with endpoints to protect has <code>[Authorized]</code>, or its actions have <code>[SelfAuthorized]</code>. Fix every <code>ERTISAUTH610</code> warning.
				</li>
				<li>
					Every protected action has <code>[RbacResource]</code> (or its controller has) and <code>[RbacAction]</code>.
				</li>
				<li>
					Authorization decisions use <code>GetUtilizer()</code>, never <code>GetUnverifiedUtilizer()</code>.
				</li>
				<li>
					Clients retry on <code>503 AuthenticationServiceUnavailable</code> instead of signing the user out.
				</li>
				<li>
					The application secret is on the server only.
				</li>
				<li>
					With <code>BasicTokenCacheTTL</code>, a rotated secret keeps working on your API for up to that many seconds.
				</li>
				<li>
					The settings are in the application&apos;s configuration (<code>appsettings.json</code>, environment variables…), not in code.
				</li>
			</ul>
		</>
	)
}
