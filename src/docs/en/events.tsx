import * as samples from "../samples/events"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Events() {
	return (
		<>
			<p>
				ErtisAuth records an <strong>event</strong> for most of what happens in a membership: sign-ins, token refreshes, user changes, role changes, sent webhooks and mails… Events serve three purposes:
			</p>
			<ul>
				<li>
					an <strong>audit log</strong> you can read and query through the API,
				</li>
				<li>
					the trigger of <DocLink to="webhooks">webhooks</DocLink>,
				</li>
				<li>
					the trigger of <DocLink to="mail-hooks">mail hooks</DocLink>.
				</li>
			</ul>

			<H2 id="the-event-object">
				The event object
			</H2>
			<Code language="json" code={samples.event} />
			<Table
				head={["Field", "Description"]}
				rows={[
					[<code>event_type</code>, "What happened (see the list below)."],
					[<code>utilizer_id</code>, <>The id of the user or application who caused the event, or <code>system</code>.</>],
					[<code>document</code>, "The resource after the change. Empty for deletions."],
					[<code>prior</code>, "The resource before the change, for updates and deletions."],
					[<code>event_time</code>, "When it happened, in UTC."],
				]} />
			<p>
				Password hashes and application secrets are never part of events.
			</p>

			<H2 id="event-types">
				Event types
			</H2>

			<H3 id="tokens">
				Tokens
			</H3>
			<Table
				head={["Event", <code>document</code>]}
				rows={[
					[<code>TokenGenerated</code>, <><code>user</code>, and <code>token</code> with the metadata of the new token: <code>token_type</code>, <code>expires_in</code>, <code>refresh_token_expires_in</code>, <code>created_at</code></>],
					[<code>TokenRefreshed</code>, <><code>user</code>, and <code>token</code> with the metadata of the new token, as above. A refresh also records a <code>TokenGenerated</code> event.</>],
					[<code>TokenVerified</code>, <><code>token</code> with <code>token_type</code> and, for Bearer tokens, <code>is_refresh_token</code> and <code>expires_at</code> (for Basic tokens, <code>application_id</code>)</>],
					[<code>TokenRevoked</code>, <><code>token</code> with <code>token_type</code> and <code>expire_time</code> of the revoked access token. One event per revoked token pair.</>],
				]} />
			<p>
				Token events never contain the tokens themselves, so the event log and webhook receivers can&apos;t be used to act as a user.
			</p>

			<H3 id="users-and-user-types">
				Users and user types
			</H3>
			<Table
				head={["Event", "When"]}
				rows={[
					[<code>UserCreated</code>, "A user was created, including by a provider sign-up"],
					[<code>UserUpdated</code>, "A user was updated, activated or frozen"],
					[<code>UserDeleted</code>, "A user was deleted"],
					[<code>UserPasswordChanged</code>, "A password was changed, or set with a reset token"],
					[<code>UserPasswordReset</code>, "A password reset was requested"],
					[<><code>UserTypeCreated</code>, <code>UserTypeUpdated</code>, <code>UserTypeDeleted</code></>, "A user type changed"],
				]} />

			<H3 id="other-resources">
				Other resources
			</H3>
			<Table
				head={["Events"]}
				rows={[
					[<><code>ApplicationCreated</code>, <code>ApplicationUpdated</code>, <code>ApplicationDeleted</code></>],
					[<><code>RoleCreated</code>, <code>RoleUpdated</code>, <code>RoleDeleted</code></>],
					[<><code>ProviderCreated</code>, <code>ProviderUpdated</code>, <code>ProviderDeleted</code></>],
					[<><code>WebhookCreated</code>, <code>WebhookUpdated</code>, <code>WebhookDeleted</code></>],
					[<><code>MailhookCreated</code>, <code>MailhookUpdated</code>, <code>MailhookDeleted</code></>],
					[<><code>TokenCodePolicyCreated</code>, <code>TokenCodePolicyUpdated</code>, <code>TokenCodePolicyDeleted</code></>],
				]} />

			<H3 id="device-code-flow">
				Device code flow
			</H3>
			<Table
				head={["Event", <code>document</code>]}
				rows={[
					[<code>TokenCodeApproved</code>, <><code>user</code> (who approved), and <code>code</code> with <code>user_code</code>, <code>client_info</code> (the device) and <code>created_at</code></>],
					[<code>TokenCodeDenied</code>, "the same, for a denied code"],
				]} />
			<p>
				The device code is never part of these events. See <DocLink to="device-code-flow">Device Code Flow</DocLink>.
			</p>

			<H3 id="hook-results">
				Hook results
			</H3>
			<Table
				head={["Event", <code>document</code>]}
				rows={[
					[<code>WebhookRequestSent</code>, "The result of a successful webhook call: request, response status and body, attempt number"],
					[<code>WebhookRequestFailed</code>, "The same for a failed attempt, with the error"],
					[<code>MailhookMailSent</code>, "The recipients"],
					[<code>MailhookMailFailed</code>, "The recipients and the error"],
				]} />
			<Callout>
				don&apos;t create a webhook or mail hook on its own result events (<code>WebhookRequestSent</code>, <code>WebhookRequestFailed</code>, <code>MailhookMailSent</code>, <code>MailhookMailFailed</code>): each call would trigger the next one.
			</Callout>

			<H2 id="endpoints">
				Endpoints
			</H2>
			<p>
				All routes are under <code>{"/memberships/{membershipId}"}</code>.
			</p>
			<Table
				head={["Method", "Route", "Description", "Permission"]}
				rows={[
					[<code>GET</code>, <code>{"/events/{id}"}</code>, "Get an event", <code>{"events.read.{id}"}</code>],
					[<code>GET</code>, <code>/events</code>, "List events", <code>events.read</code>],
					[<code>POST</code>, <code>/events/_query</code>, "Query events", <code>events.read</code>],
				]} />
			<p>
				Events are read-only.
			</p>

			<H3 id="examples">
				Examples
			</H3>
			<p>
				The latest sign-ins of a user:
			</p>
			<Code language="shell" code={samples.userSignIns} />
			<p>
				Who changed roles this month:
			</p>
			<Code language="json" code={samples.roleChanges} />
			<p>
				Failed webhook calls:
			</p>
			<Code language="json" code={samples.failedWebhooks} />
			<Callout>
				events contain personal data (the user documents). Grant <code>events.read</code> only to those who need the audit log, and plan a retention policy for the <code>events</code> collection.
			</Callout>
		</>
	)
}
