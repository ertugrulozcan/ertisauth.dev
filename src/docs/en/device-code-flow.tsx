import * as samples from "../samples/device-code-flow"
import { Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function DeviceCodeFlow() {
	return (
		<>
			<p>
				The device code flow signs users in on devices where typing a password is impractical: smart TVs, set-top boxes, kiosks, game consoles, command-line tools. It follows the model of the OAuth 2.0 device authorization grant (<a href="https://www.rfc-editor.org/rfc/rfc8628">RFC 8628</a>).
			</p>
			<ol>
				<li>
					The device asks ErtisAuth for a code. It gets two values: a short <strong>user code</strong> to show on screen, and a long <strong>device code</strong> that it keeps to itself.
				</li>
				<li>
					The user opens your website or app on their phone or computer, where they are already signed in, and enters the user code.
				</li>
				<li>
					Your site shows which device is asking and lets the user <strong>approve</strong> or <strong>deny</strong> it.
				</li>
				<li>
					The device, which has been polling with its device code in the meantime, receives a <strong>token pair</strong> for that user.
				</li>
			</ol>
			<Code language="text" title="flow" code={samples.diagram.en} />
			<p>
				Why two codes? The user code is visible to anyone who can see the screen, so it only identifies the request. The token can only be obtained with the device code, which never leaves the device.
			</p>

			<H2 id="code-policies">
				Code policies
			</H2>
			<p>
				The format of the user codes is set by a <strong>code policy</strong>, and each membership names the policy it uses in its <code>code_policy</code> field.
			</p>
			<Code language="json" code={samples.policy} />
			<Table
				head={["Field", "Required", "Description"]}
				rows={[
					[<code>name</code>, "yes", "Display name."],
					[<code>slug</code>, "no", <>Derived from the name when omitted. The membership&apos;s <code>code_policy</code> refers to it.</>],
					[<code>length</code>, "yes", "Number of characters of every user code, from 5 to 12, for every character set."],
					[<><code>contains_letters</code>, <code>contains_digits</code></>, "at least one", <>The character set: letters, digits, or both. Codes with both leave out the characters that are easily confused (<code>0</code>, <code>O</code>, <code>1</code>, <code>I</code>).</>],
					[<code>expires_in</code>, "yes", "How long a code can be approved and used, in seconds, from 1 to 1800 (30 minutes)."],
				]} />
			<p>
				A policy outside these limits is rejected with <code>400 ModelValidationError</code> when it is created or updated.
			</p>
			<p>
				Choose the length with the screen in mind: on a TV, 5 to 8 characters are comfortable to read and type. Since the user code alone can&apos;t give a token, a short code is safe; a longer one mostly makes it harder to guess a code of someone else that is waiting for approval.
			</p>

			<H3 id="endpoints">
				Endpoints
			</H3>
			<p>
				All routes are under <code>/memberships/{"{membershipId}"}</code>.
			</p>
			<Table
				head={["Method", "Route", "Permission"]}
				rows={[
					[<code>GET</code>, <code>/code-policies/{"{id}"}</code>, <code>code-policies.read.{"{id}"}</code>],
					[<code>GET</code>, <code>/code-policies</code>, <code>code-policies.read</code>],
					[<code>POST</code>, <code>/code-policies/_query</code>, <code>code-policies.read</code>],
					[<code>POST</code>, <code>/code-policies</code>, <code>code-policies.create</code>],
					[<code>PUT</code>, <code>/code-policies/{"{id}"}</code>, <code>code-policies.update.{"{id}"}</code>],
					[<code>DELETE</code>, <code>/code-policies/{"{id}"}</code>, <code>code-policies.delete.{"{id}"}</code>],
					[<code>DELETE</code>, <code>/code-policies</code>, <code>code-policies.delete</code>],
				]} />
			<p>
				A policy used by the membership can&apos;t be deleted (<code>409 TokenCodePolicyInUse</code>). A duplicate slug answers <code>409 TokenCodePolicyAlreadyExists</code>, an update without changes <code>409 IdenticalDocumentError</code>.
			</p>

			<H3 id="enable-the-flow">
				Enable the flow
			</H3>
			<ol>
				<li>
					Create a policy:
					<Code language="shell" code={samples.createPolicy} />
				</li>
				<li>
					Set <code>&quot;code_policy&quot;: &quot;tv-codes&quot;</code> on the <DocLink to="memberships" hash="update-a-membership">membership</DocLink>.
				</li>
			</ol>

			<H2 id="token-codes">
				Token codes
			</H2>
			<p>
				All routes are under <code>/memberships/{"{membershipId}"}</code>.
			</p>
			<Table
				head={["Method", "Route", "Description", "Who calls it", "Permission"]}
				rows={[
					[<code>POST</code>, <code>/codes</code>, "Generate a code", "the device (or its backend)", <code>tokens.create</code>],
					[<code>GET</code>, <code>/codes/{"{user_code}"}</code>, "Show the device of a code", "your approval page", <><code>tokens.create</code>, Bearer token</>],
					[<code>POST</code>, <code>/codes/{"{user_code}"}/approve</code>, "Approve a code", "your approval page", <><code>tokens.create</code>, Bearer token</>],
					[<code>POST</code>, <code>/codes/{"{user_code}"}/deny</code>, "Deny a code", "your approval page", <><code>tokens.create</code>, Bearer token</>],
					[<code>POST</code>, <code>/codes/token</code>, "Get the token with the device code", "the device", "none"],
				]} />

			<H3 id="1-generate-a-code">
				1. Generate a code
			</H3>
			<Code language="http" code={samples.generate} />
			<p>
				The device calls this through your backend, or with the credentials of an application dedicated to devices whose role has only <code>tokens.create</code>. Credentials embedded in a device can be extracted, so give them no other permission.
			</p>
			<p>
				<code>X-IpAddress</code> and <code>X-UserAgent</code> describe the device; when they are missing, the address and user agent of the request are used. They are shown to the user before the approval and stored with the session.
			</p>
			<p>
				<strong>Response <code>201 Created</code></strong>
			</p>
			<Code language="json" code={samples.generateResponse} />
			<Table
				head={["Field", "Use"]}
				rows={[
					[<code>user_code</code>, <>Show it on the screen, together with the address of your approval page. You may split it for readability (<code>K7Q2-XD9M</code>): case, dashes and spaces are ignored when the user enters it.</>],
					[<code>device_code</code>, <>Keep it in the device&apos;s memory and use it to get the token. <strong>It is returned only in this response</strong>; ErtisAuth stores only its hash. Never show or log it.</>],
					[<code>interval</code>, "Seconds to wait between two token requests."],
					[<code>expire_time</code>, "After this time the code can't be used; request a new one."],
				]} />
			<Table
				head={["Error", "When"]}
				rows={[
					[<code>404 TokenCodePolicyNotFound</code>, <>The membership has no <code>code_policy</code>, or the policy does not exist</>],
					[<code>503 TokenCodeCouldNotBeGenerated</code>, "No unused user code was found; try again (very unlikely, unless the policy has very few possible codes)"],
				]} />

			<H3 id="2-show-the-device-to-the-user">
				2. Show the device to the user
			</H3>
			<p>
				On your approval page the signed-in user enters the code. Before approving, show them what they are about to sign in:
			</p>
			<Code language="http" code={samples.show} />
			<p>
				<strong>Response <code>200 OK</code></strong>: the code without its device code, with <code>status</code> (<code>pending</code>, <code>approved</code> or <code>denied</code>), <code>created_at</code> and <code>client_info</code>:
			</p>
			<blockquote>
				Sign in on <strong>LivingRoomTV/2.4 (Tizen 7.0)</strong> from <strong>203.0.113.42</strong>, requested 1 minute ago?
			</blockquote>
			<Table
				head={["Error", "When"]}
				rows={[
					[<code>404 TokenCodeNotFound</code>, "Unknown or expired code"],
					[<code>400 TokenTypeNotSupported</code>, "The token is not a Bearer token"],
				]} />
			<p>
				This step protects users from <strong>code phishing</strong>: an attacker generates a code on their own device and tricks the victim into entering it (&quot;enter this code to claim your prize&quot;). If the user sees an unknown device, they deny the request.
			</p>

			<H3 id="3-approve-or-deny">
				3. Approve or deny
			</H3>
			<Code language="http" code={samples.approve} />
			<Code language="http" code={samples.deny} />
			<p>
				The token must be a user&apos;s <strong>Bearer</strong> token: the device will be signed in as <strong>this user</strong>. An application&apos;s Basic token is rejected with <code>400 TokenTypeNotSupported</code>. The user&apos;s role needs <code>tokens.create</code>.
			</p>
			<p>
				<strong>Response <code>200 OK</code></strong> with the code, now <code>approved</code> or <code>denied</code>, and the id of the user in <code>user_id</code>. A <code>TokenCodeApproved</code> or <code>TokenCodeDenied</code> <DocLink to="events">event</DocLink> is recorded.
			</p>
			<p>
				A code can be approved or denied <strong>only once</strong>, and only while it is pending: if two people try at the same time, only one succeeds.
			</p>
			<p>
				<strong>Approving with a scoped token.</strong> When the approval is made with a <DocLink to="authentication" hash="scoped-tokens">scoped token</DocLink> (its scopes must cover <code>tokens.create</code>), the device gets a token limited to <strong>the same scopes</strong>: a device can never get more than the session that approved it. Such a token lives for the membership&apos;s <code>scoped_token_expires_in</code> (12 hours by default), and keeps its scopes when it is refreshed. An approval with an ordinary access token gives the device an ordinary token.
			</p>
			<Table
				head={["Error", "When"]}
				rows={[
					[<code>400 TokenTypeNotSupported</code>, "The token is not a Bearer token"],
					[<code>401 TokenCodeExpired</code>, "The code has expired"],
					[<code>404 TokenCodeNotFound</code>, "Unknown code"],
					[<code>409 TokenCodeAlreadyAuthorized</code>, "The code was already approved or denied"],
				]} />

			<H3 id="4-get-the-token">
				4. Get the token
			</H3>
			<p>
				The device polls every <code>interval</code> seconds until it gets a token or the code expires:
			</p>
			<Code language="http" code={samples.token} />
			<p>
				No token is needed. The device code is sent in the body, not in the URL, so that it doesn&apos;t end up in access logs.
			</p>
			<Table
				head={["Response", "Meaning", "What the device does"]}
				rows={[
					[<><code>201 Created</code> with a token pair</>, "Approved", "Stores the tokens and stops polling"],
					[<code>401 UnauthorizedTokenCode</code>, "Not approved yet", <>Waits <code>interval</code> seconds and polls again</>],
					[<code>400 TokenCodeSlowDown</code>, <>Polled before <code>interval</code> seconds passed</>, "Waits longer before the next poll"],
					[<code>401 TokenCodeDenied</code>, "The user denied the request", "Stops; shows a message, offers a new code"],
					[<code>401 TokenCodeExpired</code>, "The code expired", "Requests a new code"],
					[<code>401 UserInactive</code>, "The approving user has been deactivated since", "Requests a new code"],
					[<code>401 InvalidToken</code>, "Unknown or already used device code", "Requests a new code"],
				]} />
			<ul>
				<li>
					The token pair is generated <strong>when the device gets it</strong>, so its lifetime starts then, and it is handed out <strong>once</strong>: the code is deleted at that moment.
				</li>
				<li>
					The session records the device&apos;s IP address and user agent, so it is easy to recognize in the user&apos;s <DocLink to="sessions">sessions</DocLink>.
				</li>
				<li>
					From then on the device <DocLink to="authentication" hash="refresh-a-token">refreshes</DocLink> its token like any other client.
				</li>
			</ul>

			<H2 id="example-device-loop">
				Example device loop
			</H2>
			<Code language="javascript" code={samples.deviceLoop} />

			<H2 id="security-notes">
				Security notes
			</H2>
			<ul>
				<li>
					The user code is not a secret; the device code is. Keep the device code in memory only, and use HTTPS.
				</li>
				<li>
					Always show the device information before the approval, and let users deny unknown devices.
				</li>
				<li>
					Give the credentials used by devices only the <code>tokens.create</code> permission.
				</li>
				<li>
					Rate-limit <code>POST /codes</code> and <code>POST /codes/token</code> at your gateway.
				</li>
			</ul>
		</>
	)
}
