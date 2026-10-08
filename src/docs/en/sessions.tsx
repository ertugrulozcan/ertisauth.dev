import * as samples from "../samples/sessions"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Sessions() {
	return (
		<>
			<p>
				ErtisAuth keeps track of every token pair it issues. You can list the <strong>active tokens</strong> of a membership to show users where they are signed in, and list the <strong>revoked tokens</strong> for auditing.
			</p>

			<H2 id="active-tokens">
				Active tokens
			</H2>
			<p>
				An active token is a token pair that is neither expired nor revoked.
			</p>
			<Code language="json" code={samples.activeToken} />
			<Table
				head={["Field", "Description"]}
				rows={[
					[<code>expire_time</code>, "When the access token expires"],
					[<code>retain_until</code>, "The later of the access and refresh token expiry. MongoDB removes the record a few minutes after this time."],
					[<code>client_info</code>, <>The IP address and user agent of the sign-in, from the request or from the <code>X-IpAddress</code> and <code>X-UserAgent</code> headers</>],
				]} />
			<Callout type="warning">
				active token records contain the tokens themselves. Anyone who can read them can act as those users. Grant <code>tokens.read</code> only to trusted operators, and use <code>select</code> to leave the tokens out when you show sessions in a user interface.
			</Callout>

			<H3 id="endpoints">
				Endpoints
			</H3>
			<p>
				All routes are under <code>{"/memberships/{membershipId}"}</code>.
			</p>
			<Table
				head={["Method", "Route", "Description", "Permission"]}
				rows={[
					[<code>GET</code>, <code>{"/active-tokens/{id}"}</code>, "Get an active token", <code>{"tokens.read.{id}"}</code>],
					[<code>GET</code>, <code>/active-tokens</code>, "List active tokens", <code>tokens.read</code>],
					[<code>POST</code>, <code>/active-tokens/_query</code>, "Query active tokens", <code>tokens.read</code>],
					[<code>POST</code>, <code>/active-tokens/_aggregate</code>, "Run an aggregation pipeline", <code>tokens.read</code>],
				]} />

			<H3 id="examples">
				Examples
			</H3>
			<p>
				The sessions of a user, without the token values:
			</p>
			<Code language="shell" code={samples.userSessions} />
			<p>
				The number of signed-in users per day:
			</p>
			<Code language="json" code={samples.dailyUsers} />
			<p>
				To end a session, <DocLink to="authentication" hash="sign-out">revoke</DocLink> its token. To sign a user out everywhere, revoke with <code>logout-all=true</code>, <DocLink to="users" hash="change-a-password">change their password</DocLink> or <DocLink to="users" hash="freeze-a-user">freeze</DocLink> them.
			</p>

			<H2 id="revoked-tokens">
				Revoked tokens
			</H2>
			<p>
				Revoked tokens are kept until they would have expired anyway, so that they are rejected until then.
			</p>
			<Code language="json" code={samples.revokedToken} />

			<H3 id="endpoints-1">
				Endpoints
			</H3>
			<Table
				head={["Method", "Route", "Description", "Permission"]}
				rows={[
					[<code>GET</code>, <code>{"/memberships/{membershipId}/revoked-tokens"}</code>, "List revoked tokens", <code>tokens.read</code>],
					[<code>POST</code>, <code>{"/memberships/{membershipId}/revoked-tokens/_query"}</code>, "Query revoked tokens", <code>tokens.read</code>],
				]} />
		</>
	)
}
