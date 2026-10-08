import * as samples from "../samples/webhooks"
import { Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Webhooks() {
	return (
		<>
			<p>
				A webhook sends an HTTP request to a URL of your choice whenever a given <DocLink to="events">event</DocLink> occurs in the membership. Use webhooks to keep other systems in sync with ErtisAuth: create a customer record when a user signs up, clean up data when a user is deleted, post to a chat channel when a role changes.
			</p>

			<H2 id="the-webhook-object">
				The webhook object
			</H2>
			<Code language="json" code={samples.webhook} />
			<Table
				head={["Field", "Required", "Description"]}
				rows={[
					[<code>name</code>, "yes", "Display name."],
					[<code>description</code>, "no", ""],
					[<code>event</code>, "yes", <>The <DocLink to="events" hash="event-types">event type</DocLink> that triggers the webhook, e.g. <code>UserCreated</code>.</>],
					[<code>status</code>, "yes", <><code>active</code> or <code>passive</code>. Passive webhooks are kept but not called.</>],
					[<code>try_count</code>, "yes", "How many times a failing request is tried, from 1 to 5."],
					[<code>request.method</code>, "yes", <>The HTTP method: <code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>PATCH</code>, <code>DELETE</code>…</>],
					[<code>request.url</code>, "yes", "The URL to call. May contain placeholders."],
					[<code>request.headers</code>, "no", "Headers to send. Values may contain placeholders."],
					[<code>request.body</code>, "no", "A JSON object. String values may contain placeholders."],
					[<code>request.uncoveredBody</code>, "no", <>See <a href="#the-request-body">The request body</a>. <code>false</code> by default.</>],
				]} />

			<H2 id="placeholders">
				Placeholders
			</H2>
			<p>
				The URL, the header values and the string values of the body can contain placeholders in double braces, filled in from the event:
			</p>
			<Table
				head={["Placeholder", "Value"]}
				rows={[
					[<code>{"{{event_type}}"}</code>, "The event type"],
					[<code>{"{{utilizer_id}}"}</code>, "Who caused the event"],
					[<code>{"{{event_time}}"}</code>, "When it happened"],
					[<code>{"{{membership_id}}"}</code>, "The membership id"],
					[<code>{"{{document.<field>}}"}</code>, <>A field of the resource after the change, e.g. <code>{"{{document.email_address}}"}</code></>],
					[<code>{"{{prior.<field>}}"}</code>, "A field of the resource before the change"],
				]} />
			<p>
				Nested fields use dots: <code>{"{{document.sys.created_by}}"}</code>.
			</p>
			<p>
				The values are escaped for where they are used, so that the data of an event (a user&apos;s name, for example) can&apos;t change the request:
			</p>
			<ul>
				<li>
					in the <strong>URL</strong>, values are URL-encoded (<code>../admin</code> becomes <code>..%2Fadmin</code>);
				</li>
				<li>
					in <strong>headers</strong>, a value that would contain a line break is not sent;
				</li>
				<li>
					in the <strong>body</strong>, each placeholder stays inside its JSON string: it can&apos;t add fields or change the structure.
				</li>
			</ul>

			<H2 id="the-request-body">
				The request body
			</H2>
			<p>
				By default (<code>uncoveredBody: false</code>) the request body wraps your <code>body</code> together with the event&apos;s documents:
			</p>
			<Code language="json" code={samples.coveredBody} />
			<p>
				With <code>uncoveredBody: true</code> the request body is your <code>body</code> alone, after the placeholders are filled in:
			</p>
			<Code language="json" code={samples.uncoveredBody} />
			<p>
				Use <code>uncoveredBody: true</code> when the receiving API expects a specific format.
			</p>

			<H2 id="delivery">
				Delivery
			</H2>
			<ul>
				<li>
					Webhooks are called <strong>asynchronously</strong>, from a background queue: the request that caused the event doesn&apos;t wait for them, and a slow or failing receiver can&apos;t slow down or break ErtisAuth.
				</li>
				<li>
					A call counts as successful when the receiver answers with a 2xx status. Otherwise it is tried again, up to <code>try_count</code> times in total, one right after the other.
				</li>
				<li>
					Every attempt records a <code>WebhookRequestSent</code> or <code>WebhookRequestFailed</code> <DocLink to="events">event</DocLink> with the request, the status code and the response body, so you can see what happened.
				</li>
				<li>
					Webhooks are delivered <strong>at most once per attempt</strong>, not exactly once: make your receiver idempotent (for example by using <code>document._id</code>), and expect that a call may be missed if ErtisAuth restarts while it is queued.
				</li>
			</ul>

			<H2 id="securing-your-receiver">
				Securing your receiver
			</H2>
			<ul>
				<li>
					Use HTTPS.
				</li>
				<li>
					Authenticate the calls: put a secret in a header (<code>&quot;Authorization&quot;: &quot;Bearer &lt;secret&gt;&quot;</code>) or in the URL, and check it in your receiver.
				</li>
				<li>
					Don&apos;t trust the body blindly: when in doubt, read the resource from ErtisAuth with an application token.
				</li>
			</ul>

			<H2 id="endpoints">
				Endpoints
			</H2>
			<p>
				All routes are under <code>{"/memberships/{membershipId}"}</code>.
			</p>
			<Table
				head={["Method", "Route", "Description", "Permission"]}
				rows={[
					[<code>GET</code>, <code>{"/webhooks/{id}"}</code>, "Get a webhook", <code>{"webhooks.read.{id}"}</code>],
					[<code>GET</code>, <code>/webhooks</code>, "List webhooks", <code>webhooks.read</code>],
					[<code>POST</code>, <code>/webhooks/_query</code>, "Query webhooks", <code>webhooks.read</code>],
					[<code>POST</code>, <code>/webhooks</code>, "Create a webhook", <code>webhooks.create</code>],
					[<code>PUT</code>, <code>{"/webhooks/{id}"}</code>, "Update a webhook", <code>{"webhooks.update.{id}"}</code>],
					[<code>DELETE</code>, <code>{"/webhooks/{id}"}</code>, "Delete a webhook", <code>{"webhooks.delete.{id}"}</code>],
					[<code>DELETE</code>, <code>/webhooks</code>, "Delete several webhooks", <code>webhooks.delete</code>],
				]} />

			<H3 id="create-a-webhook">
				Create a webhook
			</H3>
			<Code language="shell" code={samples.create} />
			<p>
				<strong>Response <code>201 Created</code></strong>: the webhook.
			</p>
			<Table
				head={["Error", "When"]}
				rows={[
					[<code>400 ModelValidationError</code>, <>A required field is missing, the event type or the HTTP method is unknown, or <code>try_count</code> is not between 1 and 5</>],
					[<code>404 MembershipNotFound</code>, "The membership does not exist"],
					[<code>409 WebhookAlreadyExists</code>, "The slug is taken"],
				]} />

			<H3 id="update-and-delete">
				Update and delete
			</H3>
			<p>
				<code>{"PUT /webhooks/{id}"}</code> replaces the webhook with the body (same fields as create). An update without any change answers <code>409 IdenticalDocumentError</code>. <code>{"DELETE /webhooks/{id}"}</code> answers <code>204 No Content</code>.
			</p>

			<H2 id="events">
				Events
			</H2>
			<p>
				<code>WebhookCreated</code>, <code>WebhookUpdated</code>, <code>WebhookDeleted</code>, and the delivery events <code>WebhookRequestSent</code> and <code>WebhookRequestFailed</code>. See <DocLink to="events">Events</DocLink>.
			</p>
		</>
	)
}
