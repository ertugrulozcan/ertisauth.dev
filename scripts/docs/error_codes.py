"""Generates the Error Codes page (src/docs/{en,tr}/error-codes.tsx) from the tables of the wiki's Error-Codes page.

The English text comes from the wiki; the Turkish titles and meanings are in TITLES_TR and MEANINGS_TR below. A code
added to the wiki without a Turkish meaning stops the script with the list of the missing ones.

Usage:
	python3 scripts/docs/error_codes.py           regenerate both languages
	python3 scripts/docs/error_codes.py --check   only report whether the pages are up to date (exit code 1 when not)
"""
import os
import re
import sys

from wiki import SITE_ROOT, read_wiki_page

text = read_wiki_page("Error-Codes")
sections = re.findall(r"^## (.+?)\n\n\| Code \| Status \| Meaning \|\n\|---\|---\|---\|\n((?:\|.*\n?)+)", text, re.M)

TITLES_TR = {
	"General": "Genel",
	"Authentication and tokens": "Kimlik doğrulama ve token'lar",
	"Authorization": "Yetkilendirme",
	"Setup": "Kurulum",
	"Memberships": "Membership'ler",
	"Users": "Kullanıcılar",
	"User types": "Kullanıcı tipleri",
	"Roles and applications": "Roller ve uygulamalar",
	"Providers": "Sağlayıcılar",
	"Account recovery": "Hesap kurtarma",
	"Device code flow": "Cihaz kodu akışı",
	"Hooks, events and sessions": "Hook'lar, olaylar ve oturumlar",
}

