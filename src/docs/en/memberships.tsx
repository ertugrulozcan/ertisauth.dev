import * as samples from "../samples/memberships"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Memberships() {
	return (
		<>
			<p>
				A membership is an isolated tenant: it owns users, roles, applications and every other resource, and it holds the authentication settings of its users. See <DocLink to="core-concepts" hash="membership">Core Concepts</DocLink>.
			</p>
			<p>
				The first membership is created by the <DocLink to="getting-started" hash="3-set-up-the-installation">setup</DocLink>. Further memberships are created through this API.
			</p>

			<H2 id="the-membership-object">
				The membership object
			</H2>
			<Code language="json" code={samples.membership} />
			<Table
				head={["Field", "Required", "Description"]}
				rows={[
					[<code>name</code>, "yes", <>Display name. Also the <code>iss</code> claim of the tokens.</>],
					[<code>slug</code>, "no", <>URL-friendly name, unique in the installation. Derived from the name when omitted. Also the <code>aud</code> claim of the tokens.</>],
					[<code>expires_in</code>, "yes", "Access token lifetime, in seconds. Must be greater than 0."],
					[<code>refresh_token_expires_in</code>, "yes", "Refresh token lifetime, in seconds. Must be greater than 0."],
					[<code>scoped_token_expires_in</code>, "no", <><DocLink to="authentication" hash="scoped-tokens">Scoped token</DocLink> lifetime, in seconds. 12 hours when 0 or omitted.</>],
					[<code>reset_password_token_expires_in</code>, "no", "Lifetime of password reset tokens, in seconds. 2 hours when omitted."],
					[<code>secret_key</code>, "yes", "The key all tokens of the membership are signed with (HMAC-SHA256). At least 32 bytes in the membership's encoding."],
					[<code>hash_algorithm</code>, "yes", "The password hash algorithm (see below). There is no default."],
					[<code>encoding</code>, "no", <>Text encoding used to turn passwords and keys into bytes. <code>UTF-8</code> by default.</>],
					[<code>default_language</code>, "no", <>ISO 639-1 code of a <a href="#settings">database locale</a> (e.g. <code>en</code>, <code>tr</code>).</>],
					[<code>user_activation</code>, "no", <><code>active</code>: new users must activate their account from an email before they can sign in. <code>passive</code> (default): new users are active immediately.</>],
					[<code>code_policy</code>, "no", <>Slug of the <DocLink to="device-code-flow" hash="code-policies">code policy</DocLink> used by the device code flow.</>],
					[<code>otp_settings</code>, "no", <><DocLink to="account-recovery" hash="one-time-passwords">One-time password</DocLink> settings. <code>host</code> is required when it is set; <code>policy.max_attempts</code> must be at least 1 (5 by default).</>],
					[<code>mail_providers</code>, "no", <>The mail providers used by <DocLink to="mail-hooks">mail hooks</DocLink>, see below.</>],
				]} />
			<Callout type="warning">
				the <code>secret_key</code> signs every token of the membership. Anyone who knows it can forge tokens for any user. Changing it invalidates all tokens issued so far, so every user has to sign in again.
			</Callout>

			<H3 id="password-hash-algorithms">
				Password hash algorithms
			</H3>
			<Table
				head={["Value", "Recommendation"]}
				rows={[
					[<code>ARGON2ID</code>, <><strong>Recommended</strong> for new memberships.</>],
					[<><code>PBKDF2-SHA512</code>, <code>PBKDF2-SHA256</code></>, "Good choices where Argon2 is not acceptable (e.g. FIPS environments)."],
					[<><code>SHA2-224</code>, <code>SHA2-256</code>, <code>SHA2-384</code>, <code>SHA2-512</code>, <code>SHA2-512-224</code>, <code>SHA2-512-256</code>, <code>SHA3-224</code>, <code>SHA3-256</code>, <code>SHA3-384</code>, <code>SHA3-512</code></>, "Fast hashes, supported for importing existing user databases. Not recommended for new memberships."],
					[<><code>SHA1</code>, <code>MD5</code></>, "Legacy, only for importing old user databases."],
				]} />
			<p>
				Fast hashes (SHA, MD5) can be brute-forced quickly if your database leaks. Prefer <code>ARGON2ID</code> unless you are importing password hashes from another system.
			</p>
			<p>
				The values are also accepted with underscores (<code>SHA2_512</code>).
			</p>

			<H3 id="mail-providers">
				Mail providers
			</H3>
			<p>
				<code>mail_providers</code> is a list of the email services the membership can send through. A <DocLink to="mail-hooks">mail hook</DocLink> refers to one by its <code>slug</code>.
			</p>
			<Table
				head={[<code>type</code>, "Fields", "Delivery"]}
				rows={[
					[<code>SmtpServer</code>, <><code>name</code>, <code>slug</code>, <code>host</code>, <code>port</code>, <code>tls_enabled</code>, <code>username</code>, <code>password</code></>, "ErtisAuth renders the HTML and sends it over SMTP"],
					[<code>SendGrid</code>, <><code>name</code>, <code>slug</code>, <code>apiKey</code></>, "ErtisAuth renders the HTML and sends it with the SendGrid API"],
					[<code>MailChimp</code>, <><code>name</code>, <code>slug</code>, <code>apiKey</code></>, <>A template stored in Mailchimp Transactional (Mandrill) is sent; see <DocLink to="mail-hooks" hash="mailchimp-templates">Mail Hooks</DocLink></>],
				]} />
			<Code language="json" code={samples.mailProviders} />
			<p>
				<code>type</code> is case-sensitive.
			</p>
			<Callout>
				a membership&apos;s response contains its secret key and the credentials of its mail providers. Grant <code>memberships.read</code> only to the operators of the installation.
			</Callout>

			<H2 id="endpoints">
				Endpoints
			</H2>
			<Table
				head={["Method", "Route", "Permission"]}
				rows={[
					[<code>GET</code>, <code>{"/memberships/{id}"}</code>, <code>{"memberships.read.{id}"}</code>],
					[<code>GET</code>, <code>/memberships</code>, <code>memberships.read</code>],
					[<code>POST</code>, <code>/memberships/_query</code>, <code>memberships.read</code>],
					[<code>GET</code>, <code>/memberships/search?keyword=</code>, <code>memberships.read</code>],
					[<code>POST</code>, <code>/memberships</code>, <code>memberships.create</code>],
					[<code>PUT</code>, <code>{"/memberships/{id}"}</code>, <code>{"memberships.update.{id}"}</code>],
					[<code>DELETE</code>, <code>{"/memberships/{id}"}</code>, <code>{"memberships.delete.{id}"}</code>],
					[<code>GET</code>, <code>/memberships/settings</code>, <code>memberships.read</code>],
					[<code>GET</code>, <code>/memberships/settings/encodings</code>, <code>memberships.read</code>],
					[<code>GET</code>, <code>/memberships/settings/encodings/default</code>, <code>memberships.read</code>],
					[<code>GET</code>, <code>/memberships/settings/hash-algorithms</code>, <code>memberships.read</code>],
					[<code>GET</code>, <code>/memberships/settings/hash-algorithms/default</code>, <code>memberships.read</code>],
					[<code>GET</code>, <code>/memberships/settings/db-locales</code>, <code>memberships.read</code>],
					[<code>GET</code>, <code>/memberships/settings/db-locales/default</code>, <code>memberships.read</code>],
				]} />
			<p>
				The membership routes are installation-wide: they are not bound to the membership of the caller&apos;s token.
			</p>

			<H3 id="get-a-membership">
				Get a membership
			</H3>
			<Code language="http" code={samples.get} />
			<p>
				<code>{"{id}"}</code> is the id or the slug. Answers <code>404 MembershipNotFound</code> when it does not exist.
			</p>

			<H3 id="list-query-and-search">
				List, query and search
			</H3>
			<p>
				<code>GET /memberships</code>, <code>POST /memberships/_query</code> and <code>GET /memberships/search?keyword=</code> work as described in <DocLink to="api-conventions" hash="listing-resources">API Conventions</DocLink>.
			</p>

			<H3 id="create-a-membership">
				Create a membership
			</H3>
			<Code language="shell" code={samples.create} />
			<p>
				Generate the secret key with a secure random generator, for example <code>openssl rand -base64 48</code>.
			</p>
			<p>
				<strong>Response <code>201 Created</code></strong>: the membership.
			</p>
			<p>
				The new membership is empty. Create an <code>admin</code> role, a user type and the first users through its endpoints with a token that may access it, or use a separate installation and the <DocLink to="getting-started">setup</DocLink> for a completely new tenant.
			</p>
			<Table
				head={["Error", "When"]}
				rows={[
					[<code>400 ModelValidationError</code>, <>A required field is missing or invalid; <code>data</code> lists every problem</>],
					[<code>409 MembershipAlreadyExists</code>, "The slug is taken"],
				]} />

			<H3 id="update-a-membership">
				Update a membership
			</H3>
			<Code language="http" code={samples.update} />
			<p>
				The body has the same fields as the create request; the id in the route is the one updated, an <code>_id</code> in the body is ignored.
			</p>
			<p>
				These fields keep their current value when they are omitted (or empty, or <code>0</code>): <code>name</code>, <code>secret_key</code>, <code>hash_algorithm</code>, <code>encoding</code>, <code>expires_in</code> and <code>refresh_token_expires_in</code>. <strong>All other fields are replaced by what you send</strong>: omitting <code>mail_providers</code>, <code>otp_settings</code>, <code>code_policy</code>, <code>user_activation</code>, <code>default_language</code>, <code>scoped_token_expires_in</code> or <code>reset_password_token_expires_in</code> clears them. Read the membership first and send it back with your changes.
			</p>
			<Callout type="warning">
				passwords are always verified with the membership&apos;s <strong>current</strong> <code>hash_algorithm</code>, and existing hashes are not converted. Changing the algorithm of a membership that has users makes all their passwords stop working; they would all have to reset their password. Choose the algorithm when you create the membership.
			</Callout>

			<H3 id="delete-a-membership">
				Delete a membership
			</H3>
			<Code language="http" code={samples.remove} />
			<p>
				Answers <code>204 No Content</code>. A membership that still has resources (users, roles, applications…) can&apos;t be deleted: <code>409 MembershipCouldNotDeleted</code>.
			</p>

			<H3 id="settings">
				Settings
			</H3>
			<p>
				<code>GET /memberships/settings</code> returns the values a membership can use, in one response:
			</p>
			<Code language="json" code={samples.settings} />
			<p>
				The individual lists are also available under <code>/memberships/settings/encodings</code>, <code>/hash-algorithms</code> and <code>/db-locales</code>, each with a <code>/default</code> endpoint. <code>defaultHashAlgorithm</code> is the recommended algorithm; a membership has no default and must always name one.
			</p>
		</>
	)
}
