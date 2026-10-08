import { DocLink, H2, Table } from "@/components/docs/prose"

export default function ErrorCodes() {
	return (
		<>
			<p>
				Every error response carries an <code>errorCode</code> (see <DocLink to="api-conventions" hash="errors">API Conventions</DocLink> for the shape). This page lists the codes by area, with their HTTP status.
			</p>

			<H2 id="general">
				General
			</H2>
			<Table
				head={["Code", "Status", "Meaning"]}
				rows={[
					[<code>ModelValidationError</code>, "400", <>The request failed validation; <code>data</code> lists the problems</>],
					[<code>ValidationException</code>, "400", <>One or more user fields are invalid or not unique; <code>errors</code> lists them</>],
					[<code>FieldValidationException</code>, "400", <>A user field is invalid (<code>fieldName</code>, <code>fieldPath</code>)</>],
					[<code>SchemaValidationException</code>, "400", "A user type schema is invalid"],
					[<code>ParameterFormatError</code>, "400", "An id is not a valid ObjectId"],
					[<code>InvalidQuery</code>, "400", <>A <code>_query</code> body is not valid, or uses a forbidden operator</>],
					[<code>UnsupportedAggregationStage</code>, "400", "An aggregation stage is not allowed"],
					[<code>SearchKeywordRequired</code>, "400", <><code>keyword</code> is missing</>],
					[<code>IdenticalDocumentError</code>, "409", "An update without any change"],
					[<code>BulkDeleteFailed</code>, "404", "None of the resources could be deleted"],
					[<code>BulkDeletePartial</code>, "200", "Only some of the resources were deleted"],
					[<code>UnhandledExceptionError</code>, "500", "An unexpected error; see the server log"],
				]} />

			<H2 id="authentication-and-tokens">
				Authentication and tokens
			</H2>
			<Table
				head={["Code", "Status", "Meaning"]}
				rows={[
					[<code>AuthorizationHeaderMissing</code>, "401", <>No <code>Authorization</code> header</>],
					[<code>TokenTypeNotSupported</code>, "400", <>The scheme is not <code>Bearer</code> or <code>Basic</code>, or the wrong one for the endpoint</>],
					[<code>BearerTokenRequired</code>, "400", "The endpoint needs a Bearer token"],
					[<code>InvalidToken</code>, "401", "The token is malformed, has a wrong signature, belongs to an unknown membership or application, or is not usable here"],
					[<code>TokenWasExpired</code>, "401", "The access token has expired"],
					[<code>TokenWasRevoked</code>, "401", "The access token was revoked"],
					[<code>RefreshTokenRequired</code>, "400", "No refresh token was given"],
					[<code>TokenIsNotRefreshable</code>, "401", "The token is not a refresh token"],
					[<code>RefreshTokenWasExpired</code>, "401", "The refresh token has expired"],
					[<code>RefreshTokenWasRevoked</code>, "401", "The refresh token was already used or revoked"],
					[<code>InvalidCredentials</code>, "401", "Unknown user or wrong password (or wrong one-time password)"],
					[<code>InvalidCredentialsOrMissingToken</code>, "400", <>Neither credentials nor a token were given to <code>/generate-token</code></>],
					[<code>UserInactive</code>, "401", "The account is not active"],
					[<code>ScopeRequired</code>, "400", "A scoped token was requested without scopes"],
					[<code>InvalidScope</code>, "400", "A scope is not a valid permission expression"],
					[<code>UserHasNoPermissionForThisScope</code>, "400", "The user doesn't have a requested scope"],
					[<code>MembershipIdsDoNotMatch</code>, "400", <>The token and <code>X-Ertis-Alias</code> belong to different memberships</>],
					[<code>MembershipIdRequired</code>, "400", <><code>X-Ertis-Alias</code> is missing</>],
					[<code>Unauthorized</code>, "401", "Generic authentication failure, e.g. a provider rejected the login"],
				]} />

			<H2 id="authorization">
				Authorization
			</H2>
			<Table
				head={["Code", "Status", "Meaning"]}
				rows={[
					[<code>AccessDenied</code>, "403", "The caller may not perform the request, or the token belongs to another membership"],
					[<code>InvalidRbac</code>, "400", "A permission expression is invalid"],
					[<code>InvalidUbac</code>, "400", "A user or application permission expression is invalid"],
					[<code>UbacsConflicted</code>, "409", <>The same expression is in a user&apos;s <code>permissions</code> and <code>forbidden</code></>],
					[<code>PermissionParameterRequired</code>, "400", <><code>permission</code> is missing in a check-permission request</>],
					[<code>AuthenticationServiceUnavailable</code>, "503", "(SDK) ErtisAuth could not be reached"],
				]} />

			<H2 id="setup">
				Setup
			</H2>
			<Table
				head={["Code", "Status", "Meaning"]}
				rows={[
					[<code>SetupRejected</code>, "401", "The setup token is missing, too short or wrong"],
					[<code>AlreadySetUp</code>, "409", "The installation is already set up"],
					[<code>SetupInProgress</code>, "409", "Another setup request is running"],
				]} />

			<H2 id="memberships">
				Memberships
			</H2>
			<Table
				head={["Code", "Status", "Meaning"]}
				rows={[
					[<code>MembershipNotFound</code>, "404", ""],
					[<code>MembershipAlreadyExists</code>, "409", "The slug is taken"],
					[<code>MembershipCouldNotDeleted</code>, "409", "The membership still has resources"],
					[<code>HashAlgorithmRequired</code>, "400", ""],
					[<code>UnsupportedHashAlgorithm</code>, "400", ""],
					[<code>MembershipHashAlgorithmInvalid</code>, "500", "A stored membership has no valid hash algorithm"],
					[<code>UnsupportedEncoding</code>, "400", ""],
					[<code>UnsupportedLanguage</code>, "400", <>Unknown <code>default_language</code></>],
				]} />

			<H2 id="users">
				Users
			</H2>
			<Table
				head={["Code", "Status", "Meaning"]}
				rows={[
					[<code>UserNotFound</code>, "404", ""],
					[<code>PasswordRequired</code>, "400", ""],
					[<code>PasswordMinLengthRuleError</code>, "400", "The password is shorter than 6 characters"],
					[<code>EmailAddressRequired</code>, "400", ""],
					[<code>UsernameOrEmailAddressRequired</code>, "400", ""],
					[<code>RoleRequired</code>, "400", ""],
					[<code>UserAlreadyActive</code>, "400", ""],
					[<code>UserAlreadyInactive</code>, "400", ""],
					[<code>UserTypeRequired</code>, "400", ""],
					[<code>UserTypeImmutable</code>, "400", "A user's type can't be changed"],
					[<code>HostRequired</code>, "400", <><code>X-Host</code> is missing</>],
					[<code>ResetTokenRequired</code>, "400", ""],
					[<code>InvalidUtilizer</code>, "501", "A mail hook should be sent to a utilizer without an email address"],
				]} />

			<H2 id="user-types">
				User types
			</H2>
			<Table
				head={["Code", "Status", "Meaning"]}
				rows={[
					[<code>UserTypeNotFound</code>, "404", ""],
					[<code>UserTypeAlreadyExists</code>, "409", "The slug is taken"],
					[<code>UserTypeNameRequired</code>, "400", ""],
					[<code>UserTypeCannotBeBothAbstractAndSealed</code>, "400", ""],
					[<code>InheritedTypeNotFound</code>, "400", "The base type does not exist"],
					[<code>InheritedTypeIsSealed</code>, "400", "The base type can't be inherited from"],
					[<code>InheritedTypeIsAbstract</code>, "400", "A user can't have an abstract type"],
					[<code>UserTypeInheritanceCycle</code>, "400", "The inheritance chain loops"],
					[<code>ReservedUserTypeName</code>, "409", <><code>Base User</code> is reserved</>],
					[<code>ReservedUserTypeSlug</code>, "409", <><code>base-user</code> is reserved</>],
					[<code>UniqueFieldHasDuplicates</code>, "409", "Existing users share a value of a field being made unique"],
					[<code>UserTypeCanNotBeDelete</code>, "400", "The type still has users or derived types"],
				]} />

			<H2 id="roles-and-applications">
				Roles and applications
			</H2>
			<Table
				head={["Code", "Status", "Meaning"]}
				rows={[
					[<code>RoleNotFound</code>, "404", ""],
					[<code>RoleAlreadyExists</code>, "409", "The slug is taken"],
					[<code>ReservedRole</code>, "409", <><code>admin</code> is reserved</>],
					[<code>SystemRolesCannotBeDeleted</code>, "409", <>The <code>admin</code> role can&apos;t be deleted</>],
					[<code>ApplicationNotFound</code>, "404", ""],
					[<code>ApplicationAlreadyExists</code>, "409", "The slug is taken"],
				]} />

			<H2 id="providers">
				Providers
			</H2>
			<Table
				head={["Code", "Status", "Meaning"]}
				rows={[
					[<code>ProviderNotFound</code>, "404", ""],
					[<code>ProviderAlreadyExists</code>, "409", "The slug is taken"],
					[<code>ProviderTypeRequired</code>, "400", ""],
					[<code>UnknownProvider</code>, "400", <>Unknown <code>type</code></>],
					[<code>UnsupportedProvider</code>, "400", "The provider type is not supported here"],
					[<code>ProviderSlugCannotBeChanged</code>, "400", ""],
					[<code>InvalidProviderLoginRequest</code>, "400", "The login body doesn't match the provider type"],
					[<code>ProviderNotConfigured</code>, "403", "No provider with this slug"],
					[<code>ProviderIsDisable</code>, "403", "The provider is not active"],
					[<code>UntrustedProvider</code>, "403", "The client id doesn't match the provider"],
					[<code>ProviderEmailNotTrusted</code>, "409", "A user with the same unverified email exists"],
					[<code>ProviderProfileIncomplete</code>, "401", "The provider profile lacks the email or the name"],
					[<code>ProviderNotConfiguredCorrectly</code>, "501", "The provider configuration is incomplete or wrong"],
					[<code>ProviderUnavailable</code>, "503", "The provider could not be reached"],
				]} />

			<H2 id="account-recovery">
				Account recovery
			</H2>
			<Table
				head={["Code", "Status", "Meaning"]}
				rows={[
					[<code>OtpNotConfiguredYet</code>, "400", "The membership has no OTP policy"],
					[<code>OtpHostNotConfiguredYet</code>, "400", "The membership has no OTP host"],
					[<code>OtpHostRequired</code>, "400", <><code>X-Host</code> is missing, or <code>otp_settings.host</code> is empty</>],
					[<code>OtpHostMismatch</code>, "401", <><code>X-Host</code> is not the membership&apos;s OTP host</>],
					[<code>OtpExpired</code>, "401", "The one-time password has expired"],
					[<code>OneTimePasswordNotFound</code>, "404", ""],
					[<code>OneTimePasswordAlreadyExists</code>, "409", ""],
				]} />

			<H2 id="device-code-flow">
				Device code flow
			</H2>
			<Table
				head={["Code", "Status", "Meaning"]}
				rows={[
					[<code>TokenCodePolicyNotFound</code>, "404", "The membership has no code policy, or it doesn't exist"],
					[<code>TokenCodePolicyAlreadyExists</code>, "409", "The slug is taken"],
					[<code>TokenCodePolicyInUse</code>, "409", "The membership uses the policy"],
					[<code>TokenCodeNotFound</code>, "404", "Unknown or expired user code"],
					[<code>TokenCodeExpired</code>, "401", "The code has expired"],
					[<code>UnauthorizedTokenCode</code>, "401", "The code is not approved yet"],
					[<code>TokenCodeDenied</code>, "401", "The user denied the code"],
					[<code>TokenCodeSlowDown</code>, "400", <>The device polls more often than <code>interval</code></>],
					[<code>TokenCodeAlreadyAuthorized</code>, "409", "The code was already approved or denied"],
					[<code>TokenCodeCouldNotBeGenerated</code>, "503", "No unused user code could be generated; try again"],
				]} />

			<H2 id="hooks-events-and-sessions">
				Hooks, events and sessions
			</H2>
			<Table
				head={["Code", "Status", "Meaning"]}
				rows={[
					[<code>WebhookNotFound</code>, "404", ""],
					[<code>WebhookAlreadyExists</code>, "409", "The slug is taken"],
					[<code>MailHookNotFound</code>, "404", ""],
					[<code>MailHookAlreadyExists</code>, "409", "The slug is taken"],
					[<code>NotDefinedAnyMailProvider</code>, "501", "The membership has no mail provider"],
					[<code>ActivationMailHookWasNotDefined</code>, "501", <>No active <code>User Activation</code> mail hook</>],
					[<code>ResetPasswordMailHookWasNotDefined</code>, "501", <>No active <code>Reset Password</code> mail hook</>],
					[<code>EventNotFound</code>, "404", ""],
					[<code>ActiveTokenNotFound</code>, "404", ""],
				]} />
		</>
	)
}