MEANINGS_TR = {
	"ModelValidationError": "İstek doğrulamadan geçemedi; `data` sorunları listeler",
	"ValidationException": "Bir ya da daha fazla kullanıcı alanı geçersiz ya da benzersiz değil; `errors` bunları listeler",
	"FieldValidationException": "Bir kullanıcı alanı geçersiz (`fieldName`, `fieldPath`)",
	"SchemaValidationException": "Bir kullanıcı tipi şeması geçersiz",
	"ParameterFormatError": "Bir id geçerli bir ObjectId değil",
	"InvalidQuery": "Bir `_query` gövdesi geçerli değil ya da yasak bir operatör kullanıyor",
	"UnsupportedAggregationStage": "Bir aggregation aşamasına izin verilmiyor",
	"SearchKeywordRequired": "`keyword` eksik",
	"IdenticalDocumentError": "Hiçbir değişiklik içermeyen bir güncelleme",
	"BulkDeleteFailed": "Kaynakların hiçbiri silinemedi",
	"BulkDeletePartial": "Kaynakların yalnızca bir kısmı silindi",
	"UnhandledExceptionError": "Beklenmeyen bir hata; sunucu log'una bakın",
	"AuthorizationHeaderMissing": "`Authorization` header'ı yok",
	"TokenTypeNotSupported": "Şema `Bearer` ya da `Basic` değil veya endpoint için yanlış olan",
	"BearerTokenRequired": "Endpoint bir Bearer token gerektiriyor",
	"InvalidToken": "Token bozuk, imzası yanlış, bilinmeyen bir membership'e ya da uygulamaya ait veya burada kullanılamaz",
	"TokenWasExpired": "Access token'ın süresi doldu",
	"TokenWasRevoked": "Access token iptal edildi",
	"RefreshTokenRequired": "Refresh token verilmedi",
	"TokenIsNotRefreshable": "Token bir refresh token değil",
	"RefreshTokenWasExpired": "Refresh token'ın süresi doldu",
	"RefreshTokenWasRevoked": "Refresh token zaten kullanıldı ya da iptal edildi",
	"InvalidCredentials": "Bilinmeyen kullanıcı ya da yanlış parola (veya yanlış tek kullanımlık şifre)",
	"InvalidCredentialsOrMissingToken": "`/generate-token`'a ne kimlik bilgisi ne de token verildi",
	"UserInactive": "Hesap aktif değil",
	"ScopeRequired": "Scope verilmeden scoped token istendi",
	"InvalidScope": "Bir scope geçerli bir yetki ifadesi değil",
	"UserHasNoPermissionForThisScope": "Kullanıcı istenen bir scope'a sahip değil",
	"MembershipIdsDoNotMatch": "Token ve `X-Ertis-Alias` farklı membership'lere ait",
	"MembershipIdRequired": "`X-Ertis-Alias` eksik",
	"Unauthorized": "Genel kimlik doğrulama hatası; ör. bir sağlayıcı girişi reddetti",
	"AccessDenied": "Çağıran isteği yapamaz ya da token başka bir membership'e ait",
	"InvalidRbac": "Bir yetki ifadesi geçersiz",
	"InvalidUbac": "Bir kullanıcı ya da uygulama yetki ifadesi geçersiz",
	"UbacsConflicted": "Aynı ifade bir kullanıcının hem `permissions` hem `forbidden` listesinde",
	"PermissionParameterRequired": "Bir check-permission isteğinde `permission` eksik",
	"AuthenticationServiceUnavailable": "(SDK) ErtisAuth'a ulaşılamadı",
	"SetupRejected": "Kurulum token'ı eksik, çok kısa ya da yanlış",
	"AlreadySetUp": "Kurulum zaten yapılmış",
	"SetupInProgress": "Başka bir kurulum isteği çalışıyor",
	"MembershipAlreadyExists": "Slug kullanımda",
	"MembershipCouldNotDeleted": "Membership'in hâlâ kaynakları var",
	"MembershipHashAlgorithmInvalid": "Saklanan bir membership'in geçerli bir hash algoritması yok",
	"UnsupportedLanguage": "Bilinmeyen `default_language`",
	"PasswordMinLengthRuleError": "Parola 6 karakterden kısa",
	"UserTypeImmutable": "Bir kullanıcının tipi değiştirilemez",
	"HostRequired": "`X-Host` eksik",
	"InvalidUtilizer": "Bir mail hook, e-posta adresi olmayan bir çağırana gönderilmek isteniyor",
	"UserTypeAlreadyExists": "Slug kullanımda",
	"InheritedTypeNotFound": "Temel tip yok",
	"InheritedTypeIsSealed": "Temel tipten türetilemez",
	"InheritedTypeIsAbstract": "Bir kullanıcının tipi abstract olamaz",
	"UserTypeInheritanceCycle": "Kalıtım zinciri kendi üzerine dönüyor",
	"ReservedUserTypeName": "`Base User` ayrılmıştır",
	"ReservedUserTypeSlug": "`base-user` ayrılmıştır",
	"UniqueFieldHasDuplicates": "Benzersiz yapılan bir alanda mevcut kullanıcılar aynı değeri paylaşıyor",
	"UserTypeCanNotBeDelete": "Tipin hâlâ kullanıcıları ya da türetilmiş tipleri var",
	"RoleAlreadyExists": "Slug kullanımda",
	"ReservedRole": "`admin` ayrılmıştır",
	"SystemRolesCannotBeDeleted": "`admin` rolü silinemez",
	"ApplicationAlreadyExists": "Slug kullanımda",
	"ProviderAlreadyExists": "Slug kullanımda",
	"UnknownProvider": "Bilinmeyen `type`",
	"UnsupportedProvider": "Sağlayıcı tipi burada desteklenmiyor",
	"InvalidProviderLoginRequest": "Giriş gövdesi sağlayıcı tipine uymuyor",
	"ProviderNotConfigured": "Bu slug'a sahip sağlayıcı yok",
	"ProviderIsDisable": "Sağlayıcı aktif değil",
	"UntrustedProvider": "Client id sağlayıcıyla eşleşmiyor",
	"ProviderEmailNotTrusted": "Aynı doğrulanmamış e-postaya sahip bir kullanıcı var",
	"ProviderProfileIncomplete": "Sağlayıcı profilinde e-posta ya da ad eksik",
	"ProviderNotConfiguredCorrectly": "Sağlayıcı yapılandırması eksik ya da yanlış",
	"ProviderUnavailable": "Sağlayıcıya ulaşılamadı",
	"OtpNotConfiguredYet": "Membership'in OTP politikası yok",
	"OtpHostNotConfiguredYet": "Membership'in OTP host'u yok",
	"OtpHostRequired": "`X-Host` eksik ya da `otp_settings.host` boş",
	"OtpHostMismatch": "`X-Host`, membership'in OTP host'u değil",
	"OtpExpired": "Tek kullanımlık şifrenin süresi doldu",
	"TokenCodePolicyNotFound": "Membership'in kod politikası yok ya da politika mevcut değil",
	"TokenCodePolicyAlreadyExists": "Slug kullanımda",
	"TokenCodePolicyInUse": "Membership politikayı kullanıyor",
	"TokenCodeNotFound": "Bilinmeyen ya da süresi dolmuş kullanıcı kodu",
	"TokenCodeExpired": "Kodun süresi doldu",
	"UnauthorizedTokenCode": "Kod henüz onaylanmadı",
	"TokenCodeDenied": "Kullanıcı kodu reddetti",
	"TokenCodeSlowDown": "Cihaz `interval`'dan daha sık sorguluyor",
	"TokenCodeAlreadyAuthorized": "Kod zaten onaylandı ya da reddedildi",
	"TokenCodeCouldNotBeGenerated": "Kullanılmamış bir kullanıcı kodu üretilemedi; yeniden deneyin",
	"WebhookAlreadyExists": "Slug kullanımda",
	"MailHookAlreadyExists": "Slug kullanımda",
	"NotDefinedAnyMailProvider": "Membership'in mail sağlayıcısı yok",
	"ActivationMailHookWasNotDefined": "Aktif bir `User Activation` mail hook'u yok",
	"ResetPasswordMailHookWasNotDefined": "Aktif bir `Reset Password` mail hook'u yok",
}

