import { DocLink, H2, Table } from "@/components/docs/prose"

export default function ErrorCodes() {
	return (
		<>
			<p>
				Her hata yanıtı bir <code>errorCode</code> taşır (yapısı için bkz. <DocLink to="api-conventions" hash="errors">API Kuralları</DocLink>). Bu sayfa kodları alanlarına göre, HTTP durum kodlarıyla birlikte listeler.
			</p>

			<H2 id="general">
				Genel
			</H2>
			<Table
				head={["Kod", "Durum", "Anlamı"]}
				rows={[
					[<code>ModelValidationError</code>, "400", <>İstek doğrulamadan geçemedi; <code>data</code> sorunları listeler</>],
					[<code>ValidationException</code>, "400", <>Bir ya da daha fazla kullanıcı alanı geçersiz ya da benzersiz değil; <code>errors</code> bunları listeler</>],
					[<code>FieldValidationException</code>, "400", <>Bir kullanıcı alanı geçersiz (<code>fieldName</code>, <code>fieldPath</code>)</>],
					[<code>SchemaValidationException</code>, "400", "Bir kullanıcı tipi şeması geçersiz"],
					[<code>ParameterFormatError</code>, "400", "Bir id geçerli bir ObjectId değil"],
					[<code>InvalidQuery</code>, "400", <>Bir <code>_query</code> gövdesi geçerli değil ya da yasak bir operatör kullanıyor</>],
					[<code>UnsupportedAggregationStage</code>, "400", "Bir aggregation aşamasına izin verilmiyor"],
					[<code>SearchKeywordRequired</code>, "400", <><code>keyword</code> eksik</>],
					[<code>IdenticalDocumentError</code>, "409", "Hiçbir değişiklik içermeyen bir güncelleme"],
					[<code>BulkDeleteFailed</code>, "404", "Kaynakların hiçbiri silinemedi"],
					[<code>BulkDeletePartial</code>, "200", "Kaynakların yalnızca bir kısmı silindi"],
					[<code>UnhandledExceptionError</code>, "500", "Beklenmeyen bir hata; sunucu log'una bakın"],
				]} />

			<H2 id="authentication-and-tokens">
				Kimlik doğrulama ve token&apos;lar
			</H2>
			<Table
				head={["Kod", "Durum", "Anlamı"]}
				rows={[
					[<code>AuthorizationHeaderMissing</code>, "401", <><code>Authorization</code> header&apos;ı yok</>],
					[<code>TokenTypeNotSupported</code>, "400", <>Şema <code>Bearer</code> ya da <code>Basic</code> değil veya endpoint için yanlış olan</>],
					[<code>BearerTokenRequired</code>, "400", "Endpoint bir Bearer token gerektiriyor"],
					[<code>InvalidToken</code>, "401", "Token bozuk, imzası yanlış, bilinmeyen bir membership'e ya da uygulamaya ait veya burada kullanılamaz"],
					[<code>TokenWasExpired</code>, "401", "Access token'ın süresi doldu"],
					[<code>TokenWasRevoked</code>, "401", "Access token iptal edildi"],
					[<code>RefreshTokenRequired</code>, "400", "Refresh token verilmedi"],
					[<code>TokenIsNotRefreshable</code>, "401", "Token bir refresh token değil"],
					[<code>RefreshTokenWasExpired</code>, "401", "Refresh token'ın süresi doldu"],
					[<code>RefreshTokenWasRevoked</code>, "401", "Refresh token zaten kullanıldı ya da iptal edildi"],
					[<code>InvalidCredentials</code>, "401", "Bilinmeyen kullanıcı ya da yanlış parola (veya yanlış tek kullanımlık şifre)"],
					[<code>InvalidCredentialsOrMissingToken</code>, "400", <><code>/generate-token</code>&apos;a ne kimlik bilgisi ne de token verildi</>],
					[<code>UserInactive</code>, "401", "Hesap aktif değil"],
					[<code>ScopeRequired</code>, "400", "Scope verilmeden scoped token istendi"],
					[<code>InvalidScope</code>, "400", "Bir scope geçerli bir yetki ifadesi değil"],
					[<code>UserHasNoPermissionForThisScope</code>, "400", "Kullanıcı istenen bir scope'a sahip değil"],
					[<code>MembershipIdsDoNotMatch</code>, "400", <>Token ve <code>X-Ertis-Alias</code> farklı membership&apos;lere ait</>],
					[<code>MembershipIdRequired</code>, "400", <><code>X-Ertis-Alias</code> eksik</>],
					[<code>Unauthorized</code>, "401", "Genel kimlik doğrulama hatası; ör. bir sağlayıcı girişi reddetti"],
				]} />

			<H2 id="authorization">
				Yetkilendirme
			</H2>
			<Table
				head={["Kod", "Durum", "Anlamı"]}
				rows={[
					[<code>AccessDenied</code>, "403", "Çağıran isteği yapamaz ya da token başka bir membership'e ait"],
					[<code>InvalidRbac</code>, "400", "Bir yetki ifadesi geçersiz"],
					[<code>InvalidUbac</code>, "400", "Bir kullanıcı ya da uygulama yetki ifadesi geçersiz"],
					[<code>UbacsConflicted</code>, "409", <>Aynı ifade bir kullanıcının hem <code>permissions</code> hem <code>forbidden</code> listesinde</>],
					[<code>PermissionParameterRequired</code>, "400", <>Bir check-permission isteğinde <code>permission</code> eksik</>],
					[<code>AuthenticationServiceUnavailable</code>, "503", "(SDK) ErtisAuth'a ulaşılamadı"],
				]} />

			<H2 id="setup">
				Kurulum
			</H2>
			<Table
				head={["Kod", "Durum", "Anlamı"]}
				rows={[
					[<code>SetupRejected</code>, "401", "Kurulum token'ı eksik, çok kısa ya da yanlış"],
					[<code>AlreadySetUp</code>, "409", "Kurulum zaten yapılmış"],
					[<code>SetupInProgress</code>, "409", "Başka bir kurulum isteği çalışıyor"],
				]} />

			<H2 id="memberships">
				Membership&apos;ler
			</H2>
			<Table
				head={["Kod", "Durum", "Anlamı"]}
				rows={[
					[<code>MembershipNotFound</code>, "404", ""],
					[<code>MembershipAlreadyExists</code>, "409", "Slug kullanımda"],
					[<code>MembershipCouldNotDeleted</code>, "409", "Membership'in hâlâ kaynakları var"],
					[<code>HashAlgorithmRequired</code>, "400", ""],
					[<code>UnsupportedHashAlgorithm</code>, "400", ""],
					[<code>MembershipHashAlgorithmInvalid</code>, "500", "Saklanan bir membership'in geçerli bir hash algoritması yok"],
					[<code>UnsupportedEncoding</code>, "400", ""],
					[<code>UnsupportedLanguage</code>, "400", <>Bilinmeyen <code>default_language</code></>],
				]} />

			<H2 id="users">
				Kullanıcılar
			</H2>
			<Table
				head={["Kod", "Durum", "Anlamı"]}
				rows={[
					[<code>UserNotFound</code>, "404", ""],
					[<code>PasswordRequired</code>, "400", ""],
					[<code>PasswordMinLengthRuleError</code>, "400", "Parola 6 karakterden kısa"],
					[<code>EmailAddressRequired</code>, "400", ""],
					[<code>UsernameOrEmailAddressRequired</code>, "400", ""],
					[<code>RoleRequired</code>, "400", ""],
					[<code>UserAlreadyActive</code>, "400", ""],
					[<code>UserAlreadyInactive</code>, "400", ""],
					[<code>UserTypeRequired</code>, "400", ""],
					[<code>UserTypeImmutable</code>, "400", "Bir kullanıcının tipi değiştirilemez"],
					[<code>HostRequired</code>, "400", <><code>X-Host</code> eksik</>],
					[<code>ResetTokenRequired</code>, "400", ""],
					[<code>InvalidUtilizer</code>, "501", "Bir mail hook, e-posta adresi olmayan bir çağırana gönderilmek isteniyor"],
				]} />

			<H2 id="user-types">
				Kullanıcı tipleri
			</H2>
			<Table
				head={["Kod", "Durum", "Anlamı"]}
				rows={[
					[<code>UserTypeNotFound</code>, "404", ""],
					[<code>UserTypeAlreadyExists</code>, "409", "Slug kullanımda"],
					[<code>UserTypeNameRequired</code>, "400", ""],
					[<code>UserTypeCannotBeBothAbstractAndSealed</code>, "400", ""],
					[<code>InheritedTypeNotFound</code>, "400", "Temel tip yok"],
					[<code>InheritedTypeIsSealed</code>, "400", "Temel tipten türetilemez"],
					[<code>InheritedTypeIsAbstract</code>, "400", "Bir kullanıcının tipi abstract olamaz"],
					[<code>UserTypeInheritanceCycle</code>, "400", "Kalıtım zinciri kendi üzerine dönüyor"],
					[<code>ReservedUserTypeName</code>, "409", <><code>Base User</code> ayrılmıştır</>],
					[<code>ReservedUserTypeSlug</code>, "409", <><code>base-user</code> ayrılmıştır</>],
					[<code>UniqueFieldHasDuplicates</code>, "409", "Benzersiz yapılan bir alanda mevcut kullanıcılar aynı değeri paylaşıyor"],
					[<code>UserTypeCanNotBeDelete</code>, "400", "Tipin hâlâ kullanıcıları ya da türetilmiş tipleri var"],
				]} />

			<H2 id="roles-and-applications">
				Roller ve uygulamalar
			</H2>
			<Table
				head={["Kod", "Durum", "Anlamı"]}
				rows={[
					[<code>RoleNotFound</code>, "404", ""],
					[<code>RoleAlreadyExists</code>, "409", "Slug kullanımda"],
					[<code>ReservedRole</code>, "409", <><code>admin</code> ayrılmıştır</>],
					[<code>SystemRolesCannotBeDeleted</code>, "409", <><code>admin</code> rolü silinemez</>],
					[<code>ApplicationNotFound</code>, "404", ""],
					[<code>ApplicationAlreadyExists</code>, "409", "Slug kullanımda"],
				]} />

			<H2 id="providers">
				Sağlayıcılar
			</H2>
			<Table
				head={["Kod", "Durum", "Anlamı"]}
				rows={[
					[<code>ProviderNotFound</code>, "404", ""],
					[<code>ProviderAlreadyExists</code>, "409", "Slug kullanımda"],
					[<code>ProviderTypeRequired</code>, "400", ""],
					[<code>UnknownProvider</code>, "400", <>Bilinmeyen <code>type</code></>],
					[<code>UnsupportedProvider</code>, "400", "Sağlayıcı tipi burada desteklenmiyor"],
					[<code>ProviderSlugCannotBeChanged</code>, "400", ""],
					[<code>InvalidProviderLoginRequest</code>, "400", "Giriş gövdesi sağlayıcı tipine uymuyor"],
					[<code>ProviderNotConfigured</code>, "403", "Bu slug'a sahip sağlayıcı yok"],
					[<code>ProviderIsDisable</code>, "403", "Sağlayıcı aktif değil"],
					[<code>UntrustedProvider</code>, "403", "Client id sağlayıcıyla eşleşmiyor"],
					[<code>ProviderEmailNotTrusted</code>, "409", "Aynı doğrulanmamış e-postaya sahip bir kullanıcı var"],
					[<code>ProviderProfileIncomplete</code>, "401", "Sağlayıcı profilinde e-posta ya da ad eksik"],
					[<code>ProviderNotConfiguredCorrectly</code>, "501", "Sağlayıcı yapılandırması eksik ya da yanlış"],
					[<code>ProviderUnavailable</code>, "503", "Sağlayıcıya ulaşılamadı"],
				]} />

			<H2 id="account-recovery">
				Hesap kurtarma
			</H2>
			<Table
				head={["Kod", "Durum", "Anlamı"]}
				rows={[
					[<code>OtpNotConfiguredYet</code>, "400", "Membership'in OTP politikası yok"],
					[<code>OtpHostNotConfiguredYet</code>, "400", "Membership'in OTP host'u yok"],
					[<code>OtpHostRequired</code>, "400", <><code>X-Host</code> eksik ya da <code>otp_settings.host</code> boş</>],
					[<code>OtpHostMismatch</code>, "401", <><code>X-Host</code>, membership&apos;in OTP host&apos;u değil</>],
					[<code>OtpExpired</code>, "401", "Tek kullanımlık şifrenin süresi doldu"],
					[<code>OneTimePasswordNotFound</code>, "404", ""],
					[<code>OneTimePasswordAlreadyExists</code>, "409", ""],
				]} />

			<H2 id="device-code-flow">
				Cihaz kodu akışı
			</H2>
			<Table
				head={["Kod", "Durum", "Anlamı"]}
				rows={[
					[<code>TokenCodePolicyNotFound</code>, "404", "Membership'in kod politikası yok ya da politika mevcut değil"],
					[<code>TokenCodePolicyAlreadyExists</code>, "409", "Slug kullanımda"],
					[<code>TokenCodePolicyInUse</code>, "409", "Membership politikayı kullanıyor"],
					[<code>TokenCodeNotFound</code>, "404", "Bilinmeyen ya da süresi dolmuş kullanıcı kodu"],
					[<code>TokenCodeExpired</code>, "401", "Kodun süresi doldu"],
					[<code>UnauthorizedTokenCode</code>, "401", "Kod henüz onaylanmadı"],
					[<code>TokenCodeDenied</code>, "401", "Kullanıcı kodu reddetti"],
					[<code>TokenCodeSlowDown</code>, "400", <>Cihaz <code>interval</code>&apos;dan daha sık sorguluyor</>],
					[<code>TokenCodeAlreadyAuthorized</code>, "409", "Kod zaten onaylandı ya da reddedildi"],
					[<code>TokenCodeCouldNotBeGenerated</code>, "503", "Kullanılmamış bir kullanıcı kodu üretilemedi; yeniden deneyin"],
				]} />

			<H2 id="hooks-events-and-sessions">
				Hook&apos;lar, olaylar ve oturumlar
			</H2>
			<Table
				head={["Kod", "Durum", "Anlamı"]}
				rows={[
					[<code>WebhookNotFound</code>, "404", ""],
					[<code>WebhookAlreadyExists</code>, "409", "Slug kullanımda"],
					[<code>MailHookNotFound</code>, "404", ""],
					[<code>MailHookAlreadyExists</code>, "409", "Slug kullanımda"],
					[<code>NotDefinedAnyMailProvider</code>, "501", "Membership'in mail sağlayıcısı yok"],
					[<code>ActivationMailHookWasNotDefined</code>, "501", <>Aktif bir <code>User Activation</code> mail hook&apos;u yok</>],
					[<code>ResetPasswordMailHookWasNotDefined</code>, "501", <>Aktif bir <code>Reset Password</code> mail hook&apos;u yok</>],
					[<code>EventNotFound</code>, "404", ""],
					[<code>ActiveTokenNotFound</code>, "404", ""],
				]} />
		</>
	)
}
