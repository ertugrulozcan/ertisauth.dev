import * as samples from "../samples/authentication"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Authentication() {
	return (
		<>
			<p>
				ErtisAuth authenticates two kinds of callers:
			</p>
			<ul>
				<li>
					<strong>Users</strong> sign in with a username or email address and a password (or through an <DocLink to="external-providers">external provider</DocLink>, or with the <DocLink to="device-code-flow">device code flow</DocLink>) and receive a pair of <strong>Bearer</strong> tokens: an access token and a refresh token.
				</li>
				<li>
					<strong>Applications</strong> send a <strong>Basic</strong> token made of their id and secret with every request. There is nothing to sign in to.
				</li>
			</ul>
			<p>
				Both are sent in the <code>Authorization</code> header:
			</p>
			<Code language="http" code={samples.headers} />
			<Callout>
				unlike HTTP Basic authentication, the Basic token is <strong>not</strong> base64-encoded: it is the application id and the secret separated by a colon, as plain text. Always use HTTPS.
			</Callout>

			<H2 id="endpoints">
				Endpoints
			</H2>
			<Table
				head={["Method", "Route", "Description", "Auth"]}
				rows={[
					[<code>POST</code>, <code>/generate-token</code>, "Sign in, or get a scoped token", "none / Bearer"],
					[<><code>GET</code> <code>POST</code></>, <code>/refresh-token</code>, "Get a new token pair with a refresh token", "refresh token"],
					[<><code>GET</code> <code>POST</code></>, <code>/verify-token</code>, "Check a token", "any token"],
					[<><code>GET</code> <code>POST</code></>, <code>/revoke-token</code>, "Sign out", "access or refresh token"],
					[<code>GET</code>, <><code>/me</code>, <code>/whoami</code></>, "Get the owner of a token", "Bearer / Basic"],
					[<code>POST</code>, <code>/oauth/{"{slug}"}/login</code>, "Sign in with an external provider", "none"],
					[<code>POST</code>, <code>/verify-otp</code>, "Exchange a one-time password for a reset token", "none"],
				]} />
			<p>
				The last two are described in <DocLink to="external-providers">External Identity Providers</DocLink> and <DocLink to="account-recovery">Account Recovery</DocLink>.
			</p>

			<H2 id="the-tokens">
				The tokens
			</H2>

			<H3 id="access-token">
				Access token
			</H3>
			<p>
				A JWT signed with <strong>HMAC-SHA256</strong> using the membership&apos;s <code>secret_key</code>. Its claims:
			</p>
			<Table
				head={["Claim", "Value"]}
				rows={[
					[<code>sub</code>, "The user id"],
					[<code>prn</code>, "The membership id"],
					[<code>jti</code>, "A unique token id"],
					[<code>iss</code>, "The membership name"],
					[<code>aud</code>, "The membership slug"],
					[<><code>given_name</code>, <code>family_name</code></>, "The user's first and last name"],
					[<code>unique_name</code>, "The username"],
					[<code>email</code>, "The email address"],
					[<code>scope</code>, "Space-separated scopes (scoped tokens only)"],
					[<><code>iat</code>, <code>nbf</code>, <code>exp</code></>, "Issue, not-before and expiry times"],
				]} />
			<p>
				Its lifetime is the membership&apos;s <code>expires_in</code> (in seconds).
			</p>
			<p>
				You may decode the token to read these claims, but <strong>don&apos;t treat a token as valid just because its signature is valid</strong>: a token can be revoked before it expires, and the user can be deactivated. Call <a href="#verify-a-token"><code>/verify-token</code></a> or <code>/me</code>, or use the <DocLink to="sdk">SDK</DocLink>, which does it for you.
			</p>

			<H3 id="refresh-token">
				Refresh token
			</H3>
			<p>
				A JWT like the access token, with an additional <code>refresh_token: true</code> claim, valid for the membership&apos;s <code>refresh_token_expires_in</code>. It can only be used to get a new token pair: using it as an access token is rejected with <code>401 InvalidToken</code>.
			</p>

			<H3 id="basic-token">
				Basic token
			</H3>
			<p>
				<code>&lt;application_id&gt;:&lt;secret&gt;</code>. It doesn&apos;t expire; it stops working when the secret is <DocLink to="applications" hash="rotate-the-secret">rotated</DocLink> or the application is deleted. Any problem (unknown application, wrong secret, unknown membership) is reported the same way, as <code>401 InvalidToken</code>, so that application ids can&apos;t be probed.
			</p>

			<H2 id="sign-in">
				Sign in
			</H2>
			<Code language="http" code={samples.signInRequest} />
			<Table
				head={["Header", "Required", "Description"]}
				rows={[
					[<code>X-Ertis-Alias</code>, "yes", <>The membership id (<code>Membership</code> or <code>MembershipId</code> also work)</>],
					[<code>X-IpAddress</code>, "no", "The end user's IP address, stored with the session"],
					[<code>X-UserAgent</code>, "no", "The end user's user agent, stored with the session"],
				]} />
			<Code language="json" code={samples.signInBody} />
			<p>
				<code>username</code> accepts either the username or the email address.
			</p>
			<p>
				<strong>Response <code>201 Created</code></strong>
			</p>
			<Code language="json" code={samples.tokenResponse} />
			<p>
				<code>expires_in</code> and <code>refresh_token_expires_in</code> are in seconds, counted from <code>created_at</code>.
			</p>
			<p>
				<strong>Errors</strong>
			</p>
			<Table
				head={["Status", "Code", "When"]}
				rows={[
					[<code>400</code>, <code>MembershipIdRequired</code>, <><code>X-Ertis-Alias</code> is missing</>],
					[<code>401</code>, <code>InvalidCredentials</code>, "Unknown user or wrong password"],
					[<code>401</code>, <code>UserInactive</code>, "The password is right but the account is not active (not activated yet, or frozen)"],
					[<code>404</code>, <code>MembershipNotFound</code>, "The membership does not exist"],
				]} />
			<p>
				To protect your users:
			</p>
			<ul>
				<li>
					an unknown user and a wrong password give the same answer, and take about the same time, so that attackers can&apos;t find out which accounts exist;
				</li>
				<li>
					the account status (<code>UserInactive</code>) is only revealed to callers who know the correct password.
				</li>
			</ul>
			<p>
				A successful sign-in records a <code>TokenGenerated</code> <DocLink to="events">event</DocLink> and an <DocLink to="sessions">active token</DocLink>.
			</p>

			<H3 id="signing-in-from-your-backend">
				Signing in from your backend
			</H3>
			<p>
				When your backend signs users in on their behalf (a server-rendered web app, a BFF), pass the end user&apos;s details so that sessions show where they come from:
			</p>
			<Code language="shell" code={samples.signInFromBackend} />

			<H2 id="scoped-tokens">
				Scoped tokens
			</H2>
			<p>
				A scoped token is an access token that can do <strong>only part</strong> of what its user can do. Use one when you hand a token to a less trusted party: a browser extension, a third-party integration, a short-lived job.
			</p>
			<p>
				Request it with a valid access token and the list of <code>scopes</code>, without credentials:
			</p>
			<Code language="shell" code={samples.scopedTokenRequest} />
			<p>
				<strong>Response <code>201 Created</code></strong>
			</p>
			<Code language="json" code={samples.scopedTokenResponse} />
			<p>
				Rules:
			</p>
			<ul>
				<li>
					Scopes use the <DocLink to="authorization" hash="permission-expressions">permission format</DocLink> (<code>users.read</code>, <code>*.users.read.*</code>…).
				</li>
				<li>
					The user must have every requested permission; otherwise the request fails with <code>400 UserHasNoPermissionForThisScope</code>. An invalid expression fails with <code>400 InvalidScope</code>, an empty list with <code>400 ScopeRequired</code>.
				</li>
				<li>
					A scoped token can only be narrowed: a scoped token can request a new one with fewer scopes, never with more.
				</li>
				<li>
					A request made with a scoped token must be allowed <strong>both</strong> by the user&apos;s permissions and by the token&apos;s scopes. The scopes are the final gate: they never grant anything the user doesn&apos;t have.
				</li>
				<li>
					The lifetime is the membership&apos;s <code>scoped_token_expires_in</code>, or 12 hours when it is not set.
				</li>
				<li>
					No refresh token is returned.
				</li>
			</ul>

			<H2 id="refresh-a-token">
				Refresh a token
			</H2>
			<p>
				Exchange a refresh token for a new token pair before the access token expires.
			</p>
			<Code language="http" code={samples.refreshGet} />
			<p>
				or, with the refresh token in the body:
			</p>
			<Code language="http" code={samples.refreshPost} />
			<Table
				head={["Query parameter", "Default", "Description"]}
				rows={[
					[<code>revoke</code>, <code>true</code>, <>Revokes the refresh token that was used, so that it works only once. Send <code>revoke=false</code> to keep it usable.</>],
				]} />
			<p>
				<strong>Response <code>201 Created</code></strong>: a new token pair, in the same shape as the sign-in response. A refreshed token keeps the scopes of the original one.
			</p>
			<p>
				<strong>Errors</strong>
			</p>
			<Table
				head={["Status", "Code", "When"]}
				rows={[
					[<code>400</code>, <code>RefreshTokenRequired</code>, "No token in the header or the body"],
					[<code>401</code>, <code>TokenIsNotRefreshable</code>, "The token is an access token, not a refresh token"],
					[<code>401</code>, <code>RefreshTokenWasExpired</code>, "The refresh token has expired: the user must sign in again"],
					[<code>401</code>, <code>RefreshTokenWasRevoked</code>, "The refresh token was already used or revoked"],
					[<code>401</code>, <code>UserInactive</code>, "The user has been deactivated since"],
				]} />
			<Callout>
				refreshing does not revoke the previous <strong>access</strong> token; it stays valid until it expires. Revoke it explicitly if you need it to stop working immediately.
			</Callout>

			<H2 id="verify-a-token">
				Verify a token
			</H2>
			<p>
				Checks a Bearer or Basic token: signature, expiry, revocation, and that its user or application still exists and is active.
			</p>
			<Code language="http" code={samples.verifyGet} />
			<p>
				or
			</p>
			<Code language="http" code={samples.verifyPost} />
			<p>
				In the body, the token is given <strong>with</strong> its type (<code>Bearer …</code> or <code>Basic …</code>).
			</p>
			<p>
				<strong>Response <code>200 OK</code></strong> for a Bearer token:
			</p>
			<Code language="json" code={samples.verifyResponse} />
			<Table
				head={["Field", "Description"]}
				rows={[
					[<code>verified</code>, "Whether the token is valid"],
					[<code>token_kind</code>, <><code>access_token</code> or <code>refresh_token</code></>],
					[<code>remaining_time</code>, "Seconds until the token expires"],
				]} />
			<p>
				For a Basic token, the response has <code>verified</code> and <code>token</code> only.
			</p>
			<p>
				An invalid token answers <code>401</code> with the reason:
			</p>
			<Table
				head={["Code", "When"]}
				rows={[
					[<code>InvalidToken</code>, "Malformed, wrong signature, unknown membership, or a reset/activation token"],
					[<code>TokenWasExpired</code>, "Expired"],
					[<code>TokenWasRevoked</code>, "Revoked (signed out, password changed, user frozen…)"],
					[<code>UserInactive</code>, "The user has been deactivated"],
				]} />

			<H2 id="get-the-token-owner">
				Get the token owner
			</H2>
			<Code language="http" code={samples.me} />
			<p>
				<code>/whoami</code> is the same endpoint under another name.
			</p>
			<ul>
				<li>
					With a <strong>Bearer</strong> token the response is the full <DocLink to="users">user</DocLink>, including the custom fields of their user type (never the password hash).
				</li>
				<li>
					With a <strong>Basic</strong> token the response is the <DocLink to="applications">application</DocLink> (never its secret).
				</li>
			</ul>
			<Code language="json" code={samples.meResponse} />

			<H2 id="sign-out">
				Sign out
			</H2>
			<p>
				Revokes a token. A token pair is revoked together: revoking the access token also revokes its refresh token, and the other way round.
			</p>
			<Code language="http" code={samples.revokeGet} />
			<p>
				or
			</p>
			<Code language="http" code={samples.revokePost} />
			<Table
				head={["Query parameter", "Default", "Description"]}
				rows={[
					[<code>logout-all</code>, <code>false</code>, <><code>true</code> revokes <strong>all</strong> the tokens of the user, on every device</>],
				]} />
			<p>
				<strong>Response <code>204 No Content</code></strong> when the token was revoked, <code>401</code> when it could not be (already revoked, expired, invalid).
			</p>
			<p>
				Revoked tokens are listed in <DocLink to="sessions" hash="revoked-tokens">Sessions</DocLink> and record a <code>TokenRevoked</code> event.
			</p>

			<H3 id="other-ways-tokens-get-revoked">
				Other ways tokens get revoked
			</H3>
			<Table
				head={["Action", "Effect"]}
				rows={[
					[<DocLink to="users" hash="change-a-password">Change password</DocLink>, "All the user's tokens are revoked, except the session in which users changed their own password"],
					[<><DocLink to="account-recovery" hash="3-set-the-new-password">Set a new password</DocLink> with a reset token</>, "All the user's tokens are revoked"],
					[<DocLink to="users" hash="freeze-a-user">Freeze a user</DocLink>, "All the user's tokens are revoked and the user can't sign in"],
					[<DocLink to="applications" hash="rotate-the-secret">Rotate an application secret</DocLink>, "The old Basic token stops working immediately"],
				]} />

			<H2 id="recommended-client-flow">
				Recommended client flow
			</H2>
			<ol>
				<li>
					Sign in with <code>/generate-token</code> and keep both tokens.
				</li>
				<li>
					Send the access token with each request.
				</li>
				<li>
					Shortly before <code>expires_in</code> runs out, or when a request answers <code>401 TokenWasExpired</code>, call <code>/refresh-token</code> and replace both tokens.
				</li>
				<li>
					When the refresh fails with <code>401</code>, send the user to the sign-in page.
				</li>
				<li>
					On sign-out, call <code>/revoke-token</code> (with <code>logout-all=true</code> for &quot;sign out everywhere&quot;).
				</li>
			</ol>
		</>
	)
}
