import * as samples from "../samples/account-recovery"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function AccountRecovery() {
	return (
		<>
			<p>
				This page describes the flows that let users prove they own their email address and get back into their account:
			</p>
			<ul>
				<li>
					<a href="#account-activation">Account activation</a>: new users confirm their email address before they can sign in.
				</li>
				<li>
					<a href="#password-reset">Password reset</a>: users who forgot their password get a reset link by email.
				</li>
				<li>
					<a href="#one-time-passwords">One-time passwords</a>: users get a short code through a channel of your choice (SMS, a call center…) and exchange it for a password reset.
				</li>
			</ul>
			<p>
				All three end with a <strong>page of your own</strong> (an activation page, a reset password page) and its <strong>backend</strong>, which calls ErtisAuth. ErtisAuth doesn&apos;t host these pages.
			</p>

			<H2 id="how-the-links-work">
				How the links work
			</H2>
			<p>
				Activation and reset mails contain a link to your page. You give the page&apos;s URL in the <code>X-Host</code> header, and ErtisAuth appends a query parameter with a code:
			</p>
			<Table
				head={["Flow", "Link"]}
				rows={[
					["Activation", <code>{"{X-Host}?uat=<code>"}</code>],
					["Password reset", <code>{"{X-Host}?rpt=<code>"}</code>],
				]} />
			<p>
				For example, with <code>X-Host: https://app.example.com/reset-password</code> the reset mail links to <code>https://app.example.com/reset-password?rpt=NjZmMWMw…</code>.
			</p>
			<p>
				The code is base64 of <code>&lt;membership_id&gt;:&lt;token&gt;</code>. Treat it as opaque: your page reads it from the query string and passes it back to ErtisAuth unchanged.
			</p>
			<p>
				The codes are <strong>single-use</strong> and short-lived, and they can&apos;t be used as access tokens.
			</p>

			<H2 id="who-calls-these-endpoints">
				Who calls these endpoints
			</H2>
			<p>
				The endpoints of these flows are protected like any other endpoint (see the permissions below), because the person on your page is not signed in. Call them <strong>from your page&apos;s backend with an application&apos;s Basic token</strong>, and give that application&apos;s role only what the flows need:
			</p>
			<Code language="json" code={samples.accountPagesRole} />
			<p>
				Never put the application&apos;s secret in the browser.
			</p>

			<H2 id="account-activation">
				Account activation
			</H2>
			<p>
				When a membership&apos;s <code>user_activation</code> is <code>active</code>, new users are created <strong>inactive</strong> and can&apos;t sign in (<code>401 UserInactive</code>) until they click the link in their activation mail.
			</p>

			<H3 id="setup">
				Setup
			</H3>
			<ol>
				<li>
					Add a mail provider to the membership (<code>mail_providers</code>, see <DocLink to="memberships" hash="mail-providers">Memberships</DocLink>).
				</li>
				<li>
					Create a <DocLink to="mail-hooks">mail hook</DocLink> named exactly <strong><code>User Activation</code></strong>, for the event <strong><code>UserCreated</code></strong>, with status <code>active</code>. Use <code>{"{{activationLink}}"}</code> in its template:
					<Code language="json" code={samples.activationMailHook} />
					The template receives <code>user</code> (the new user) and <code>activationLink</code>.
				</li>
				<li>
					Set <code>user_activation</code> to <code>active</code> on the membership.
				</li>
			</ol>
			<p>
				Without a mail provider or the activation mail hook, creating users fails with <code>501 NotDefinedAnyMailProvider</code> or <code>501 ActivationMailHookWasNotDefined</code>, before anything is created.
			</p>

			<H3 id="flow">
				Flow
			</H3>
			<ol>
				<li>
					<strong>Create the user</strong> with the <code>X-Host</code> header set to your activation page:
					<Code language="http" code={samples.createUser} />
					The user is created inactive and the activation mail is queued. If <code>X-Host</code> is missing, the user is still created but no mail is sent; <a href="#resend-the-activation-mail">resend it</a> later.
				</li>
				<li>
					<strong>The user clicks the link</strong> and lands on <code>https://app.example.com/activate?uat=&lt;code&gt;</code>.
				</li>
				<li>
					<strong>Your backend activates the account:</strong>
					<Code language="http" code={samples.activate} />
					Permission: <code>users.update</code>. <strong>Response <code>200 OK</code></strong> with the activated user.
				</li>
			</ol>
			<p>
				The activation code is valid for <strong>72 hours</strong> and only once. It also stops working when the user is changed in the meantime, for example <DocLink to="users" hash="freeze-a-user">frozen</DocLink>.
			</p>
			<Table
				head={["Error", "When"]}
				rows={[
					[<code>401 InvalidToken</code>, "The code is malformed, expired, already used, or of another membership"],
					[<code>400 UserAlreadyActive</code>, "The user is already active"],
				]} />

			<H3 id="resend-the-activation-mail">
				Resend the activation mail
			</H3>
			<Code language="http" code={samples.resendActivation} />
			<p>
				Permission: <code>users.create</code>. <strong>Response <code>200 OK</code></strong>:
			</p>
			<Code language="json" code={samples.resendActivationResponse} />
			<Table
				head={["Error", "When"]}
				rows={[
					[<><code>400 HostRequired</code>, <code>400 EmailAddressRequired</code></>, "A required value is missing"],
					[<code>400 UserAlreadyActive</code>, "Nothing to activate"],
					[<code>404 UserNotFound</code>, "No user with this email address"],
					[<><code>501 NotDefinedAnyMailProvider</code>, <code>501 ActivationMailHookWasNotDefined</code></>, "Mails can't be sent"],
				]} />

			<H3 id="activating-without-a-mail">
				Activating without a mail
			</H3>
			<p>
				An administrator can activate a user directly with <DocLink to="users" hash="activate-a-user"><code>GET /users/{"{id}"}/activate</code></DocLink>.
			</p>

			<H2 id="password-reset">
				Password reset
			</H2>

			<H3 id="setup-1">
				Setup
			</H3>
			<ol>
				<li>
					Add a mail provider to the membership.
				</li>
				<li>
					Create a <DocLink to="mail-hooks">mail hook</DocLink> named exactly <strong><code>Reset Password</code></strong>, for the event <strong><code>UserPasswordReset</code></strong>, with status <code>active</code>. Use <code>{"{{resetPasswordLink}}"}</code> in its template:
					<Code language="json" code={samples.resetMailHook} />
					The template receives <code>user</code> and <code>resetPasswordLink</code>.
				</li>
				<li>
					Optionally set <code>reset_password_token_expires_in</code> on the membership (2 hours by default).
				</li>
			</ol>

			<H3 id="1-request-the-reset">
				1. Request the reset
			</H3>
			<p>
				Your &quot;forgot password&quot; page&apos;s backend calls:
			</p>
			<Code language="http" code={samples.requestReset} />
			<p>
				Permission: <code>users.update</code>. <strong>Response <code>200 OK</code></strong>:
			</p>
			<Code language="json" code={samples.requestResetResponse} />
			<p>
				The mail is queued and a <code>UserPasswordReset</code> event is recorded.
			</p>
			<Table
				head={["Error", "When"]}
				rows={[
					[<><code>400 HostRequired</code>, <code>400 EmailAddressRequired</code></>, "A required value is missing"],
					[<code>401 UserInactive</code>, "The account is inactive or frozen: it can't be recovered this way"],
					[<code>404 UserNotFound</code>, "No user with this email address"],
					[<><code>501 NotDefinedAnyMailProvider</code>, <code>501 ResetPasswordMailHookWasNotDefined</code></>, "Mails can't be sent"],
				]} />
			<Callout>
				an unknown email address answers <code>404</code>. To avoid revealing which addresses have accounts, show the same message to the person in both cases (&quot;If an account exists, we sent you an email&quot;).
			</Callout>

			<H3 id="2-verify-the-link">
				2. Verify the link
			</H3>
			<p>
				When the user opens <code>https://app.example.com/reset-password?rpt=&lt;code&gt;</code>, check the code before you show the form:
			</p>
			<Code language="http" code={samples.verifyResetToken} />
			<p>
				Permission: <code>users.read</code>. <strong>Response <code>200 OK</code></strong>:
			</p>
			<Code language="json" code={samples.verifyResetTokenResponse} />
			<p>
				An invalid, expired or used code answers <code>401 InvalidToken</code>.
			</p>

			<H3 id="3-set-the-new-password">
				3. Set the new password
			</H3>
			<Code language="http" code={samples.setPassword} />
			<p>
				<code>username</code> can be sent instead of <code>email_address</code>. Permission: <code>users.update</code>. <strong>Response <code>200 OK</code></strong>.
			</p>
			<ul>
				<li>
					The code must belong to that user.
				</li>
				<li>
					The code works <strong>once</strong>: setting the password invalidates it.
				</li>
				<li>
					The user is <strong>signed out on every device</strong>.
				</li>
				<li>
					A <code>UserPasswordChanged</code> event is recorded.
				</li>
			</ul>
			<Table
				head={["Error", "When"]}
				rows={[
					[<><code>400 ResetTokenRequired</code>, <code>400 EmailAddressRequired</code>, <code>400 PasswordRequired</code></>, "A required value is missing"],
					[<code>400 PasswordMinLengthRuleError</code>, "The password is shorter than 6 characters"],
					[<code>401 InvalidToken</code>, "The code is invalid, expired, used, or belongs to another user"],
				]} />

			<H2 id="one-time-passwords">
				One-time passwords
			</H2>
			<p>
				One-time passwords (OTP) let users recover their account without email: you deliver a short code to them yourself, for example by SMS or through a support agent, and they exchange it for a password reset.
			</p>

			<H3 id="setup-2">
				Setup
			</H3>
			<p>
				Set <code>otp_settings</code> on the membership:
			</p>
			<Code language="json" code={samples.otpSettings} />
			<Table
				head={["Field", "Description"]}
				rows={[
					[<code>host</code>, <>Required. The address of the page where users enter their code; the verify request must send the same value in <code>X-Host</code>.</>],
					[<code>policy.length</code>, "Number of characters of the code."],
					[<><code>policy.contains_letters</code>, <code>policy.contains_digits</code></>, "The character set of the code."],
					[<code>policy.expires_in</code>, "Lifetime of the code, and of the reset token it is exchanged for (counted from the verification), in seconds. 2 hours when omitted."],
					[<code>policy.max_attempts</code>, "Wrong attempts allowed before the code is deleted. 5 by default, at least 1."],
				]} />

			<H3 id="1-generate-a-code">
				1. Generate a code
			</H3>
			<p>
				Your backend (an SMS service, a support tool) generates a code for a user:
			</p>
			<Code language="http" code={samples.generateOtp} />
			<p>
				Permission: <code>otp.create.{"{userId}"}</code> (the <code>otp</code> resource, not <code>users</code>). <strong>Response <code>200 OK</code></strong>:
			</p>
			<Code language="json" code={samples.generateOtpResponse} />
			<p>
				<code>password</code> is the code. Deliver it to the user. It is returned only in this response: ErtisAuth stores only a keyed hash of it. Generating a new code deletes the previous ones of the user.
			</p>
			<p>
				No reset token exists at this point: it is generated only when the user <a href="#2-verify-the-code">verifies the code</a>. So the service that generates codes can&apos;t change anyone&apos;s password itself, and neither can someone who reads the database.
			</p>
			<Table
				head={["Error", "When"]}
				rows={[
					[<><code>400 OtpNotConfiguredYet</code>, <code>400 OtpHostNotConfiguredYet</code></>, "The membership has no OTP settings"],
					[<code>401 UserInactive</code>, "The account is inactive or frozen"],
					[<code>404 UserNotFound</code>, "Unknown user"],
				]} />

			<H3 id="2-verify-the-code">
				2. Verify the code
			</H3>
			<p>
				The user enters their username (or email address) and the code on your page, which calls:
			</p>
			<Code language="http" code={samples.verifyOtp} />
			<p>
				No token is needed. <code>X-Host</code> must equal the membership&apos;s <code>otp_settings.host</code>. Codes are compared case-insensitively.
			</p>
			<p>
				<strong>Response <code>200 OK</code></strong>: a reset token, generated now. Its lifetime (<code>expires_in</code>) starts at this moment.
			</p>
			<Code language="json" code={samples.verifyOtpResponse} />
			<Callout>
				this is not an access token. It can only be used to <a href="#3-set-the-new-password">set a new password</a>.
			</Callout>
			<Table
				head={["Error", "When"]}
				rows={[
					[<code>400 OtpHostRequired</code>, <><code>X-Host</code> is missing</>],
					[<code>401 OtpHostMismatch</code>, <><code>X-Host</code> is not the membership&apos;s OTP host</>],
					[<code>401 InvalidCredentials</code>, "Wrong code or unknown user"],
					[<code>401 OtpExpired</code>, "The code was right but has expired"],
					[<code>401 UserInactive</code>, "The account was deactivated or frozen after the code was generated"],
				]} />
			<p>
				A code can be used <strong>once</strong>: a successful verification deletes it, so verifying the same code again answers <code>401 InvalidCredentials</code>. The reset token stays valid until it expires or is used, so there is no need to verify again.
			</p>
			<p>
				Each wrong code counts as a failed attempt; after <code>max_attempts</code> failures the code is deleted and a new one must be generated.
			</p>

			<H3 id="3-set-the-new-password-1">
				3. Set the new password
			</H3>
			<p>
				Call <a href="#3-set-the-new-password"><code>POST /users/set-password</code></a> with <code>reset_token</code> from the previous step.
			</p>
		</>
	)
}
