import * as samples from "../samples/configuration"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Configuration() {
	return (
		<>
			<p>
				ErtisAuth reads its settings with the standard ASP.NET Core configuration system: <code>appsettings.json</code>, <code>appsettings.{"{Environment}"}.json</code>, environment variables and command-line arguments, in increasing order of priority.
			</p>
			<p>
				In environment variables, nested keys are separated with a double underscore: <code>Database:ConnectionString</code> becomes <code>Database__ConnectionString</code>.
			</p>
			<p>
				Most of ErtisAuth&apos;s behaviour (token lifetimes, hash algorithm, mail providers, activation, OTP) is not server configuration: it is set <strong>per membership</strong> through the API. See <DocLink to="memberships">Memberships</DocLink>.
			</p>

			<H2 id="settings">
				Settings
			</H2>

			<H3 id="database">
				Database
			</H3>
			<Table>
				<thead>
					<tr>
						<th>
							Key
						</th>
						<th>
							Default
						</th>
						<th>
							Description
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<code>Database:ConnectionString</code>
						</td>
						<td>
							none (required)
						</td>
						<td>
							MongoDB connection string, e.g. <code>mongodb://user:password@host:27017</code>.
						</td>
					</tr>
					<tr>
						<td>
							<code>Database:DefaultAuthDatabase</code>
						</td>
						<td>
							<code>auth</code>
						</td>
						<td>
							Name of the database ErtisAuth uses.
						</td>
					</tr>
					<tr>
						<td>
							<code>Database:AllowDiskUse</code>
						</td>
						<td>
							<code>false</code>
						</td>
						<td>
							Lets MongoDB use temporary files for large sorts and aggregations.
						</td>
					</tr>
				</tbody>
			</Table>
			<p>
				ErtisAuth does not use MongoDB transactions, so a standalone server works as well as a replica set.
			</p>

			<H3 id="azure-application-insights">
				Azure Application Insights
			</H3>
			<Table>
				<thead>
					<tr>
						<th>
							Key
						</th>
						<th>
							Default
						</th>
						<th>
							Description
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<code>ApplicationInsights:ConnectionString</code>
						</td>
						<td>
							empty
						</td>
						<td>
							When set, traces, metrics and logs are exported to Azure Monitor through OpenTelemetry. When empty, nothing is exported.
						</td>
					</tr>
				</tbody>
			</Table>

			<H3 id="logging">
				Logging
			</H3>
			<p>
				The standard <code>Logging</code> section of ASP.NET Core:
			</p>
			<Code language="json" code={samples.logging} />

			<H3 id="hosting">
				Hosting
			</H3>
			<p>
				Standard ASP.NET Core settings apply, for example:
			</p>
			<Table>
				<thead>
					<tr>
						<th>
							Variable
						</th>
						<th>
							Description
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<code>ASPNETCORE_ENVIRONMENT</code>
						</td>
						<td>
							<code>Development</code> enables the OpenAPI document and the Scalar API reference at <code>/docs</code>.
						</td>
					</tr>
					<tr>
						<td>
							<code>ASPNETCORE_HTTP_PORTS</code> / <code>ASPNETCORE_URLS</code>
						</td>
						<td>
							The ports or URLs the server listens on. The Docker image listens on <code>8080</code>.
						</td>
					</tr>
				</tbody>
			</Table>

			<H2 id="example">
				Example
			</H2>
			<Code language="json" code={samples.example} />
			<p>
				The same with environment variables:
			</p>
			<Code language="shell" code={samples.environment} />
			<Callout>
				keep connection strings and keys out of source control. Use environment variables or your platform&apos;s secret store.
			</Callout>

			<H2 id="built-in-behaviour">
				Built-in behaviour
			</H2>
			<p>
				These are fixed in the server and are listed here so that you know what to expect:
			</p>
			<Table>
				<thead>
					<tr>
						<th>
							Behaviour
						</th>
						<th>
							Value
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							CORS
						</td>
						<td>
							Any origin, method and header is allowed. Restrict it at your gateway if you need to.
						</td>
					</tr>
					<tr>
						<td>
							Response compression
						</td>
						<td>
							Brotli and Gzip, also over HTTPS.
						</td>
					</tr>
					<tr>
						<td>
							HTTPS redirection
						</td>
						<td>
							Enabled. Terminate TLS at your ingress or configure a certificate for Kestrel.
						</td>
					</tr>
					<tr>
						<td>
							Graceful shutdown
						</td>
						<td>
							Up to 30 seconds for in-flight requests and queued webhooks and mails.
						</td>
					</tr>
					<tr>
						<td>
							Prometheus metrics
						</td>
						<td>
							Exposed at <code>/metrics</code> (see <DocLink to="operations" hash="metrics">Operations</DocLink>).
						</td>
					</tr>
					<tr>
						<td>
							Activation token lifetime
						</td>
						<td>
							72 hours.
						</td>
					</tr>
					<tr>
						<td>
							Reset password token lifetime
						</td>
						<td>
							2 hours, unless the membership sets <code>reset_password_token_expires_in</code>.
						</td>
					</tr>
					<tr>
						<td>
							Scoped token lifetime
						</td>
						<td>
							12 hours, unless the membership sets <code>scoped_token_expires_in</code>.
						</td>
					</tr>
					<tr>
						<td>
							Minimum password length
						</td>
						<td>
							6 characters.
						</td>
					</tr>
				</tbody>
			</Table>
		</>
	)
}
