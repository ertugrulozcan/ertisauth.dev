import * as samples from "../samples/getting-started"
import { Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function GettingStarted() {
	return (
		<>
			<p>
				This guide takes you from an empty machine to a running ErtisAuth instance with a membership, an administrator and a first token. It takes about ten minutes.
			</p>

			<H2 id="1-requirements">
				1. Requirements
			</H2>
			<ul>
				<li>
					<a href="https://dotnet.microsoft.com/download">.NET 10 SDK</a> (to build from source), or Docker
				</li>
				<li>
					<a href="https://www.mongodb.com/">MongoDB</a> 7.0 or later. A standalone server is enough; a replica set is not required.
				</li>
			</ul>

			<H2 id="2-run-ertisauth">
				2. Run ErtisAuth
			</H2>

			<H3 id="from-source">
				From source
			</H3>
			<Code language="shell" code={samples.fromSource} />
			<p>
				In the development environment the API listens on <code>http://localhost:9716</code>, and the interactive API reference is at <code>http://localhost:9716/docs</code>.
			</p>

			<H3 id="with-docker-compose">
				With Docker Compose
			</H3>
			<p>
				The repository contains a <code>docker-compose.yml</code> that starts ErtisAuth together with a MongoDB:
			</p>
			<Code language="shell" code={samples.dockerCompose} />
			<p>
				The API listens on <code>http://localhost:9716</code> and the API reference is at <code>http://localhost:9716/docs</code>. The MongoDB data is kept in the <code>mongo-data</code> volume.
			</p>

			<H3 id="with-docker">
				With Docker
			</H3>
			<p>
				Build the image and run it with a MongoDB of your own:
			</p>
			<Code language="shell" code={samples.docker} />
			<p>
				The container listens on port <strong>8080</strong> and runs as the non-root <code>app</code> user of the .NET images. It is based on the Debian image of ASP.NET Core, which includes ICU and the time zone database, so culture and time zone handling work as on a development machine.
			</p>
			<p>
				ErtisAuth stores its data in the database named by <code>Database:DefaultAuthDatabase</code> (<code>auth</code> by default). See <DocLink to="configuration">Configuration</DocLink> for all settings.
			</p>
			<p>
				On startup ErtisAuth creates the indexes it needs. Check that it is up:
			</p>
			<Code language="shell" code={samples.healthCheck} />
			<Code language="json" code={samples.healthCheckResponse} />
			<p>
				<code>Unhealthy</code> with this message is expected at this point: the server is running, but it has no membership yet.
			</p>

			<H2 id="3-set-up-the-installation">
				3. Set up the installation
			</H2>
			<p>
				A fresh installation has no users, so nobody can sign in to create the first ones. The <strong>setup endpoint</strong> solves this: it creates the first resources in one call, and it is authorized by a token that you put into the database yourself. Having write access to the database proves that you are the operator of the installation.
			</p>

			<H3 id="31-insert-a-setup-token">
				3.1 Insert a setup token
			</H3>
			<p>
				Generate a random token of at least 32 characters:
			</p>
			<Code language="shell" code={samples.setupToken} />
			<p>
				Insert it into the <code>setup</code> collection of the ErtisAuth database (with <code>mongosh</code>):
			</p>
			<Code language="javascript" code={samples.insertSetupToken} />
			<p>
				With Docker Compose, run it in the MongoDB container:
			</p>
			<Code language="shell" code={samples.insertSetupTokenCompose} />

			<H3 id="32-call-the-setup-endpoint">
				3.2 Call the setup endpoint
			</H3>
			<Code language="shell" code={samples.setup} />
			<Table>
				<thead>
					<tr>
						<th>
							Field
						</th>
						<th>
							Required
						</th>
						<th>
							Description
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<code>membership.name</code>
						</td>
						<td>
							yes
						</td>
						<td>
							Display name of the membership.
						</td>
					</tr>
					<tr>
						<td>
							<code>membership.slug</code>
						</td>
						<td>
							no
						</td>
						<td>
							URL-friendly name; derived from the name when omitted.
						</td>
					</tr>
					<tr>
						<td>
							<code>membership.expires_in</code>
						</td>
						<td>
							yes
						</td>
						<td>
							Access token lifetime in seconds.
						</td>
					</tr>
					<tr>
						<td>
							<code>membership.refresh_token_expires_in</code>
						</td>
						<td>
							yes
						</td>
						<td>
							Refresh token lifetime in seconds.
						</td>
					</tr>
					<tr>
						<td>
							<code>membership.hash_algorithm</code>
						</td>
						<td>
							yes
						</td>
						<td>
							Password hash algorithm. <code>ARGON2ID</code> is recommended (see <DocLink to="memberships" hash="password-hash-algorithms">Memberships</DocLink>).
						</td>
					</tr>
					<tr>
						<td>
							<code>membership.encoding</code>
						</td>
						<td>
							no
						</td>
						<td>
							Text encoding used for hashing and signing (<code>UTF-8</code> by default).
						</td>
					</tr>
					<tr>
						<td>
							<code>membership.secret_key</code>
						</td>
						<td>
							no
						</td>
						<td>
							The key tokens are signed with, at least 32 bytes. A random key is generated when omitted.
						</td>
					</tr>
					<tr>
						<td>
							<code>user.*</code>
						</td>
						<td>
							yes
						</td>
						<td>
							The administrator user. <code>firstname</code>, <code>username</code>, <code>email_address</code> and <code>password</code> (at least 6 characters) are required.
						</td>
					</tr>
					<tr>
						<td>
							<code>user.user_type</code>
						</td>
						<td>
							no
						</td>
						<td>
							Name of the user type created for the administrator (<code>User</code> by default).
						</td>
					</tr>
					<tr>
						<td>
							<code>application</code>
						</td>
						<td>
							no
						</td>
						<td>
							An application for machine-to-machine access, typically with the <code>admin</code> role.
						</td>
					</tr>
				</tbody>
			</Table>
			<p>
				The setup creates, in this order:
			</p>
			<ol>
				<li>
					the <strong>membership</strong>,
				</li>
				<li>
					the <strong><code>admin</code> role</strong>, which has every permission on every ErtisAuth resource,
				</li>
				<li>
					a <strong>user type</strong> inheriting from the built-in <code>base-user</code> type,
				</li>
				<li>
					the <strong>administrator user</strong>, already active, with the <code>admin</code> role,
				</li>
				<li>
					the <strong>application</strong>, if requested.
				</li>
			</ol>
			<p>
				If any step fails, the resources created before it are removed, so a failed setup can simply be retried.
			</p>

			<H3 id="33-keep-the-response">
				3.3 Keep the response
			</H3>
			<Code language="json" code={samples.setupResponse} />
			<p>
				Write down:
			</p>
			<ul>
				<li>
					<strong><code>membership._id</code></strong>: you will send it with every sign-in request.
				</li>
				<li>
					<strong><code>application.secret</code></strong>: it is returned only once. ErtisAuth stores only its hash; if you lose it, <DocLink to="applications" hash="rotate-the-secret">rotate it</DocLink>.
				</li>
			</ul>
			<p>
				When the setup succeeds, the <code>setup</code> collection is dropped and the endpoint is closed for good: further calls answer <code>409 AlreadySetUp</code>. The health check now answers <code>Healthy</code>.
			</p>

			<H2 id="4-sign-in">
				4. Sign in
			</H2>
			<Code language="shell" code={samples.signIn} />
			<Code language="json" code={samples.signInResponse} />
			<p>
				<code>username</code> also accepts the email address.
			</p>

			<H2 id="5-call-the-api">
				5. Call the API
			</H2>
			<Code language="shell" code={samples.me} />
			<Code language="shell" code={samples.listUsers} />
			<p>
				The application can call the same endpoints with a Basic token made of its id and secret:
			</p>
			<Code language="shell" code={samples.basicToken} />

			<H2 id="next-steps">
				Next steps
			</H2>
			<ul>
				<li>
					Design your user model with <DocLink to="user-types">User Types</DocLink>.
				</li>
				<li>
					Create roles for your users in <DocLink to="roles">Roles</DocLink> and learn the <DocLink to="authorization">permission model</DocLink>.
				</li>
				<li>
					Configure activation and password reset mails with <DocLink to="mail-hooks">Mail Hooks</DocLink> and <DocLink to="account-recovery">Account Recovery</DocLink>.
				</li>
				<li>
					Protect your own services with the <DocLink to="sdk">.NET SDK</DocLink>.
				</li>
			</ul>
		</>
	)
}
