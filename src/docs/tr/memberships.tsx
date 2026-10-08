import * as samples from "../samples/memberships"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Memberships() {
	return (
		<>
			<p>
				Membership, izole bir kiracıdır: kullanıcıların, rollerin, uygulamaların ve diğer tüm kaynakların sahibidir ve kullanıcılarının kimlik doğrulama ayarlarını tutar. Bkz. <DocLink to="core-concepts" hash="membership">Temel Kavramlar</DocLink>.
			</p>
			<p>
				İlk membership <DocLink to="getting-started" hash="3-set-up-the-installation">kurulum</DocLink> sırasında oluşturulur. Sonraki membership&apos;ler bu API ile oluşturulur.
			</p>

			<H2 id="the-membership-object">
				Membership nesnesi
			</H2>
			<Code language="json" code={samples.membership} />
			<Table
				head={["Alan", "Zorunlu", "Açıklama"]}
				rows={[
					[<code>name</code>, "evet", <>Görünen ad. Aynı zamanda token&apos;ların <code>iss</code> claim&apos;idir.</>],
					[<code>slug</code>, "hayır", <>URL dostu ad; kurulum içinde benzersizdir. Verilmezse addan türetilir. Aynı zamanda token&apos;ların <code>aud</code> claim&apos;idir.</>],
					[<code>expires_in</code>, "evet", "Access token ömrü, saniye cinsinden. 0'dan büyük olmalıdır."],
					[<code>refresh_token_expires_in</code>, "evet", "Refresh token ömrü, saniye cinsinden. 0'dan büyük olmalıdır."],
					[<code>scoped_token_expires_in</code>, "hayır", <><DocLink to="authentication" hash="scoped-tokens">Scoped token</DocLink> ömrü, saniye cinsinden. 0 ya da verilmezse 12 saat.</>],
					[<code>reset_password_token_expires_in</code>, "hayır", "Parola sıfırlama token'larının ömrü, saniye cinsinden. Verilmezse 2 saat."],
					[<code>secret_key</code>, "evet", "Membership'in tüm token'larının imzalandığı anahtar (HMAC-SHA256). Membership'in encoding'inde en az 32 byte."],
					[<code>hash_algorithm</code>, "evet", "Parola hash algoritması (aşağıya bakın). Varsayılanı yoktur."],
					[<code>encoding</code>, "hayır", <>Parolaları ve anahtarları byte&apos;a çevirmek için kullanılan metin encoding&apos;i. Varsayılan <code>UTF-8</code>.</>],
					[<code>default_language</code>, "hayır", <>Bir <a href="#settings">veritabanı locale&apos;inin</a> ISO 639-1 kodu (ör. <code>en</code>, <code>tr</code>).</>],
					[<code>user_activation</code>, "hayır", <><code>active</code>: yeni kullanıcılar giriş yapabilmek için hesaplarını bir e-postadan etkinleştirmelidir. <code>passive</code> (varsayılan): yeni kullanıcılar hemen aktiftir.</>],
					[<code>code_policy</code>, "hayır", <>Cihaz kodu akışında kullanılan <DocLink to="device-code-flow" hash="code-policies">kod politikasının</DocLink> slug&apos;ı.</>],
					[<code>otp_settings</code>, "hayır", <><DocLink to="account-recovery" hash="one-time-passwords">Tek kullanımlık şifre</DocLink> ayarları. Verildiğinde <code>host</code> zorunludur; <code>policy.max_attempts</code> en az 1 olmalıdır (varsayılan 5).</>],
					[<code>mail_providers</code>, "hayır", <><DocLink to="mail-hooks">Mail hook&apos;ların</DocLink> kullandığı mail sağlayıcıları, aşağıya bakın.</>],
				]} />
			<Callout type="warning">
				<code>secret_key</code> membership&apos;in her token&apos;ını imzalar. Onu bilen herkes herhangi bir kullanıcı için token üretebilir. Değiştirilmesi o ana kadar verilen tüm token&apos;ları geçersiz kılar; her kullanıcının yeniden giriş yapması gerekir.
			</Callout>

			<H3 id="password-hash-algorithms">
				Parola hash algoritmaları
			</H3>
			<Table
				head={["Değer", "Öneri"]}
				rows={[
					[<code>ARGON2ID</code>, <>Yeni membership&apos;ler için <strong>önerilir</strong>.</>],
					[<><code>PBKDF2-SHA512</code>, <code>PBKDF2-SHA256</code></>, "Argon2'nin kabul edilmediği yerlerde (ör. FIPS ortamları) iyi seçeneklerdir."],
					[<><code>SHA2-224</code>, <code>SHA2-256</code>, <code>SHA2-384</code>, <code>SHA2-512</code>, <code>SHA2-512-224</code>, <code>SHA2-512-256</code>, <code>SHA3-224</code>, <code>SHA3-256</code>, <code>SHA3-384</code>, <code>SHA3-512</code></>, "Hızlı hash'ler; mevcut kullanıcı veritabanlarını içe aktarmak için desteklenir. Yeni membership'ler için önerilmez."],
					[<><code>SHA1</code>, <code>MD5</code></>, "Eski algoritmalar; yalnızca eski kullanıcı veritabanlarını içe aktarmak için."],
				]} />
			<p>
				Hızlı hash&apos;ler (SHA, MD5), veritabanınız sızarsa kaba kuvvetle hızla kırılabilir. Başka bir sistemden parola hash&apos;i aktarmıyorsanız <code>ARGON2ID</code>&apos;yi tercih edin.
			</p>
			<p>
				Değerler alt çizgiyle de kabul edilir (<code>SHA2_512</code>).
			</p>

			<H3 id="mail-providers">
				Mail sağlayıcıları
			</H3>
			<p>
				<code>mail_providers</code>, membership&apos;in e-posta gönderebileceği servislerin listesidir. Bir <DocLink to="mail-hooks">mail hook</DocLink> bunlardan birine <code>slug</code>&apos;ıyla başvurur.
			</p>
			<Table
				head={[<code>type</code>, "Alanlar", "Gönderim"]}
				rows={[
					[<code>SmtpServer</code>, <><code>name</code>, <code>slug</code>, <code>host</code>, <code>port</code>, <code>tls_enabled</code>, <code>username</code>, <code>password</code></>, "ErtisAuth HTML'i oluşturur ve SMTP üzerinden gönderir"],
					[<code>SendGrid</code>, <><code>name</code>, <code>slug</code>, <code>apiKey</code></>, "ErtisAuth HTML'i oluşturur ve SendGrid API'siyle gönderir"],
					[<code>MailChimp</code>, <><code>name</code>, <code>slug</code>, <code>apiKey</code></>, <>Mailchimp Transactional&apos;da (Mandrill) saklanan bir şablon gönderilir; bkz. <DocLink to="mail-hooks" hash="mailchimp-templates">Mail Hook&apos;lar</DocLink></>],
				]} />
			<Code language="json" code={samples.mailProviders} />
			<p>
				<code>type</code> büyük/küçük harfe duyarlıdır.
			</p>
			<Callout>
				bir membership&apos;in yanıtı, secret key&apos;ini ve mail sağlayıcılarının kimlik bilgilerini içerir. <code>memberships.read</code> yetkisini yalnızca kurulumun operatörlerine verin.
			</Callout>

			<H2 id="endpoints">
				Endpoint&apos;ler
			</H2>
			<Table
				head={["Metot", "Route", "Yetki"]}
				rows={[
					[<code>GET</code>, <code>{"/memberships/{id}"}</code>, <code>{"memberships.read.{id}"}</code>],
					[<code>GET</code>, <code>/memberships</code>, <code>memberships.read</code>],
					[<code>POST</code>, <code>/memberships/_query</code>, <code>memberships.read</code>],
					[<code>GET</code>, <code>/memberships/search?keyword=</code>, <code>memberships.read</code>],
					[<code>POST</code>, <code>/memberships</code>, <code>memberships.create</code>],
					[<code>PUT</code>, <code>{"/memberships/{id}"}</code>, <code>{"memberships.update.{id}"}</code>],
					[<code>DELETE</code>, <code>{"/memberships/{id}"}</code>, <code>{"memberships.delete.{id}"}</code>],
					[<code>GET</code>, <code>/memberships/settings</code>, <code>memberships.read</code>],
					[<code>GET</code>, <code>/memberships/settings/encodings</code>, <code>memberships.read</code>],
					[<code>GET</code>, <code>/memberships/settings/encodings/default</code>, <code>memberships.read</code>],
					[<code>GET</code>, <code>/memberships/settings/hash-algorithms</code>, <code>memberships.read</code>],
					[<code>GET</code>, <code>/memberships/settings/hash-algorithms/default</code>, <code>memberships.read</code>],
					[<code>GET</code>, <code>/memberships/settings/db-locales</code>, <code>memberships.read</code>],
					[<code>GET</code>, <code>/memberships/settings/db-locales/default</code>, <code>memberships.read</code>],
				]} />
			<p>
				Membership route&apos;ları kurulum genelidir: çağıranın token&apos;ının membership&apos;ine bağlı değildir.
			</p>

			<H3 id="get-a-membership">
				Membership getirme
			</H3>
			<Code language="http" code={samples.get} />
			<p>
				<code>{"{id}"}</code> id ya da slug olabilir. Membership yoksa <code>404 MembershipNotFound</code> döner.
			</p>

			<H3 id="list-query-and-search">
				Listeleme, sorgulama ve arama
			</H3>
			<p>
				<code>GET /memberships</code>, <code>POST /memberships/_query</code> ve <code>GET /memberships/search?keyword=</code>, <DocLink to="api-conventions" hash="listing-resources">API Kuralları</DocLink> sayfasında anlatıldığı gibi çalışır.
			</p>

			<H3 id="create-a-membership">
				Membership oluşturma
			</H3>
			<Code language="shell" code={samples.create} />
			<p>
				Secret key&apos;i güvenli bir rastgele üreticiyle oluşturun, örneğin <code>openssl rand -base64 48</code>.
			</p>
			<p>
				<strong>Yanıt <code>201 Created</code></strong>: membership.
			</p>
			<p>
				Yeni membership boştur. Ona erişebilen bir token&apos;la, endpoint&apos;leri üzerinden bir <code>admin</code> rolü, bir kullanıcı tipi ve ilk kullanıcıları oluşturun; tamamen yeni bir kiracı için ise ayrı bir kurulum ve <DocLink to="getting-started">kurulum adımlarını</DocLink> kullanın.
			</p>
			<Table
				head={["Hata", "Ne zaman"]}
				rows={[
					[<code>400 ModelValidationError</code>, <>Zorunlu bir alan eksik ya da geçersiz; <code>data</code> tüm sorunları listeler</>],
					[<code>409 MembershipAlreadyExists</code>, "Slug kullanımda"],
				]} />

			<H3 id="update-a-membership">
				Membership güncelleme
			</H3>
			<Code language="http" code={samples.update} />
			<p>
				Gövde, oluşturma isteğiyle aynı alanlara sahiptir; güncellenen kayıt route&apos;taki id&apos;dir, gövdedeki <code>_id</code> yok sayılır.
			</p>
			<p>
				Şu alanlar verilmediğinde (ya da boş veya <code>0</code> olduğunda) mevcut değerlerini korur: <code>name</code>, <code>secret_key</code>, <code>hash_algorithm</code>, <code>encoding</code>, <code>expires_in</code> ve <code>refresh_token_expires_in</code>. <strong>Diğer tüm alanlar gönderdiğinizle değiştirilir</strong>: <code>mail_providers</code>, <code>otp_settings</code>, <code>code_policy</code>, <code>user_activation</code>, <code>default_language</code>, <code>scoped_token_expires_in</code> ya da <code>reset_password_token_expires_in</code> gönderilmezse temizlenir. Önce membership&apos;i okuyun ve değişikliklerinizle birlikte geri gönderin.
			</p>
			<Callout type="warning">
				parolalar her zaman membership&apos;in <strong>mevcut</strong> <code>hash_algorithm</code>&apos;iyle doğrulanır ve var olan hash&apos;ler dönüştürülmez. Kullanıcıları olan bir membership&apos;in algoritmasını değiştirmek, tüm parolalarının çalışmamasına yol açar; hepsinin parolasını sıfırlaması gerekir. Algoritmayı membership&apos;i oluştururken seçin.
			</Callout>

			<H3 id="delete-a-membership">
				Membership silme
			</H3>
			<Code language="http" code={samples.remove} />
			<p>
				<code>204 No Content</code> döner. Hâlâ kaynakları (kullanıcılar, roller, uygulamalar…) olan bir membership silinemez: <code>409 MembershipCouldNotDeleted</code>.
			</p>

			<H3 id="settings">
				Ayarlar
			</H3>
			<p>
				<code>GET /memberships/settings</code>, bir membership&apos;in kullanabileceği değerleri tek yanıtta döner:
			</p>
			<Code language="json" code={samples.settings} />
			<p>
				Listeler tek tek de <code>/memberships/settings/encodings</code>, <code>/hash-algorithms</code> ve <code>/db-locales</code> altında, her biri bir <code>/default</code> endpoint&apos;iyle birlikte sunulur. <code>defaultHashAlgorithm</code> önerilen algoritmadır; membership&apos;in varsayılanı yoktur ve her zaman bir algoritma belirtmelidir.
			</p>
		</>
	)
}
