import * as samples from "../samples/external-providers"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function ExternalProviders() {
	return (
		<>
			<p>
				Kullanıcılar <strong>Google</strong>, <strong>Apple</strong>, <strong>Facebook</strong> ya da <strong>Microsoft</strong>&apos;ta zaten sahip oldukları bir hesapla giriş yapabilir. İstemci uygulamanız sağlayıcının kendi giriş akışını (SDK&apos;sını ya da web akışını) çalıştırır ve sonucu ErtisAuth&apos;a gönderir; ErtisAuth sonucu sağlayıcıya doğrulatır ve tıpkı şifreyle girişte olduğu gibi bir ErtisAuth token çifti döner.
			</p>
			<Code language="text" title="akış" code={samples.diagram.tr} />
			<p>
				İlk girişte kullanıcı <strong>oluşturulur</strong>; sonraki girişler aynı kullanıcıyı yeniden bulur.
			</p>

			<H2 id="supported-providers">
				Desteklenen sağlayıcılar
			</H2>
			<Table
				head={[<code>type</code>, "İstemcinin gönderdiği", "ErtisAuth'un doğrulama şekli"]}
				rows={[
					[<code>Google</code>, "Google ID token'ı", "Token'ın imzasını ve audience değerini Google ile doğrular"],
					[<code>Facebook</code>, "Facebook access token'ı", "Token'ı Facebook Graph API'sine sorar ve profili oradan okur"],
					[<>Limited Login ile <code>Facebook</code></>, "Limited Login JWT'si", "JWT'yi Facebook'un anahtarlarıyla doğrular"],
					[<code>Microsoft</code>, "Microsoft Graph için bir Microsoft access token'ı", "Token ile profili Microsoft Graph'tan okur"],
					[<code>Apple</code>, "Web'de Sign in with Apple'ın authorization code'u", "Kodu Apple ile değiştirir ve kimliği Apple'ın ID token'ından okur"],
					[<code>AppleNative</code>, "Yerel bir iOS/macOS uygulamasında Sign in with Apple'ın authorization code'u", <><code>Apple</code> ile aynı; client id olarak uygulamanın bundle id&apos;si kullanılır</>],
				]} />
			<p>
				Kimlik (sağlayıcıdaki kullanıcı id&apos;si, e-posta adresi) her zaman ErtisAuth&apos;un <strong>sağlayıcıdan</strong> aldığı veriden alınır; istemcinin iddia ettiğinden asla alınmaz. İstemcinin gönderdiği adlar yalnızca sağlayıcının bunları yalnızca istemciyle paylaştığı durumlarda kullanılır (Apple kullanıcının adını yalnızca bir kez, uygulamaya gönderir).
			</p>

			<H2 id="the-provider-object">
				Sağlayıcı nesnesi
			</H2>
			<Code language="json" code={samples.provider} />
			<Table
				head={["Alan", "Zorunlu", "Açıklama"]}
				rows={[
					[<code>type</code>, "evet", <><code>Google</code>, <code>Facebook</code>, <code>Microsoft</code>, <code>Apple</code> ya da <code>AppleNative</code>. Sonradan değiştirilemez.</>],
					[<code>name</code>, "hayır", "Görünen ad. Varsayılan olarak tip."],
					[<code>slug</code>, "hayır", <>Membership içinde benzersizdir; varsayılan olarak ad. <strong>Sonradan değiştirilemez</strong>: sağlayıcının giriş URL&apos;sidir (<code>/oauth/{"{slug}"}/login</code>) ve kullanıcıların bağlı hesaplarında saklanır.</>],
					[<code>description</code>, "hayır", ""],
					[<code>isActive</code>, "hayır", <>Aktif olmayan sağlayıcılar girişleri reddeder (<code>403 ProviderIsDisable</code>). Varsayılan olarak <code>false</code>.</>],
					[<code>defaultRole</code>, "aktifse", "Bu sağlayıcının oluşturduğu kullanıcılara verilen rolün slug'ı."],
					[<code>defaultUserType</code>, "aktifse", "Bu sağlayıcının oluşturduğu kullanıcılara verilen kullanıcı tipinin slug'ı."],
					[<code>appClientId</code>, "aktifse", <>Uygulamanızın sağlayıcıdaki client id&apos;si: Google OAuth client id&apos;si, Facebook app id&apos;si, Microsoft application (client) id&apos;si ya da Apple Services ID (<code>Apple</code>) / bundle id (<code>AppleNative</code>).</>],
					[<code>tenantId</code>, "hayır", "Microsoft: Microsoft Entra tenant id'niz."],
					[<><code>teamId</code>, <code>privateKeyId</code>, <code>privateKey</code></>, "Apple tipleri", <>Apple Developer team id&apos;niz, bir <em>Sign in with Apple</em> anahtarının key id&apos;si ve anahtarın kendisi (<code>.p8</code> dosyasının içeriği).</>],
					[<code>redirectUri</code>, "Apple tipleri", "Services ID'niz için kayıtlı redirect URI; istemcinin kullandığıyla aynı."],
					[<code>trust_email</code>, "hayır", <>Bkz. <a href="#linking-to-existing-accounts">Hesap bağlama</a>. Varsayılan olarak <code>false</code>.</>],
				]} />
			<p>
				<strong>Aynı tipte birden fazla sağlayıcı</strong> oluşturabilirsiniz; örneğin her uygulama için kendi client id&apos;si ve kendi slug&apos;ı olan bir Google sağlayıcısı.
			</p>
			<p>
				Varsayılan kullanıcı tipi, sağlayıcının doldurduğu alanlara (<code>firstname</code>, <code>lastname</code>, <code>email_address</code>, <code>username</code>) izin vermelidir. Kullanıcı tipi <code>avatar</code> adında bir <code>object</code> alanı tanımlıyorsa sağlayıcının profil resmi URL&apos;si <code>avatar.url</code> alanında saklanır.
			</p>

			<H2 id="signing-in">
				Giriş yapma
			</H2>
			<Code language="http" code={samples.signIn} />
			<Table
				head={["Header", "Zorunlu", "Açıklama"]}
				rows={[
					[<code>X-Ertis-Alias</code>, "evet", "Membership id'si"],
					[<><code>X-IpAddress</code>, <code>X-UserAgent</code></>, "hayır", <><DocLink to="authentication" hash="sign-in">Şifreyle girişte</DocLink> olduğu gibi oturumla birlikte saklanır</>],
				]} />
			<p>
				Token gerekmez. Gövde, sağlayıcının tipine göre değişir.
			</p>

			<H3 id="google">
				Google
			</H3>
			<Code language="json" code={samples.google} />
			<p>
				ID token, sağlayıcının <code>appClientId</code> değeri için üretilmiş olmalı ve kullanıcının e-postasını ve adını içermelidir: <code>openid email profile</code> scope&apos;larını isteyin. Bunları içermeyen bir token <code>401 ProviderProfileIncomplete</code> döner.
			</p>

			<H3 id="facebook">
				Facebook
			</H3>
			<Code language="json" code={samples.facebook} />
			<p>
				<code>appId</code>, sağlayıcının <code>appClientId</code> değeri olmalıdır. Gövdede <code>id</code>, <code>first_name</code>, <code>email</code> ve <code>accessToken</code> zorunludur; ama ErtisAuth&apos;un kullandığı kimlik ve e-posta adresi access token ile Facebook&apos;tan okunur. <strong>Facebook Limited Login</strong> (iOS) için URL&apos;ye <code>?limited_flow=true</code> ekleyin ve Limited Login authentication token&apos;ını <code>accessToken</code> olarak gönderin.
			</p>

			<H3 id="microsoft">
				Microsoft
			</H3>
			<Code language="json" code={samples.microsoft} />
			<p>
				Access token, Microsoft Graph için geçerli olmalıdır (<code>User.Read</code>).
			</p>

			<H3 id="apple-and-applenative">
				Apple ve AppleNative
			</H3>
			<Code language="json" code={samples.apple} />
			<p>
				Bu, Sign in with Apple&apos;ın olduğu gibi gönderilen yanıtıdır. <code>user</code> yalnızca kullanıcının ilk girişinde, Apple adı uygulamayla paylaştığında bulunur; elinizdeyse gönderin. ErtisAuth <code>code</code> değerini Apple ile değiştirir; bu yüzden bir kod yalnızca bir kez kullanılabilir ve birkaç dakika içinde süresi dolar.
			</p>

			<H3 id="response">
				Yanıt
			</H3>
			<p>
				<DocLink to="authentication" hash="sign-in">Şifreyle girişte</DocLink> olduğu gibi bir ErtisAuth token çiftiyle <strong><code>201 Created</code></strong>.
			</p>

			<H3 id="errors">
				Hatalar
			</H3>
			<Table
				head={["Durum", "Kod", "Ne zaman"]}
				rows={[
					[<code>400</code>, <code>MembershipIdRequired</code>, <><code>X-Ertis-Alias</code> eksik</>],
					[<code>400</code>, <code>InvalidProviderLoginRequest</code>, "Gövde, sağlayıcının tipi için geçerli bir giriş sonucu değil"],
					[<code>401</code>, <code>Unauthorized</code>, "Sağlayıcı token'ı ya da kodu kabul etmedi"],
					[<code>401</code>, <code>ProviderProfileIncomplete</code>, "Sağlayıcı profilinde e-posta adresi ya da ad eksik"],
					[<code>401</code>, <code>UserInactive</code>, "Eşleşen kullanıcı aktif değil ya da dondurulmuş"],
					[<code>403</code>, <code>ProviderNotConfigured</code>, "Bu slug'a sahip sağlayıcı yok"],
					[<code>403</code>, <code>ProviderIsDisable</code>, "Sağlayıcı aktif değil"],
					[<code>403</code>, <code>UntrustedProvider</code>, "İstekteki client id, sağlayıcının client id'si değil"],
					[<code>409</code>, <code>ProviderEmailNotTrusted</code>, "Aynı e-postaya sahip bir kullanıcı var ve e-postaya güvenilemiyor (aşağıya bakın)"],
					[<code>501</code>, <code>ProviderNotConfiguredCorrectly</code>, "Sağlayıcının yapılandırması eksik ya da hatalı (ör. okunamayan bir Apple anahtarı)"],
					[<code>503</code>, <code>ProviderUnavailable</code>, "Sağlayıcıya ulaşılamadı; daha sonra tekrar deneyin"],
				]} />

			<H2 id="how-users-are-matched">
				Kullanıcılar nasıl eşleştirilir
			</H2>
			<ol>
				<li>
					<strong>Bağlı hesapla.</strong> Her kullanıcı giriş yaptığı hesapları <code>connected_accounts</code> alanında tutar:
					<Code language="json" code={samples.connectedAccounts} />
					Bir giriş, bağlı hesabı aynı sağlayıcı tipine ve aynı sağlayıcı kullanıcı id&apos;sine sahip kullanıcıyı bulur.
				</li>
				<li>
					<strong>E-posta adresiyle.</strong> Hiçbir bağlı hesap eşleşmezse ErtisAuth membership içinde aynı e-posta adresine sahip bir kullanıcı arar ve sağlayıcı hesabını ona bağlar; aşağıya bakın.
				</li>
				<li>
					<strong>Kayıt.</strong> Hiçbir kullanıcı eşleşmezse sağlayıcının <code>defaultRole</code> ve <code>defaultUserType</code> değerleriyle, sağlayıcıdan gelen ad ve e-postayla, <code>username</code> olarak e-posta adresiyle ve <code>source_provider</code> alanı sağlayıcının tipi olacak şekilde yeni bir kullanıcı oluşturulur. Bu kullanıcının şifresi yoktur ve sağlayıcı üzerinden giriş yapar.
				</li>
			</ol>
			<p>
				Her giriş bir <code>TokenGenerated</code> olayı kaydeder; kayıt ayrıca <code>UserCreated</code> kaydeder.
			</p>

			<H3 id="linking-to-existing-accounts">
				Mevcut hesaplara bağlama
			</H3>
			<p>
				Bir sağlayıcı hesabını e-posta adresiyle mevcut bir kullanıcıya bağlamak, ancak sağlayıcı kullanıcının o adrese sahip olduğunu <strong>garanti ediyorsa</strong> güvenlidir. Aksi halde herkes başka birinin e-posta adresiyle bir sağlayıcı hesabı açıp onun ErtisAuth hesabını ele geçirebilirdi.
			</p>
			<Table
				head={["Sağlayıcı", "E-postayla bağlanır"]}
				rows={[
					["Google", "Google e-postayı doğrulanmış olarak bildirdiğinde"],
					["Apple, AppleNative", "Apple e-postayı doğrulanmış olarak bildirdiğinde"],
					["Facebook", <>yalnızca sağlayıcıda <code>trust_email: true</code> olduğunda</>],
					["Microsoft", <>yalnızca sağlayıcıda <code>trust_email: true</code> olduğunda</>],
				]} />
			<p>
				Aynı e-posta adresine sahip mevcut bir kullanıcı varsa ve e-postaya güvenilemiyorsa giriş <code>409 ProviderEmailNotTrusted</code> ile reddedilir. Kullanıcı şifresiyle giriş yapabilir; ardından hesabı bağlamasına izin verebilirsiniz.
			</p>
			<Callout type="warning">
				<code>trust_email</code> değerini yalnızca sağlayıcının e-posta adresini doğrulamamış olabileceğini kabul ediyorsanız <code>true</code> yapın. Microsoft&apos;ta <code>mail</code> özniteliğini kullanıcının kurumu yönetir ve Microsoft tarafından doğrulanmaz.
			</Callout>

			<H3 id="account-activation">
				Hesap aktivasyonu
			</H3>
			<p>
				Membership <DocLink to="account-recovery" hash="account-activation">aktivasyon</DocLink> istiyorsa, sağlayıcıyla kayıt olan kullanıcılar da diğer kullanıcılar gibi aktif olmadan oluşturulur ve hook kuruluysa aktivasyon e-postasını alır.
			</p>

			<H2 id="signing-out">
				Çıkış yapma
			</H2>
			<p>
				Bir ErtisAuth token&apos;ını <DocLink to="authentication" hash="sign-out">iptal etmek</DocLink>, sağlayıcı destekliyorsa kullanıcının bağlı hesabıyla birlikte saklanan sağlayıcı token&apos;ını da iptal eder.
			</p>

			<H2 id="managing-providers">
				Sağlayıcıları yönetme
			</H2>
			<p>
				Tüm route&apos;lar <code>/memberships/{"{membershipId}"}</code> altındadır.
			</p>
			<Table
				head={["Metot", "Route", "Açıklama", "Yetki"]}
				rows={[
					[<code>GET</code>, <code>/providers/{"{id}"}</code>, "Bir sağlayıcıyı alma (id ya da slug)", <code>providers.read.{"{id}"}</code>],
					[<code>GET</code>, <code>/providers</code>, "Membership'in sağlayıcılarını listeleme", <code>providers.read</code>],
					[<code>GET</code>, <code>/providers/active-providers</code>, "Aktif sağlayıcıların herkese açık ayarları", "yok"],
					[<code>POST</code>, <code>/providers</code>, "Sağlayıcı oluşturma", <code>providers.create</code>],
					[<code>PUT</code>, <code>/providers/{"{id}"}</code>, "Sağlayıcı güncelleme", <code>providers.update.{"{id}"}</code>],
					[<code>DELETE</code>, <code>/providers/{"{id}"}</code>, "Sağlayıcı silme", <code>providers.delete.{"{id}"}</code>],
				]} />

			<H3 id="active-providers">
				Aktif sağlayıcılar
			</H3>
			<p>
				<code>GET /memberships/{"{membershipId}"}/providers/active-providers</code> herkese açıktır; böylece giriş sayfaları doğru butonları gösterebilir. Yalnızca herkese açık ayarları döner:
			</p>
			<Code language="json" code={samples.activeProviders} />

			<H3 id="create-a-provider">
				Sağlayıcı oluşturma
			</H3>
			<Code language="shell" code={samples.create} />
			<p>
				<strong>Yanıt <code>201 Created</code></strong>: sağlayıcı.
			</p>
			<Table
				head={["Hata", "Ne zaman"]}
				rows={[
					[<><code>400 ProviderTypeRequired</code>, <code>400 UnknownProvider</code>, <code>400 UnsupportedProvider</code></>, <><code>type</code> eksik ya da bilinmiyor</>],
					[<code>400 ModelValidationError</code>, "Aktif bir sağlayıcıda zorunlu bir ayar eksik"],
					[<code>409 ProviderAlreadyExists</code>, "Slug zaten kullanılıyor"],
				]} />

			<H3 id="update-a-provider">
				Sağlayıcı güncelleme
			</H3>
			<Code language="http" code={samples.update} />
			<p>
				Gönderilmeyen alanlar mevcut değerlerini korur. <code>type</code> değişemez; farklı bir <code>slug</code> <code>400 ProviderSlugCannotBeChanged</code> döner. Hiçbir değişiklik içermeyen bir güncelleme <code>409 IdenticalDocumentError</code> döner.
			</p>

			<H3 id="delete-a-provider">
				Sağlayıcı silme
			</H3>
			<Code language="http" code={samples.remove} />
			<p>
				<strong>Yanıt <code>204 No Content</code></strong>. Sağlayıcının oluşturduğu kullanıcılar hesaplarını korur.
			</p>

			<H2 id="events">
				Olaylar
			</H2>
			<p>
				<code>ProviderCreated</code>, <code>ProviderUpdated</code> ve <code>ProviderDeleted</code>. Bkz. <DocLink to="events">Olaylar</DocLink>.
			</p>
		</>
	)
}
