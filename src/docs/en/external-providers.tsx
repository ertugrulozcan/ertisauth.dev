import * as samples from "../samples/external-providers"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function ExternalProviders() {
	return (
		<>
			<p>
				Users can sign in with an account they already have at <strong>Google</strong>, <strong>Apple</strong>, <strong>Facebook</strong> or <strong>Microsoft</strong>. Your client app runs the provider&apos;s own sign-in (its SDK or web flow) and sends the result to ErtisAuth, which verifies it with the provider and returns an ErtisAuth token pair, exactly like a password sign-in.
			</p>
			<Code language="text" title="flow" code={samples.diagram.en} />
			<p>
				On the first sign-in the user is <strong>created</strong>; later sign-ins find the same user again.
			</p>

			<H2 id="supported-providers">
				Supported providers
			</H2>
			<Table
				head={[<code>type</code>, "What the client sends", "How ErtisAuth verifies it"]}
				rows={[
					[<code>Google</code>, "The Google ID token", "Validates the token's signature and audience with Google"],
					[<code>Facebook</code>, "The Facebook access token", "Asks the Facebook Graph API about the token and reads the profile from it"],
					[<><code>Facebook</code> with Limited Login</>, "The Limited Login JWT", "Validates the JWT with Facebook's keys"],
					[<code>Microsoft</code>, "A Microsoft access token for Microsoft Graph", "Reads the profile from Microsoft Graph with the token"],
					[<code>Apple</code>, "The authorization code of Sign in with Apple on the web", "Exchanges the code with Apple and reads the identity from Apple's ID token"],
					[<code>AppleNative</code>, "The authorization code of Sign in with Apple in a native iOS/macOS app", <>Same as <code>Apple</code>, with the app&apos;s bundle id as client id</>],
				]} />
			<p>
				The identity (provider user id, email address) is always taken from the data ErtisAuth gets <strong>from the provider</strong>, never from what the client claims. Names sent by the client are used only where the provider shares them with the client alone (Apple sends the user&apos;s name only once, to the app).
			</p>

			<H2 id="the-provider-object">
				The provider object
			</H2>
			<Code language="json" code={samples.provider} />
			<Table
				head={["Field", "Required", "Description"]}
				rows={[
					[<code>type</code>, "yes", <><code>Google</code>, <code>Facebook</code>, <code>Microsoft</code>, <code>Apple</code> or <code>AppleNative</code>. Can&apos;t be changed later.</>],
					[<code>name</code>, "no", "Display name. The type by default."],
					[<code>slug</code>, "no", <>Unique in the membership; the name by default. <strong>Can&apos;t be changed later</strong>: it is the provider&apos;s login URL (<code>/oauth/{"{slug}"}/login</code>) and is stored in the users&apos; connected accounts.</>],
					[<code>description</code>, "no", ""],
					[<code>isActive</code>, "no", <>Inactive providers reject sign-ins (<code>403 ProviderIsDisable</code>). <code>false</code> by default.</>],
					[<code>defaultRole</code>, "when active", "Role slug given to users created by this provider."],
					[<code>defaultUserType</code>, "when active", "User type slug given to users created by this provider."],
					[<code>appClientId</code>, "when active", <>The client id of your app at the provider: the Google OAuth client id, the Facebook app id, the Microsoft application (client) id, or the Apple Services ID (<code>Apple</code>) / bundle id (<code>AppleNative</code>).</>],
					[<code>tenantId</code>, "no", "Microsoft: your Microsoft Entra tenant id."],
					[<><code>teamId</code>, <code>privateKeyId</code>, <code>privateKey</code></>, "Apple types", <>Your Apple Developer team id, the key id of a <em>Sign in with Apple</em> key, and the key itself (the contents of the <code>.p8</code> file).</>],
					[<code>redirectUri</code>, "Apple types", "The redirect URI registered for your Services ID, the same as the one used by the client."],
					[<code>trust_email</code>, "no", <>See <a href="#linking-to-existing-accounts">Linking accounts</a>. <code>false</code> by default.</>],
				]} />
			<p>
				You can create <strong>several providers of the same type</strong>, for example one Google provider per app with its own client id, each with its own slug.
			</p>
			<p>
				The default user type should allow the fields the provider fills in (<code>firstname</code>, <code>lastname</code>, <code>email_address</code>, <code>username</code>). If it declares an <code>object</code> field named <code>avatar</code>, the provider&apos;s profile picture URL is stored in <code>avatar.url</code>.
			</p>

			<H2 id="signing-in">
				Signing in
			</H2>
			<Code language="http" code={samples.signIn} />
			<Table
				head={["Header", "Required", "Description"]}
				rows={[
					[<code>X-Ertis-Alias</code>, "yes", "The membership id"],
					[<><code>X-IpAddress</code>, <code>X-UserAgent</code></>, "no", <>Stored with the session, as for <DocLink to="authentication" hash="sign-in">password sign-in</DocLink></>],
				]} />
			<p>
				No token is needed. The body depends on the provider&apos;s type.
			</p>

			<H3 id="google">
				Google
			</H3>
			<Code language="json" code={samples.google} />
			<p>
				The ID token must be issued for the provider&apos;s <code>appClientId</code>, and it must contain the user&apos;s email and name: request the <code>openid email profile</code> scopes. A token without them answers <code>401 ProviderProfileIncomplete</code>.
			</p>

			<H3 id="facebook">
				Facebook
			</H3>
			<Code language="json" code={samples.facebook} />
			<p>
				<code>appId</code> must be the provider&apos;s <code>appClientId</code>. <code>id</code>, <code>first_name</code>, <code>email</code> and <code>accessToken</code> are required in the body, but the identity and the email address that ErtisAuth uses are read from Facebook with the access token. For <strong>Facebook Limited Login</strong> (iOS), add <code>?limited_flow=true</code> to the URL and send the Limited Login authentication token as <code>accessToken</code>.
			</p>

			<H3 id="microsoft">
				Microsoft
			</H3>
			<Code language="json" code={samples.microsoft} />
			<p>
				The access token must be valid for Microsoft Graph (<code>User.Read</code>).
			</p>

			<H3 id="apple-and-applenative">
				Apple and AppleNative
			</H3>
			<Code language="json" code={samples.apple} />
			<p>
				This is the response of Sign in with Apple, sent as is. <code>user</code> is only present on the user&apos;s very first sign-in, when Apple shares the name with the app; send it when you have it. ErtisAuth exchanges <code>code</code> with Apple, so a code can be used only once and expires after a few minutes.
			</p>

			<H3 id="response">
				Response
			</H3>
			<p>
				<strong><code>201 Created</code></strong> with an ErtisAuth token pair, as for a <DocLink to="authentication" hash="sign-in">password sign-in</DocLink>.
			</p>

			<H3 id="errors">
				Errors
			</H3>
			<Table
				head={["Status", "Code", "When"]}
				rows={[
					[<code>400</code>, <code>MembershipIdRequired</code>, <><code>X-Ertis-Alias</code> is missing</>],
					[<code>400</code>, <code>InvalidProviderLoginRequest</code>, "The body is not a valid login result for the provider's type"],
					[<code>401</code>, <code>Unauthorized</code>, "The provider did not accept the token or code"],
					[<code>401</code>, <code>ProviderProfileIncomplete</code>, "The provider profile lacks the email address or the name"],
					[<code>401</code>, <code>UserInactive</code>, "The matching user is inactive or frozen"],
					[<code>403</code>, <code>ProviderNotConfigured</code>, "No provider with this slug"],
					[<code>403</code>, <code>ProviderIsDisable</code>, "The provider is not active"],
					[<code>403</code>, <code>UntrustedProvider</code>, "The client id in the request is not the provider's client id"],
					[<code>409</code>, <code>ProviderEmailNotTrusted</code>, "A user with the same email exists, and the email can't be trusted (see below)"],
					[<code>501</code>, <code>ProviderNotConfiguredCorrectly</code>, "The provider configuration is incomplete or wrong (e.g. an unreadable Apple key)"],
					[<code>503</code>, <code>ProviderUnavailable</code>, "The provider could not be reached; try again later"],
				]} />

			<H2 id="how-users-are-matched">
				How users are matched
			</H2>
			<ol>
				<li>
					<strong>By connected account.</strong> Every user keeps the accounts they signed in with in <code>connected_accounts</code>:
					<Code language="json" code={samples.connectedAccounts} />
					A sign-in finds the user whose connected account has the same provider type and provider user id.
				</li>
				<li>
					<strong>By email address.</strong> If no connected account matches, ErtisAuth looks for a user with the same email address in the membership and links the provider account to it, see below.
				</li>
				<li>
					<strong>Sign-up.</strong> If no user matches, a new user is created with the provider&apos;s <code>defaultRole</code> and <code>defaultUserType</code>, the name and email from the provider, the email address as <code>username</code>, and <code>source_provider</code> set to the provider type. It has no password and signs in through the provider.
				</li>
			</ol>
			<p>
				Every sign-in records a <code>TokenGenerated</code> event; a sign-up also records <code>UserCreated</code>.
			</p>

			<H3 id="linking-to-existing-accounts">
				Linking to existing accounts
			</H3>
			<p>
				Linking a provider account to an existing user by email address is only safe if the provider <strong>guarantees</strong> that the user owns that address. Otherwise anyone could create a provider account with someone else&apos;s email address and take over their ErtisAuth account.
			</p>
			<Table
				head={["Provider", "Linked by email"]}
				rows={[
					["Google", "when Google reports the email as verified"],
					["Apple, AppleNative", "when Apple reports the email as verified"],
					["Facebook", <>only when the provider has <code>trust_email: true</code></>],
					["Microsoft", <>only when the provider has <code>trust_email: true</code></>],
				]} />
			<p>
				When an existing user has the same email address and the email can&apos;t be trusted, the sign-in is rejected with <code>409 ProviderEmailNotTrusted</code>. The user can sign in with their password and you can then let them connect the account.
			</p>
			<Callout type="warning">
				set <code>trust_email</code> to <code>true</code> only if you accept that the provider may not have verified the email address. For Microsoft, the <code>mail</code> attribute is managed by the user&apos;s organization and is not verified by Microsoft.
			</Callout>

			<H3 id="account-activation">
				Account activation
			</H3>
			<p>
				When the membership requires <DocLink to="account-recovery" hash="account-activation">activation</DocLink>, users created by a provider sign-up are created inactive like any other user, and they receive the activation mail if the hook is set up.
			</p>

			<H2 id="signing-out">
				Signing out
			</H2>
			<p>
				<DocLink to="authentication" hash="sign-out">Revoking</DocLink> an ErtisAuth token also revokes, where the provider supports it, the provider token that was stored with the user&apos;s connected account.
			</p>

			<H2 id="managing-providers">
				Managing providers
			</H2>
			<p>
				All routes are under <code>/memberships/{"{membershipId}"}</code>.
			</p>
			<Table
				head={["Method", "Route", "Description", "Permission"]}
				rows={[
					[<code>GET</code>, <code>/providers/{"{id}"}</code>, "Get a provider (id or slug)", <code>providers.read.{"{id}"}</code>],
					[<code>GET</code>, <code>/providers</code>, "List the providers of the membership", <code>providers.read</code>],
					[<code>GET</code>, <code>/providers/active-providers</code>, "Public settings of the active providers", "none"],
					[<code>POST</code>, <code>/providers</code>, "Create a provider", <code>providers.create</code>],
					[<code>PUT</code>, <code>/providers/{"{id}"}</code>, "Update a provider", <code>providers.update.{"{id}"}</code>],
					[<code>DELETE</code>, <code>/providers/{"{id}"}</code>, "Delete a provider", <code>providers.delete.{"{id}"}</code>],
				]} />

			<H3 id="active-providers">
				Active providers
			</H3>
			<p>
				<code>GET /memberships/{"{membershipId}"}/providers/active-providers</code> is public, so that sign-in pages can show the right buttons. It returns only the public settings:
			</p>
			<Code language="json" code={samples.activeProviders} />

			<H3 id="create-a-provider">
				Create a provider
			</H3>
			<Code language="shell" code={samples.create} />
			<p>
				<strong>Response <code>201 Created</code></strong>: the provider.
			</p>
			<Table
				head={["Error", "When"]}
				rows={[
					[<><code>400 ProviderTypeRequired</code>, <code>400 UnknownProvider</code>, <code>400 UnsupportedProvider</code></>, <>Missing or unknown <code>type</code></>],
					[<code>400 ModelValidationError</code>, "An active provider misses a required setting"],
					[<code>409 ProviderAlreadyExists</code>, "The slug is taken"],
				]} />

			<H3 id="update-a-provider">
				Update a provider
			</H3>
			<Code language="http" code={samples.update} />
			<p>
				Omitted fields keep their current values. <code>type</code> can&apos;t change, and a different <code>slug</code> answers <code>400 ProviderSlugCannotBeChanged</code>. An update without any change answers <code>409 IdenticalDocumentError</code>.
			</p>

			<H3 id="delete-a-provider">
				Delete a provider
			</H3>
			<Code language="http" code={samples.remove} />
			<p>
				<strong>Response <code>204 No Content</code></strong>. Users created by it keep their accounts.
			</p>

			<H2 id="events">
				Events
			</H2>
			<p>
				<code>ProviderCreated</code>, <code>ProviderUpdated</code> and <code>ProviderDeleted</code>. See <DocLink to="events">Events</DocLink>.
			</p>
		</>
	)
}