def slug(title):
	return re.sub(r"[^a-z0-9 -]", "", title.lower()).replace(" ", "-")

def cell(md):
	# inline markdown -> JSX: `code` spans, the rest as escaped text
	if md == "":
		return '""'
	if "`" not in md:
		return '"' + md.replace('"', '\\"') + '"'
	parts = re.split(r"(`[^`]+`)", md)
	out = ""
	for part in parts:
		if part.startswith("`"):
			inner = part[1:-1]
			out += "<code>" + (("{\"" + inner + "\"}") if re.search(r"[{}<>]", inner) else inner) + "</code>"
		else:
			out += part.replace("'", "&apos;").replace('"', "&quot;")
	return "<>" + out + "</>"

def page(lang):
	used = set()
	lines = []
	if lang == "en":
		lines += ["\t\t\t<p>", "\t\t\t\tEvery error response carries an <code>errorCode</code> (see <DocLink to=\"api-conventions\" hash=\"errors\">API Conventions</DocLink> for the shape). This page lists the codes by area, with their HTTP status.", "\t\t\t</p>"]
		head = '["Code", "Status", "Meaning"]'
	else:
		lines += ["\t\t\t<p>", "\t\t\t\tHer hata yanıtı bir <code>errorCode</code> taşır (yapısı için bkz. <DocLink to=\"api-conventions\" hash=\"errors\">API Kuralları</DocLink>). Bu sayfa kodları alanlarına göre, HTTP durum kodlarıyla birlikte listeler.", "\t\t\t</p>"]
		head = '["Kod", "Durum", "Anlamı"]'
	for title, body in sections:
		lines += ["", f"\t\t\t<H2 id=\"{slug(title)}\">", "\t\t\t\t" + (title if lang == "en" else TITLES_TR[title]).replace("'", "&apos;"), "\t\t\t</H2>", "\t\t\t<Table", f"\t\t\t\thead={{{head}}}", "\t\t\t\trows={["]
		for row in body.strip().split("\n"):
			code, status, meaning = [c.strip() for c in row.strip("|").split("|")]
			name = code.strip("`")
			if lang == "tr" and meaning:
				meaning = MEANINGS_TR[name]
				used.add(name)
			lines.append(f"\t\t\t\t\t[<code>{name}</code>, \"{status}\", {cell(meaning)}],")
		lines += ["\t\t\t\t]} />"]
	if lang == "tr":
		unused = set(MEANINGS_TR) - used
		if unused:
			raise SystemExit(f"Remove these codes from MEANINGS_TR, the wiki doesn't list them (with a meaning) anymore: {', '.join(sorted(unused))}")
	name = "ErrorCodes"
	return "\n".join([
		'import { DocLink, H2, Table } from "@/components/docs/prose"',
		"",
		f"export default function {name}() {{",
		"\treturn (",
		"\t\t<>",
		*lines,
		"\t\t</>",
		"\t)",
		"}",
		"",
	])

def main(args):
	if not sections:
		raise SystemExit("No code tables found in Error-Codes.md")
	
	codes = [row.strip().strip("|").split("|")[0].strip().strip("`") for _, body in sections for row in body.strip().split("\n")]
	missing = [code for code in codes if code not in MEANINGS_TR and row_meaning(code)]
	if missing:
		raise SystemExit(f"Add the Turkish meaning of these codes to MEANINGS_TR: {', '.join(missing)}")
	
	missing_titles = [title for title, _ in sections if title not in TITLES_TR]
	if missing_titles:
		raise SystemExit(f"Add the Turkish title of these sections to TITLES_TR: {', '.join(missing_titles)}")
	
	up_to_date = True
	for lang in ("en", "tr"):
		path = os.path.join(SITE_ROOT, "src", "docs", lang, "error-codes.tsx")
		content = page(lang)
		with open(path, encoding="utf-8") as file:
			current = file.read()
		if current != content:
			up_to_date = False
			print(f"{lang}/error-codes.tsx is out of date")
			if "--check" not in args:
				with open(path, "w", encoding="utf-8") as file:
					file.write(content)
	
	if up_to_date:
		print("The Error Codes page matches the wiki")
	return 0 if up_to_date or "--check" not in args else 1


def row_meaning(code):
	"""The English meaning of a code in the wiki; the codes without one need no translation."""
	for _, body in sections:
		for row in body.strip().split("\n"):
			cells = [x.strip() for x in row.strip().strip("|").split("|")]
			if cells[0].strip("`") == code:
				return cells[2]
	return ""


if __name__ == "__main__":
	sys.exit(main(sys.argv[1:]))
