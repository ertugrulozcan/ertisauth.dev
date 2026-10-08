import * as samples from "../samples/operations"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Operations() {
	return (
		<>
			<p>
				This page covers running ErtisAuth in production: health checks, monitoring, scaling, data maintenance and a security checklist.
			</p>

			<H2 id="health-checks">
				Health checks
			</H2>

			<H3 id="get-healthcheck">
				<code>GET /healthcheck</code>
			</H3>
			<p>
				Checks the database connection and whether the installation is set up. Anonymous.
			</p>
			<Table
				head={["Situation", "Status", "Body"]}
				rows={[
					["Database reachable, installation set up", <code>200</code>, <code>{"{ \"status\": \"Healthy\" }"}</code>],
					["Database reachable, not set up yet", <code>200</code>, <code>{"{ \"status\": \"Unhealthy\", \"message\": \"ErtisAuth has not been set up yet\" }"}</code>],
					["Database unreachable", <code>500</code>, <code>{"{ \"status\": \"Unhealthy\", \"message\": \"Health check failed\" }"}</code>],
				]} />
			<p>
				The details of a database failure are only written to the log.
			</p>
			<Callout>
				a fresh installation answers <code>200</code> even though it is <code>Unhealthy</code>. If your orchestrator only looks at the status code, it will treat a not-yet-set-up instance as healthy, which is what you want while you run the setup.
			</Callout>

			<H3 id="get-ping">
				<code>GET /ping</code>
			</H3>
			<p>
				Answers <code>&quot;Pong&quot;</code> without touching the database. Use it as a liveness probe, and <code>/healthcheck</code> as a readiness probe.
			</p>
			<Code language="yaml" code={samples.probes} />

			<H2 id="metrics">
				Metrics
			</H2>
			<p>
				Prometheus metrics are exposed at <strong><code>/metrics</code></strong>:
			</p>
			<ul>
				<li>
					incoming HTTP requests: counts, durations and in-progress requests per endpoint and status code,
				</li>
				<li>
					outgoing HTTP calls (to providers, webhook receivers, mail APIs),
				</li>
				<li>
					the .NET runtime: memory, garbage collection, thread pool.
				</li>
			</ul>
			<p>
				<code>/metrics</code> is not authenticated. Don&apos;t expose it publicly: scrape it from inside your network, or block it at your ingress.
			</p>

			<H2 id="logging-and-tracing">
				Logging and tracing
			</H2>
			<p>
				ErtisAuth logs through the standard ASP.NET Core logging (console by default). Unexpected errors are logged with their stack trace, and the client only receives <code>500 UnhandledExceptionError</code>.
			</p>
			<p>
				When <code>ApplicationInsights:ConnectionString</code> is set, traces, metrics and logs are exported to <strong>Azure Monitor</strong> through OpenTelemetry (see <DocLink to="configuration" hash="azure-application-insights">Configuration</DocLink>).
			</p>

			<H2 id="api-reference">
				API reference
			</H2>
			<p>
				In the <code>Development</code> environment ErtisAuth serves its OpenAPI document at <code>/openapi/v1.json</code> and an interactive <a href="https://scalar.com">Scalar</a> reference at <strong><code>/docs</code></strong>. Both are disabled in other environments.
			</p>

			<H2 id="scaling">
				Scaling
			</H2>
			<p>
				ErtisAuth is stateless apart from its database, so you can run several instances behind a load balancer.
			</p>

			<H3 id="caching">
				Caching
			</H3>
			<p>
				Each instance keeps an in-memory cache of the resources it reads most often:
			</p>
			<Table
				head={["Resource", "Cached for up to"]}
				rows={[
					["Memberships", "1 hour"],
					["User types", "1 hour"],
					["Providers", "1 hour"],
					["Roles", "5 minutes"],
					["Applications", "5 minutes"],
					["Revoked tokens (positive lookups only)", "24 hours"],
				]} />
			<p>
				A change is visible immediately on the instance that made it. <strong>Other instances see it when their cached copy expires.</strong> In practice:
			</p>
			<ul>
				<li>
					a role change takes up to 5 minutes to apply everywhere;
				</li>
				<li>
					a membership change (token lifetimes, mail providers, OTP settings…) takes up to 1 hour;
				</li>
				<li>
					revocations are seen everywhere immediately, since only revoked tokens are cached.
				</li>
			</ul>
			<p>
				Restart the instances if a change must apply at once.
			</p>

			<H3 id="background-work">
				Background work
			</H3>
			<p>
				Webhooks and mail hooks are processed from in-memory queues on the instance where the event occurred:
			</p>
			<Table
				head={["Queue", "Capacity", "Parallel calls"]}
				rows={[
					["Webhooks", "10,000", "8"],
					["Mails", "10,000", "4"],
				]} />
			<p>
				When a queue is full, new items are dropped and logged. On shutdown the queues are drained for up to 30 seconds; items still queued after that are lost. Give your pods a termination grace period of at least 30 seconds.
			</p>

			<H2 id="database">
				Database
			</H2>

			<H3 id="indexes">
				Indexes
			</H3>
			<p>
				ErtisAuth creates the indexes it needs at startup, including:
			</p>
			<ul>
				<li>
					unique indexes for the <DocLink to="user-types" hash="unique-fields">unique fields</DocLink> of user types, kept in sync whenever a user type changes (and checked again at startup);
				</li>
				<li>
					text indexes for search;
				</li>
				<li>
					<strong>TTL indexes</strong> that delete expired data automatically: active tokens, revoked tokens, token codes and one-time passwords are removed a few minutes after they expire.
				</li>
			</ul>

			<H3 id="retention">
				Retention
			</H3>
			<p>
				The <code>events</code> collection is <strong>not</strong> cleaned up automatically and grows with every sign-in and change. Decide how long you need the audit log and remove older events regularly, for example with a TTL index of your own on <code>event_time</code>:
			</p>
			<Code language="javascript" code={samples.eventsTtl} />

			<H3 id="backups">
				Backups
			</H3>
			<p>
				Everything ErtisAuth knows is in its MongoDB database. Back it up like any production database, and protect the backups: they contain password hashes, membership secret keys, provider keys and mail provider credentials.
			</p>

			<H2 id="security-checklist">
				Security checklist
			</H2>
			<ul>
				<li>
					Serve ErtisAuth over <strong>HTTPS</strong> only. Basic tokens and passwords travel in plain text inside the TLS connection.
				</li>
				<li>
					Use a long random <code>secret_key</code> per membership (<code>openssl rand -base64 48</code>), and keep it secret.
				</li>
				<li>
					Use <code>ARGON2ID</code> as the hash algorithm for new memberships.
				</li>
				<li>
					Keep <code>Database:ConnectionString</code> and other secrets out of source control.
				</li>
				<li>
					Grant the sensitive read permissions only to operators:
					<ul>
						<li>
							<code>memberships.read</code> discloses secret keys and mail credentials,
						</li>
						<li>
							<code>tokens.read</code> discloses live tokens,
						</li>
						<li>
							<code>events.read</code> discloses user data.
						</li>
					</ul>
				</li>
				<li>
					Give each application its own role with only what it needs, and rotate application secrets regularly.
				</li>
				<li>
					<strong>Rate-limit</strong> the public endpoints at your gateway: <code>/generate-token</code>, <code>/verify-otp</code>, <code>/oauth/{"{slug}"}/login</code>, <code>/memberships/{"{m}"}/codes</code> and <code>/memberships/{"{m}"}/codes/token</code>. ErtisAuth doesn&apos;t limit request rates itself.
				</li>
				<li>
					Restrict CORS at your gateway if your clients are only on known origins (ErtisAuth allows any origin).
				</li>
				<li>
					Don&apos;t log query strings of <code>/users/check-password</code> (it carries a password).
				</li>
				<li>
					Block <code>/metrics</code> from the internet.
				</li>
				<li>
					Set <code>trust_email</code> on providers only when you have checked what it means (see <DocLink to="external-providers" hash="linking-to-existing-accounts">External Identity Providers</DocLink>).
				</li>
				<li>
					Plan the retention of the <code>events</code> collection.
				</li>
			</ul>
		</>
	)
}
