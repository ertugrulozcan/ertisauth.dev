import * as samples from "../samples/api-conventions"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function ApiConventions() {
	return (
		<>
			<p>
				The conventions on this page apply to every endpoint of the ErtisAuth API.
			</p>

			<H2 id="base-url-and-routes">
				Base URL and routes
			</H2>
			<p>
				All examples in this documentation use <code>https://auth.example.com</code> as the base URL. ErtisAuth serves its routes from the root of the host; if you publish it under a path prefix (for example <code>/api/v1</code> behind a gateway), add that prefix to every route.
			</p>
			<p>
				Routes fall into three groups:
			</p>
			<Table
				head={["Group", "Routes", "Membership given by"]}
				rows={[
					[
						"Membership-bounded resources",
						<><code>/memberships/{"{membershipId}"}/users</code>, <code>/roles</code>, <code>/applications</code>, <code>/user-types</code>, <code>/providers</code>, <code>/webhooks</code>, <code>/mailhooks</code>, <code>/events</code>, <code>/code-policies</code>, <code>/codes</code>, <code>/active-tokens</code>, <code>/revoked-tokens</code></>,
						"the route",
					],
					[
						"Token endpoints",
						<><code>/generate-token</code>, <code>/refresh-token</code>, <code>/verify-token</code>, <code>/revoke-token</code>, <code>/me</code>, <code>/whoami</code>, <code>/verify-otp</code>, <code>/oauth/{"{slug}"}/login</code></>,
						<>the <code>X-Ertis-Alias</code> header (only where a membership is needed)</>,
					],
					[
						"Installation-wide",
						<><code>/memberships</code>, <code>/setup</code>, <code>/healthcheck</code>, <code>/ping</code></>,
						"not bound to a membership",
					],
				]} />

			<H3 id="membership-isolation">
				Membership isolation
			</H3>
			<p>
				A request to a membership-bounded route must be made with a token of <strong>that same membership</strong>. A valid token of another membership is rejected with <code>403 AccessDenied</code>, whatever its permissions are.
			</p>

			<H2 id="headers">
				Headers
			</H2>
			<Table
				head={["Header", "Used by", "Description"]}
				rows={[
					[<code>Authorization</code>, "almost all endpoints", <><code>Bearer &lt;access_token&gt;</code> for users, <code>Basic &lt;application_id&gt;:&lt;secret&gt;</code> for applications. The scheme is case-insensitive.</>],
					[<code>X-Ertis-Alias</code>, "sign-in endpoints", <>The membership id. <code>Membership</code> and <code>MembershipId</code> are accepted as alternative header names.</>],
					[<code>X-IpAddress</code>, "sign-in endpoints", "Optional. The end user's IP address, stored with the session (useful when the request comes from your backend)."],
					[<code>X-UserAgent</code>, "sign-in endpoints", "Optional. The end user's user agent, stored with the session."],
					[<code>X-Host</code>, "activation, password reset, OTP", <>The base URL of the page that the links in the mails point to (see <DocLink to="account-recovery">Account Recovery</DocLink>).</>],
					[<code>X-Setup-Token</code>, <code>/setup</code>, <>The setup token (see <DocLink to="getting-started" hash="3-set-up-the-installation">Getting Started</DocLink>).</>],
					[<code>Content-Type</code>, "requests with a body", <code>application/json</code>],
				]} />

			<H2 id="request-and-response-bodies">
				Request and response bodies
			</H2>
			<ul>
				<li>
					Bodies are JSON. Field names are <code>snake_case</code> for most resources (<code>email_address</code>, <code>expires_in</code>); providers, mail hooks and the flags of user types use <code>camelCase</code> (<code>defaultRole</code>, <code>mailSubject</code>, <code>isAbstract</code>). Each reference page shows the exact names.
				</li>
				<li>
					Dates are ISO 8601 strings in UTC.
				</li>
				<li>
					Responses are compressed with Brotli or Gzip when the client accepts it.
				</li>
			</ul>

			<H2 id="status-codes">
				Status codes
			</H2>
			<Table
				head={["Code", "Meaning in ErtisAuth"]}
				rows={[
					[<code>200 OK</code>, "Success with a body. Also returned by a partially successful bulk delete (see below)."],
					[<code>201 Created</code>, <>A resource or a token was created. Tokens are always returned with <code>201</code>.</>],
					[<code>204 No Content</code>, "Success without a body (deletes, sign-out)."],
					[<code>400 Bad Request</code>, "The request is malformed or fails validation."],
					[<code>401 Unauthorized</code>, <>The token is missing, invalid, expired or revoked, or the credentials are wrong. Comes with a <code>WWW-Authenticate</code> header.</>],
					[<code>403 Forbidden</code>, "The caller is authenticated but not allowed: missing permission, other membership, or a disabled provider."],
					[<code>404 Not Found</code>, "The resource does not exist in this membership."],
					[<code>409 Conflict</code>, "A duplicate (same slug, same username…), an update without changes, a resource still in use, or a setup already done."],
					[<code>500 Internal Server Error</code>, "An unexpected error. The details are only written to the server log."],
					[<code>501 Not Implemented</code>, "A feature the request needs is not configured, e.g. no mail provider or no activation mail hook."],
					[<code>503 Service Unavailable</code>, "An external provider (Google, Apple…) could not be reached."],
				]} />

			<H2 id="errors">
				Errors
			</H2>
			<p>
				Errors have a common shape:
			</p>
			<Code language="json" code={samples.error} />
			<p>
				Use <code>errorCode</code> in your code; <code>message</code> is meant for people and may change. All codes are listed in <DocLink to="error-codes">Error Codes</DocLink>.
			</p>
			<p>
				Validation errors carry the list of problems in <code>data</code>:
			</p>
			<Code language="json" code={samples.modelValidationError} />
			<p>
				Errors of a user&apos;s custom fields, validated by the <DocLink to="user-types">user type</DocLink> schema, name the field:
			</p>
			<Code language="json" code={samples.fieldValidationError} />
			<p>
				When several fields are invalid at once, all of them are reported:
			</p>
			<Code language="json" code={samples.validationErrors} />
			<p>
				An id that is not a valid ObjectId answers <code>400 ParameterFormatError</code>.
			</p>

			<H2 id="listing-resources">
				Listing resources
			</H2>
			<p>
				List endpoints (<code>GET /memberships/{"{membershipId}"}/users</code> and the like) are paginated and sortable with query parameters:
			</p>
			<Table
				head={["Parameter", "Example", "Description"]}
				rows={[
					[<code>skip</code>, <code>skip=20</code>, "Number of items to skip. Must not be negative."],
					[<code>limit</code>, <code>limit=10</code>, "Maximum number of items to return. Must not be negative."],
					[<code>with_count</code>, <code>with_count=true</code>, <>Also return the total number of matching items in <code>count</code>.</>],
					[<code>sort</code>, <><code>sort=username</code> or <code>sort=sys.created_at desc</code></>, <>Field to sort by, optionally followed by <code>asc</code> (default) or <code>desc</code>.</>],
				]} />
			<Code language="shell" code={samples.list} />
			<Code language="json" code={samples.listResponse} />
			<p>
				Without <code>with_count=true</code>, <code>count</code> is not computed.
			</p>

			<H2 id="querying-resources">
				Querying resources
			</H2>
			<p>
				Most resources have a <code>POST …/_query</code> endpoint that takes a <a href="https://www.mongodb.com/docs/manual/tutorial/query-documents/">MongoDB query</a> in <code>where</code>, and an optional projection in <code>select</code>:
			</p>
			<Code language="shell" code={samples.query} />
			<ul>
				<li>
					The pagination and sorting parameters of the list endpoints apply.
				</li>
				<li>
					<code>select</code> includes fields with <code>1</code> or <code>true</code> and excludes them with <code>0</code> or <code>false</code>.
				</li>
				<li>
					The membership filter is always added by the server: a query can never read another membership&apos;s data.
				</li>
				<li>
					JavaScript operators (<code>$where</code>, <code>$function</code>, <code>$accumulator</code>) are rejected with <code>400 InvalidQuery</code>.
				</li>
				<li>
					Hidden fields, such as <code>password_hash</code>, can be neither returned nor used in filters or sorting.
				</li>
				<li>
					For users, the optional <code>locale</code> query parameter (e.g. <code>locale=tr</code>) sets the collation of the sorting, so that names sort correctly in that language.
				</li>
			</ul>

			<H3 id="aggregation">
				Aggregation
			</H3>
			<p>
				Active tokens also support <code>POST …/active-tokens/_aggregate</code>, which takes a JSON array of <a href="https://www.mongodb.com/docs/manual/core/aggregation-pipeline/">aggregation pipeline</a> stages. The membership filter is added as the first stage by the server.
			</p>
			<p>
				Only stages that transform the documents flowing through the pipeline are allowed: <code>$match</code>, <code>$project</code>, <code>$addFields</code>, <code>$set</code>, <code>$unset</code>, <code>$group</code>, <code>$sort</code>, <code>$limit</code>, <code>$skip</code>, <code>$count</code>, <code>$unwind</code>, <code>$bucket</code>, <code>$bucketAuto</code>, <code>$sortByCount</code>, <code>$replaceRoot</code>, <code>$replaceWith</code>, <code>$sample</code>, <code>$setWindowFields</code> and <code>$facet</code>. Any other stage, in particular those that read or write other collections (<code>$lookup</code>, <code>$graphLookup</code>, <code>$unionWith</code>, <code>$out</code>, <code>$merge</code>), is rejected with <code>400 UnsupportedAggregationStage</code>.
			</p>
			<Code language="shell" code={samples.aggregate} />

			<H2 id="searching-resources">
				Searching resources
			</H2>
			<p>
				Users, roles, applications and memberships have a full-text search:
			</p>
			<Code language="shell" code={samples.search} />
			<p>
				<code>keyword</code> is required (<code>400 SearchKeywordRequired</code> otherwise). Pagination and sorting work as in the list endpoints.
			</p>

			<H2 id="creating-and-updating">
				Creating and updating
			</H2>
			<ul>
				<li>
					<code>POST</code> creates a resource and answers <code>201 Created</code> with the resource and a <code>Location</code> header.
				</li>
				<li>
					<code>PUT /{"{id}"}</code> updates a resource. The id always comes from the route; an <code>_id</code> in the body is ignored.
				</li>
				<li>
					An update that changes nothing answers <code>409 IdenticalDocumentError</code>. Treat it as a success if your client may send unchanged data.
				</li>
				<li>
					A <code>sys</code> object sent in a body is ignored.
				</li>
			</ul>

			<H2 id="bulk-delete">
				Bulk delete
			</H2>
			<p>
				Users, roles, applications, webhooks, mail hooks and code policies can be deleted in bulk with <code>DELETE</code> on the collection route and a JSON array of ids as the body:
			</p>
			<Code language="shell" code={samples.bulkDelete} />
			<Table
				head={["Result", "Response"]}
				rows={[
					["All deleted", <code>204 No Content</code>],
					["None deleted", <code>404 BulkDeleteFailed</code>],
					["Some deleted", <><code>200 OK</code> with the error body <code>BulkDeletePartial</code></>],
				]} />
			<Callout>
				a partial bulk delete answers <code>200</code> with an error body. Check <code>errorCode</code> before you treat a <code>200</code> as a full success.
			</Callout>
		</>
	)
}
