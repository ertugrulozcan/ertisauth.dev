import * as samples from "../samples/user-types"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function UserTypes() {
	return (
		<>
			<p>
				A user type is the <strong>schema</strong> of a kind of user. It declares the fields that users of that type have, beyond the standard ones, together with their types and validation rules. Every user create and update is validated against the schema of the user&apos;s type.
			</p>
			<p>
				With user types you can, without changing any code:
			</p>
			<ul>
				<li>
					add custom fields (a phone number, a birth date, a list of addresses, a loyalty tier…),
				</li>
				<li>
					make fields required, unique, or limited to a set of values,
				</li>
				<li>
					build a hierarchy of types (<em>Customer</em> and <em>Employee</em> both extending <em>Person</em>),
				</li>
				<li>
					let a back office generate forms from the schema.
				</li>
			</ul>

			<H2 id="inheritance">
				Inheritance
			</H2>
			<p>
				User types inherit from each other through <code>baseType</code>. Every chain ends in the built-in <strong><code>base-user</code></strong> type, which declares the standard fields of all users:
			</p>
			<Table
				head={["Field", "Type", "Rules"]}
				rows={[
					[<code>firstname</code>, <code>string</code>, "required"],
					[<code>lastname</code>, <code>string</code>, ""],
					[<code>username</code>, <code>string</code>, "required, unique per membership"],
					[<code>email_address</code>, <code>email</code>, "required, unique per membership"],
					[<code>role</code>, <code>string</code>, "required"],
					[<code>permissions</code>, <><code>array</code> of <code>string</code></>, "unique items"],
					[<code>forbidden</code>, <><code>array</code> of <code>string</code></>, "unique items"],
					[<code>user_type</code>, <code>string</code>, "required"],
					[<code>source_provider</code>, <code>string</code>, "read-only"],
					[<code>connected_accounts</code>, <><code>array</code> of objects</>, "read-only"],
					[<code>is_active</code>, <code>boolean</code>, "read-only"],
					[<code>membership_id</code>, <code>string</code>, "read-only"],
					[<code>sys</code>, <code>object</code>, "managed by the server"],
				]} />
			<p>
				<code>base-user</code> is <strong>abstract</strong>: no user can have it as their type, you always create your own types. It is not stored in the database and is not returned by the list endpoint, but <code>GET /user-types/all</code> and <code>GET /user-types/base-user</code> include it.
			</p>
			<Code language="text" title="hierarchy" code={samples.hierarchy} />
			<p>
				A type has all the fields of its ancestors plus its own.
			</p>
			<Table
				head={["Flag", "Meaning"]}
				rows={[
					[<code>isAbstract</code>, "No user can have this type; it only serves as a base for other types."],
					[<code>isSealed</code>, "No other type can inherit from this type."],
				]} />
			<p>
				A type can&apos;t be both abstract and sealed, and a chain can&apos;t loop back on itself.
			</p>

			<H2 id="the-user-type-object">
				The user type object
			</H2>
			<Code language="json" code={samples.userType} />
			<Table
				head={["Field", "Required", "Description"]}
				rows={[
					[<code>name</code>, "yes", <>Display name. <code>Base User</code> is reserved.</>],
					[<code>slug</code>, "no", <>Derived from the name when omitted. <code>base-user</code> is reserved. Users refer to their type by this slug.</>],
					[<code>description</code>, "no", ""],
					[<code>baseType</code>, "no", <>Slug or name of the base type; stored as the slug. <code>base-user</code> when omitted.</>],
					[<><code>isAbstract</code>, <code>isSealed</code></>, "no", <>See <a href="#inheritance">Inheritance</a>. <code>false</code> by default.</>],
					[<code>allowAdditionalProperties</code>, "no", <>When <code>true</code>, users may have fields that the schema does not declare. <code>false</code> by default: undeclared fields are rejected.</>],
					[<code>properties</code>, "yes", "The fields declared by this type, as an object keyed by field name. Inherited fields are not repeated."],
				]} />

			<H2 id="fields">
				Fields
			</H2>
			<p>
				Each entry of <code>properties</code> describes one field. The key is the field name as it appears on users.
			</p>

			<H3 id="common-options">
				Common options
			</H3>
			<Table
				head={["Option", "Type", "Description"]}
				rows={[
					[<code>type</code>, "string", "The field type (see below). Required."],
					[<code>displayName</code>, "string", "Human-readable name, for forms."],
					[<code>description</code>, "string", "Help text, for forms."],
					[<code>isRequired</code>, "boolean", "The field must have a value. For strings, whitespace-only values count as empty."],
					[<code>defaultValue</code>, "any", "Value used when the field is not given on creation."],
					[<code>isUnique</code>, "boolean", <>No two users may share a value (see <a href="#unique-fields">Unique fields</a>). Available on <code>string</code>, <code>integer</code>, <code>float</code>, <code>boolean</code>, <code>enum</code> and the string-based types.</>],
					[<code>isVirtual</code>, "boolean", <>Lets a derived type redeclare the field (see <a href="#redeclaring-inherited-fields">Redeclaring inherited fields</a>).</>],
					[<><code>isHidden</code>, <code>isReadonly</code></>, "boolean", <>Hints for user interfaces. A hidden field that is required must have a <code>defaultValue</code>.</>],
					[<code>appearance</code>, "string", "Hint for user interfaces (how to render the field)."],
					[<><code>isSearchable</code>, <code>searchWeight</code></>, "boolean, number", "Hints for search interfaces."],
				]} />
			<Callout>
				<code>isHidden</code>, <code>isReadonly</code>, <code>appearance</code>, <code>isSearchable</code> and <code>searchWeight</code> are stored and returned for user interfaces such as a back office; the API does not enforce them on your own fields.
			</Callout>

			<H3 id="field-types">
				Field types
			</H3>
			<p>
				<strong>Primitive types</strong>
			</p>
			<Table
				head={["Type", "Value", "Options"]}
				rows={[
					[<code>string</code>, "text", <><code>minLength</code>, <code>maxLength</code>, <code>regexPattern</code> (the value must match), <code>restrictRegexPattern</code> (the value must not match), <code>formatPattern</code>, <code>caseInsensitive</code></>],
					[<code>integer</code>, "whole number", <><code>minimum</code>, <code>maximum</code> (inclusive), <code>exclusiveMinimum</code>, <code>exclusiveMaximum</code>, <code>multipleOf</code></>],
					[<code>float</code>, "number", <><code>minimum</code>, <code>maximum</code>, <code>exclusiveMinimum</code>, <code>exclusiveMaximum</code></>],
					[<code>boolean</code>, <><code>true</code> / <code>false</code></>, ""],
					[<code>enum</code>, <>one of the <code>items</code></>, <><code>items</code> (required, unique, <code>{"{ \"displayName\", \"value\" }"}</code>), <code>isMultiple</code> (the value is an array of item values)</>],
					[<code>const</code>, "a fixed value", <><code>value</code>, <code>valueType</code></>],
					[<code>object</code>, "nested object", <><code>properties</code> (same format as the type&apos;s properties), <code>allowAdditionalProperties</code></>],
					[<code>array</code>, "list", <><code>itemSchema</code> (a field definition for the items), <code>minCount</code>, <code>maxCount</code>, <code>uniqueItems</code>, <code>uniqueBy</code> (field names that must be unique among object items)</>],
				]} />
			<p>
				<strong>Formatted types</strong>
			</p>
			<Table
				head={["Type", "Value", "Options"]}
				rows={[
					[<code>email</code>, "an email address", "string options"],
					[<code>uri</code>, "an absolute URI", "string options"],
					[<code>hostname</code>, "a host name", "string options"],
					[<code>color</code>, <>a color code, e.g. <code>#1E90FF</code></>, "string options"],
					[<code>date</code>, <code>yyyy-MM-dd</code>, <><code>minValue</code>, <code>maxValue</code></>],
					[<code>datetime</code>, <>ISO 8601 date and time, e.g. <code>2026-01-01T12:00:00Z</code></>, <><code>minValue</code>, <code>maxValue</code></>],
					[<code>longtext</code>, "multi-line text", "string options"],
					[<code>richtext</code>, "HTML text", <><code>minWordCount</code>, <code>maxWordCount</code></>],
					[<code>code</code>, "source code", "string options"],
					[<code>json</code>, "any JSON value", ""],
					[<code>tags</code>, "array of strings", <><code>minCount</code>, <code>maxCount</code>, <code>minLength</code>, <code>maxLength</code> (of each tag)</>],
					[<code>location</code>, <code>{"{ \"latitude\": 41.01, \"longitude\": 28.97 }"}</code>, ""],
					[<><code>image</code>, <code>video</code></>, "media descriptors", <>size and dimension rules (<code>maxSize</code>, <code>minWidth</code>, <code>maxWidth</code>…)</>],
					[<code>reference</code>, "a reference to other users", <><code>referenceType</code> (<code>single</code>, <code>multiple</code> or <code>collection</code>), <code>contentType</code> (the user type slug the referenced users must be of, or inherit from; <code>base-user</code> accepts any user)</>],
				]} />
			<p>
				Date and time values are stored in UTC. A <code>datetime</code> without an offset is read as UTC.
			</p>

			<H3 id="examples">
				Examples
			</H3>
			<p>
				A phone number:
			</p>
			<Code language="json" code={samples.phone} />
			<p>
				A birth date that must be in the past century:
			</p>
			<Code language="json" code={samples.birthDate} />
			<p>
				A list of interests chosen from a set:
			</p>
			<Code language="json" code={samples.interests} />
			<p>
				The manager of an employee, who must be an employee too:
			</p>
			<Code language="json" code={samples.manager} />

			<H3 id="unique-fields">
				Unique fields
			</H3>
			<p>
				When a field is marked <code>isUnique</code>, ErtisAuth creates a MongoDB unique index for it:
			</p>
			<ul>
				<li>
					Uniqueness is checked <strong>within the membership</strong>, among the users of the type that declares the field unique and of the types derived from it.
				</li>
				<li>
					Empty values are not counted: many users may leave a unique field empty.
				</li>
				<li>
					<code>username</code> and <code>email_address</code> are unique within the membership.
				</li>
			</ul>
			<p>
				When you mark a field as unique and some users already share a value, the user type change is rejected with <code>409 UniqueFieldHasDuplicates</code>, which names the duplicate. Clean up the duplicates first.
			</p>
			<p>
				A user write with a duplicate value answers <code>400 ValidationException</code> with a field error (see <DocLink to="users" hash="create-a-user">Users</DocLink>).
			</p>
			<p>
				Unique fields inside array items are checked by the application, not by an index.
			</p>

			<H3 id="redeclaring-inherited-fields">
				Redeclaring inherited fields
			</H3>
			<p>
				A type can&apos;t declare a field that one of its base types already declares (<code>400 SchemaValidationException</code>, &quot;field is already exist in base type&quot;). The exception is a field declared with <code>isVirtual: true</code> in the derived type: it is accepted as long as its <code>type</code> is the same as the inherited one (otherwise <code>400 SchemaValidationException</code>, &quot;The field type cannot be overwritten on virtual fields&quot;).
			</p>

			<H2 id="endpoints">
				Endpoints
			</H2>
			<p>
				All routes are under <code>{"/memberships/{membershipId}"}</code>.
			</p>
			<Table
				head={["Method", "Route", "Description", "Permission"]}
				rows={[
					[<code>GET</code>, <code>{"/user-types/{id}"}</code>, "Get a user type (id or slug)", <code>{"user-types.read.{id}"}</code>],
					[<code>GET</code>, <code>/user-types</code>, "List the stored user types", <code>user-types.read</code>],
					[<code>GET</code>, <code>/user-types/all</code>, <>All user types, <code>base-user</code> included, without pagination</>, <code>user-types.read</code>],
					[<code>GET</code>, <code>{"/user-types/relations/{id}"}</code>, "The declaring type of each field", <code>{"user-types.read.{id}"}</code>],
					[<code>POST</code>, <code>/user-types/_query</code>, "Query user types", <code>user-types.read</code>],
					[<code>POST</code>, <code>/user-types</code>, "Create a user type", <code>user-types.create</code>],
					[<code>PUT</code>, <code>{"/user-types/{id}"}</code>, "Update a user type", <code>{"user-types.update.{id}"}</code>],
					[<code>DELETE</code>, <code>{"/user-types/{id}"}</code>, "Delete a user type", <code>{"user-types.delete.{id}"}</code>],
				]} />

			<H3 id="get-a-user-type">
				Get a user type
			</H3>
			<Code language="http" code={samples.get} />
			<p>
				Returns the type <strong>with the fields inherited from its base types</strong>.
			</p>

			<H3 id="field-relations">
				Field relations
			</H3>
			<Code language="http" code={samples.relations} />
			<p>
				Groups the fields of a type by the type that declares them, up to <code>base-user</code>. Useful to build forms with one section per level:
			</p>
			<Code language="json" code={samples.relationsResponse} />

			<H3 id="create-a-user-type">
				Create a user type
			</H3>
			<Code language="shell" code={samples.create} />
			<p>
				<strong>Response <code>201 Created</code></strong>: the user type.
			</p>
			<Table
				head={["Error", "When"]}
				rows={[
					[<code>400 UserTypeNameRequired</code>, <><code>name</code> is missing</>],
					[<code>400 InheritedTypeNotFound</code>, <><code>baseType</code> does not exist</>],
					[<code>400 InheritedTypeIsSealed</code>, <><code>baseType</code> is sealed</>],
					[<code>400 UserTypeCannotBeBothAbstractAndSealed</code>, "Both flags are set"],
					[<code>400 UserTypeInheritanceCycle</code>, "The chain loops back to this type"],
					[<><code>400 SchemaValidationException</code>, <code>400 FieldValidationException</code></>, "A field definition is invalid, or a field is already declared by a base type"],
					[<><code>409 ReservedUserTypeName</code>, <code>409 ReservedUserTypeSlug</code></>, <><code>Base User</code> / <code>base-user</code></>],
					[<code>409 UserTypeAlreadyExists</code>, "The slug is taken"],
					[<code>409 UniqueFieldHasDuplicates</code>, "A unique field has duplicate values among existing users"],
				]} />

			<H3 id="update-a-user-type">
				Update a user type
			</H3>
			<Code language="http" code={samples.update} />
			<p>
				The body has the same fields as the create request and <strong>replaces</strong> the type: send all its own <code>properties</code>, not only the changed ones.
			</p>
			<ul>
				<li>
					Existing users are not rewritten. A new required field without a default value makes later updates of existing users fail until they get a value, so give new required fields a <code>defaultValue</code> or fill them in first.
				</li>
				<li>
					The <strong>slug of a type that is in use</strong> (by users or by derived types) can&apos;t change: a new slug is ignored, since users refer to their type by slug.
				</li>
				<li>
					An update without any change answers <code>409 IdenticalDocumentError</code>.
				</li>
			</ul>

			<H3 id="delete-a-user-type">
				Delete a user type
			</H3>
			<Code language="http" code={samples.remove} />
			<p>
				<strong>Response <code>204 No Content</code></strong>. A type that still has users or derived types can&apos;t be deleted: <code>400 UserTypeCanNotBeDelete</code>.
			</p>

			<H2 id="events">
				Events
			</H2>
			<p>
				<code>UserTypeCreated</code>, <code>UserTypeUpdated</code> and <code>UserTypeDeleted</code>. See <DocLink to="events">Events</DocLink>.
			</p>
		</>
	)
}
