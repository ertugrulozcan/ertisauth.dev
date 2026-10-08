import * as samples from "../samples/mail-hooks"
import { Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function MailHooks() {
	return (
		<>
			<p>
				A mail hook sends a templated email whenever a given <DocLink to="events">event</DocLink> occurs in the membership: a welcome mail on <code>UserCreated</code>, a security notice on <code>UserPasswordChanged</code>, an alert to administrators on <code>RoleUpdated</code>.
			</p>
			<p>
				Two mail hooks with reserved names also power the <DocLink to="account-recovery">activation and password reset flows</DocLink>.
			</p>

			<H2 id="before-you-start">
				Before you start
			</H2>
			<p>
				Mails are sent through one of the membership&apos;s <strong>mail providers</strong> (SMTP, SendGrid or Mailchimp Transactional), defined in its <code>mail_providers</code> field. See <DocLink to="memberships" hash="mail-providers">Memberships</DocLink>.
			</p>

			<H2 id="the-mail-hook-object">
				The mail hook object
			</H2>
			<Code language="json" code={samples.mailHook} />
			<Table
				head={["Field", "Required", "Description"]}
				rows={[
					[<code>name</code>, "yes", <>Display name. <code>User Activation</code> and <code>Reset Password</code> are <a href="#activation-and-reset-password-mails">special</a>.</>],
					[<code>slug</code>, "no", "Derived from the name when omitted."],
					[<code>description</code>, "no", ""],
					[<code>event</code>, "yes", <>The <DocLink to="events" hash="event-types">event type</DocLink> that triggers the mail.</>],
					[<code>status</code>, "yes", <><code>active</code> or <code>passive</code>.</>],
					[<code>mailProvider</code>, "yes", <>The <code>slug</code> of one of the membership&apos;s mail providers.</>],
					[<><code>fromName</code>, <code>fromAddress</code></>, "", "The sender. Use an address your mail provider is allowed to send from."],
					[<code>sendToUtilizer</code>, "", <><code>true</code> also sends the mail to the user who caused the event (for example the user who changed their password).</>],
					[<code>recipients</code>, "", <>Fixed or templated recipients, each <code>{"{ \"displayName\", \"emailAddress\" }"}</code>.</>],
					[<code>mailSubject</code>, "", "The subject. May contain placeholders."],
					[<code>mailTemplate</code>, "", <>The HTML body with placeholders, or the Mailchimp template name (see <a href="#mailchimp-templates">below</a>).</>],
					[<code>variables</code>, "", <>Mailchimp merge variables, see <a href="#mailchimp-templates">below</a>.</>],
				]} />
			<p>
				Recipients are deduplicated by email address.
			</p>

			<H2 id="templates">
				Templates
			</H2>
			<p>
				Subjects, bodies and recipients use placeholders in double braces, filled in from the event:
			</p>
			<Table
				head={["Placeholder", "Value"]}
				rows={[
					[<><code>{"{{event_type}}"}</code>, <code>{"{{utilizer_id}}"}</code>, <code>{"{{event_time}}"}</code>, <code>{"{{membership_id}}"}</code></>, "Fields of the event"],
					[<code>{"{{document.<field>}}"}</code>, "A field of the resource after the change"],
					[<code>{"{{prior.<field>}}"}</code>, "A field of the resource before the change"],
				]} />
			<p>
				For example, a notice on <code>UserPasswordChanged</code> sent to the user:
			</p>
			<Code language="json" code={samples.passwordChangedNotice} />
			<p>
				Values are inserted safely:
			</p>
			<ul>
				<li>
					in the HTML body, every value is <strong>HTML-encoded</strong>, so a user who puts markup in their name can&apos;t inject it into your mails; the markup of your template itself is kept;
				</li>
				<li>
					in the subject, line breaks in values are replaced with spaces;
				</li>
				<li>
					placeholders that can&apos;t be resolved are left as they are.
				</li>
			</ul>

			<H3 id="mailchimp-templates">
				Mailchimp templates
			</H3>
			<p>
				With a <code>MailChimp</code> provider, ErtisAuth doesn&apos;t render the body itself: it asks Mailchimp Transactional to send one of your stored templates.
			</p>
			<ul>
				<li>
					<code>mailTemplate</code> is the <strong>name of the template</strong> in Mailchimp.
				</li>
				<li>
					<code>variables</code> are the merge variables passed to it; their values may contain placeholders:
				</li>
			</ul>
			<Code language="json" code={samples.variables} />

			<H2 id="activation-and-reset-password-mails">
				Activation and reset password mails
			</H2>
			<p>
				Two mail hooks are found by their <strong>name</strong> and used by the account flows, with their own data:
			</p>
			<Table
				head={["Name", "Event", "Used by", "Placeholders"]}
				rows={[
					[<code>User Activation</code>, <code>UserCreated</code>, <DocLink to="account-recovery" hash="account-activation">Account activation</DocLink>, <><code>{"{{user.<field>}}"}</code>, <code>{"{{activationLink}}"}</code></>],
					[<code>Reset Password</code>, <code>UserPasswordReset</code>, <DocLink to="account-recovery" hash="password-reset">Password reset</DocLink>, <><code>{"{{user.<field>}}"}</code>, <code>{"{{resetPasswordLink}}"}</code></>],
				]} />
			<p>
				They must have the exact name, the event above and the status <code>active</code>. They are sent only by their flows, not as ordinary mail hooks of their event.
			</p>

			<H2 id="delivery">
				Delivery
			</H2>
			<ul>
				<li>
					Mails are sent <strong>asynchronously</strong>, from a background queue; the request that caused the event doesn&apos;t wait for them.
				</li>
				<li>
					Each mail records a <code>MailhookMailSent</code> or a <code>MailhookMailFailed</code> <DocLink to="events">event</DocLink> with its recipients (and the error), which is the place to look when a mail doesn&apos;t arrive.
				</li>
				<li>
					Mails are not retried.
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
					[<code>GET</code>, <code>{"/mailhooks/{id}"}</code>, "Get a mail hook", <code>{"mailhooks.read.{id}"}</code>],
					[<code>GET</code>, <code>/mailhooks</code>, "List mail hooks", <code>mailhooks.read</code>],
					[<code>POST</code>, <code>/mailhooks/_query</code>, "Query mail hooks", <code>mailhooks.read</code>],
					[<code>POST</code>, <code>/mailhooks</code>, "Create a mail hook", <code>mailhooks.create</code>],
					[<code>PUT</code>, <code>{"/mailhooks/{id}"}</code>, "Update a mail hook", <code>{"mailhooks.update.{id}"}</code>],
					[<code>DELETE</code>, <code>{"/mailhooks/{id}"}</code>, "Delete a mail hook", <code>{"mailhooks.delete.{id}"}</code>],
					[<code>DELETE</code>, <code>/mailhooks</code>, "Delete several mail hooks", <code>mailhooks.delete</code>],
				]} />
			<p>
				<strong>Create</strong> answers <code>201 Created</code>; <code>400 ModelValidationError</code> when the name, the mail provider, the status (<code>active</code> / <code>passive</code>) or the event type is missing or invalid, and <code>409 MailHookAlreadyExists</code> when the slug is taken. <strong>Update</strong> replaces the mail hook; an update without any change answers <code>409 IdenticalDocumentError</code>. <strong>Delete</strong> answers <code>204 No Content</code>.
			</p>

			<H2 id="events">
				Events
			</H2>
			<p>
				<code>MailhookCreated</code>, <code>MailhookUpdated</code>, <code>MailhookDeleted</code>, and the delivery events <code>MailhookMailSent</code> and <code>MailhookMailFailed</code>. See <DocLink to="events">Events</DocLink>.
			</p>
		</>
	)
}
