import * as samples from "../samples/users"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Users() {
	return (
		<>
			<p>
				Kullanıcılar, uygulamalarınıza giriş yapan kişilerdir. Her kullanıcı bir membership&apos;e aittir, bir <DocLink to="roles">rolü</DocLink> ve bir <DocLink to="user-types">kullanıcı tipi</DocLink> vardır ve kendine ait yetkileri olabilir (bkz. <DocLink to="authorization">Yetkilendirme</DocLink>).
			</p>

			<H2 id="the-user-object">
				Kullanıcı nesnesi
			</H2>
			<Code language="json" code={samples.user} />
			<p>
				Standart alanlar yerleşik <code>base-user</code> tipinden gelir; diğer tüm alanları (yukarıdaki <code>department</code>, <code>phone</code>) kullanıcının <DocLink to="user-types">kullanıcı tipi</DocLink> tanımlar.
			</p>
			<Table
				head={["Alan", "Açıklama"]}
				rows={[
					[<code>username</code>, "Zorunlu, membership içinde benzersiz. Girişte kullanılabilir."],
					[<code>email_address</code>, "Zorunlu, geçerli bir e-posta adresi, membership içinde benzersiz. Girişte kullanılabilir."],
					[<code>firstname</code>, "Zorunlu."],
					[<code>lastname</code>, "İsteğe bağlı."],
					[<code>role</code>, "Zorunlu. Var olan bir rolün slug'ı."],
					[<code>user_type</code>, "Zorunlu. Abstract olmayan bir kullanıcı tipinin slug'ı (ya da adı); her zaman slug olarak saklanır."],
					[<><code>permissions</code>, <code>forbidden</code></>, <>İsteğe bağlı UBAC girdileri (<code>resource.action.object</code>). Bkz. <DocLink to="authorization" hash="ubac-expressions">Yetkilendirme</DocLink>.</>],
					[<code>is_active</code>, <>Kullanıcının giriş yapıp yapamayacağı. Oluşturulurken sunucu tarafından belirlenir (bkz. <DocLink to="account-recovery" hash="account-activation">Aktivasyon</DocLink>).</>],
					[<code>source_provider</code>, <>Kullanıcının nereden geldiği: <code>ErtisAuth</code> ya da kaydolduğu <DocLink to="external-providers">sağlayıcının</DocLink> tipi. Salt okunur.</>],
					[<code>connected_accounts</code>, "Kullanıcıya bağlı harici sağlayıcı hesapları. Salt okunur."],
					[<code>membership_id</code>, "Salt okunur."],
				]} />
			<p>
				Parola hash&apos;i gizli bir alanda saklanır; asla döndürülmez, filtrelenmez ve sıralamada kullanılmaz.
			</p>

			<H2 id="endpoints">
				Endpoint&apos;ler
			</H2>
			<p>
				Tüm route&apos;lar <code>{"/memberships/{membershipId}"}</code> altındadır.
			</p>
			<Table
				head={["Metot", "Route", "Açıklama", "Yetki"]}
				rows={[
					[<code>GET</code>, <code>{"/users/{id}"}</code>, "Kullanıcı getirme", <code>{"users.read.{id}"}</code>],
					[<code>GET</code>, <code>/users</code>, "Kullanıcıları listeleme", <code>users.read</code>],
					[<code>POST</code>, <code>/users/_query</code>, "Kullanıcıları sorgulama", <code>users.read</code>],
					[<code>GET</code>, <code>/users/search?keyword=</code>, "Kullanıcı arama", <code>users.read</code>],
					[<code>POST</code>, <code>/users</code>, "Kullanıcı oluşturma", <code>users.create</code>],
					[<code>PUT</code>, <code>{"/users/{id}"}</code>, "Kullanıcı güncelleme", <code>{"users.update.{id}"}</code>],
					[<code>DELETE</code>, <code>{"/users/{id}"}</code>, "Kullanıcı silme", <code>{"users.delete.{id}"}</code>],
					[<code>DELETE</code>, <code>/users</code>, "Birden fazla kullanıcı silme", <code>users.delete</code>],
					[<code>PUT</code>, <code>{"/users/{id}/change-password"}</code>, "Parola değiştirme", <code>{"users.update.{id}"}</code>],
					[<code>GET</code>, <code>/users/check-password?password=</code>, "Çağıranın kendi parolasını kontrol etme", <code>users.read</code>],
					[<code>GET</code>, <code>{"/users/{id}/activate"}</code>, "Kullanıcıyı etkinleştirme", <code>{"users.update.{id}"}</code>],
					[<code>GET</code>, <code>{"/users/{id}/freeze"}</code>, "Kullanıcıyı dondurma", <code>{"users.update.{id}"}</code>],
					[<code>GET</code>, <code>/users/activation?uat=</code>, "Aktivasyon token'ıyla etkinleştirme", <code>users.update</code>],
					[<code>POST</code>, <code>/users/resend-activation-mail</code>, "Aktivasyon mailini yeniden gönderme", <code>users.create</code>],
					[<code>POST</code>, <code>/users/reset-password</code>, "Parola sıfırlamayı başlatma", <code>users.update</code>],
					[<code>GET</code>, <code>/users/verify-reset-token?token=</code>, "Sıfırlama token'ını kontrol etme", <code>users.read</code>],
					[<code>POST</code>, <code>/users/set-password</code>, "Sıfırlama token'ıyla yeni parola belirleme", <code>users.update</code>],
					[<code>GET</code>, <code>{"/users/{id}/generate-otp"}</code>, "Tek kullanımlık şifre üretme", <code>{"otp.create.{id}"}</code>],
				]} />
			<p>
				Aktivasyon, sıfırlama ve OTP endpoint&apos;leri <DocLink to="account-recovery">Hesap Kurtarma ve Aktivasyon</DocLink> sayfasında anlatılır.
			</p>
			<p>
				Bir kullanıcı, <DocLink to="authorization" hash="changing-privileged-fields">ayrıcalıklı alanlar</DocLink> dışında kendi kaydını her zaman güncelleyebilir (kendi kaydı kuralı).
			</p>

			<H3 id="get-a-user">
				Kullanıcı getirme
			</H3>
			<Code language="http" code={samples.get} />
			<p>
				<strong>Yanıt <code>200 OK</code></strong>: kullanıcı, kullanıcı tipinin özel alanlarıyla birlikte. Kullanıcı yoksa <code>404 UserNotFound</code>.
			</p>

			<H3 id="list-query-and-search-users">
				Kullanıcıları listeleme, sorgulama ve arama
			</H3>
			<Code language="http" code={samples.list} />
			<p>
				Bkz. <DocLink to="api-conventions" hash="listing-resources">API Kuralları</DocLink>. Sorgu endpoint&apos;i, adları bir dilin kurallarına göre sıralamak için <code>locale</code> parametresini de kabul eder (ör. <code>locale=tr</code>). Arama, anahtar kelimeyi büyük/küçük harf ve aksan farkı gözetmeden <code>username</code>, <code>firstname</code>, <code>lastname</code> ve <code>email_address</code> alanlarında arar.
			</p>
			<p>
				E-posta adresiyle kullanıcı bulma:
			</p>
			<Code language="shell" code={samples.queryByEmail} />

			<H3 id="create-a-user">
				Kullanıcı oluşturma
			</H3>
			<Code language="shell" code={samples.create} />
			<ul>
				<li>
					Gövde, miras alınan alanlar dahil <code>user_type</code> şemasına göre doğrulanır. Kullanıcı tipi ek alanlara izin vermiyorsa bilinmeyen alanlar reddedilir.
				</li>
				<li>
					<code>password</code> zorunludur ve en az 6 karakter olmalıdır. Membership&apos;in algoritmasıyla hash&apos;lenir ve asla düz metin olarak saklanmaz.
				</li>
				<li>
					Gövdedeki <code>is_active</code>, <code>source_provider</code> ve <code>connected_accounts</code> yok sayılır: membership <DocLink to="account-recovery" hash="account-activation">aktivasyon</DocLink> gerektiriyorsa kullanıcı pasif oluşturulur ve aktivasyon maili <code>X-Host</code>&apos;taki link adresiyle gönderilir; aksi halde kullanıcı hemen aktiftir.
				</li>
				<li>
					<code>user_type</code> pratikte zorunludur: verilmezse yerleşik <code>base-user</code> tipi kullanılır, o da abstract&apos;tır (<code>400 InheritedTypeIsAbstract</code>).
				</li>
				<li>
					<code>email_address</code> küçük harfe çevrilerek saklanır.
				</li>
			</ul>
			<p>
				<strong>Yanıt <code>201 Created</code></strong>: kullanıcı.
			</p>
			<p>
				Tekrarlanan bir username, e-posta adresi ya da başka bir <DocLink to="user-types" hash="unique-fields">benzersiz alan</DocLink>, alan hatası olarak bildirilir:
			</p>
			<Code language="json" code={samples.duplicateError} />
			<Table
				head={["Hata", "Ne zaman"]}
				rows={[
					[<><code>400 PasswordRequired</code>, <code>400 PasswordMinLengthRuleError</code></>, "Parola eksik ya da çok kısa"],
					[<code>400 RoleRequired</code>, <><code>role</code> eksik</>],
					[<><code>400 FieldValidationException</code>, <code>400 ValidationException</code></>, "Bir alan kullanıcı tipi şemasına uymuyor"],
					[<code>400 ValidationException</code>, "Username, e-posta adresi ya da başka bir benzersiz alan başka bir kullanıcı tarafından kullanılıyor (yukarıya bakın)"],
					[<><code>404 RoleNotFound</code>, <code>404 UserTypeNotFound</code></>, "Bilinmeyen rol ya da kullanıcı tipi"],
					[<code>409 UbacsConflicted</code>, <>Aynı girdi hem <code>permissions</code> hem <code>forbidden</code> içinde</>],
					[<><code>501 NotDefinedAnyMailProvider</code>, <code>501 ActivationMailHookWasNotDefined</code></>, "Aktivasyon gerekli ama mail gönderilemiyor"],
				]} />

			<H3 id="update-a-user">
				Kullanıcı güncelleme
			</H3>
			<Code language="http" code={samples.update} />
			<p>
				Güncellemeler <strong>kısmidir</strong>: gönderdiğiniz alanlar mevcut kullanıcıyla birleştirilir, diğerleri değerlerini korur.
			</p>
			<Code language="shell" code={samples.updateRequest} />
			<ul>
				<li>
					Birleştirilmiş kullanıcı, kullanıcı tipinin şemasına göre doğrulanır.
				</li>
				<li>
					Parola burada değiştirilemez; <a href="#change-a-password">parola değiştirme</a> endpoint&apos;ini kullanın.
				</li>
				<li>
					<code>role</code>, <code>permissions</code>, <code>forbidden</code>, <code>is_active</code> ya da <code>user_type</code> alanlarını değiştirmek, kullanıcılar kendilerini güncellerken bile, kullanıcı üzerinde gerçek bir <code>users.update</code> yetkisi gerektirir (bkz. <DocLink to="authorization" hash="changing-privileged-fields">Yetkilendirme</DocLink>).
				</li>
				<li>
					<code>user_type</code> kullanıcı oluşturulduktan sonra değiştirilemez: başka bir tip gönderilirse <code>400 UserTypeImmutable</code> döner. Bir kullanıcıyı başka bir tipe taşımak için yeni bir kullanıcı oluşturun.
				</li>
			</ul>
			<p>
				<strong>Yanıt <code>200 OK</code></strong>: güncellenmiş kullanıcı. Hiçbir değişiklik içermeyen bir güncelleme <code>409 IdenticalDocumentError</code> döner.
			</p>

			<H3 id="delete-a-user">
				Kullanıcı silme
			</H3>
			<Code language="http" code={samples.remove} />
			<p>
				<strong>Yanıt <code>204 No Content</code></strong> ya da <code>404 UserNotFound</code>. Birden fazla kullanıcı <DocLink to="api-conventions" hash="bulk-delete">toplu silme</DocLink> ile tek seferde silinebilir.
			</p>

			<H3 id="change-a-password">
				Parola değiştirme
			</H3>
			<Code language="http" code={samples.changePassword} />
			<p>
				<strong>Yanıt <code>200 OK</code></strong>.
			</p>
			<p>
				Parola değiştikten sonra kullanıcının <strong>tüm cihazlardaki oturumu kapatılır</strong>: tüm token&apos;ları iptal edilir. Kullanıcılar kendi parolalarını değiştirdiğinde, değişikliği yaptıkları oturum açık kalır. Bu, hesabın ele geçirilmesinin ardından hesabı korur: parolayı değiştirmek saldırganı da dışarı atar.
			</p>
			<p>
				Kullanıcı kendi parolasını kendi kaydı kuralıyla değiştirebilir; başka birinin parolasını değiştirmek o kullanıcı üzerinde <code>users.update</code> yetkisi gerektirir.
			</p>

			<H3 id="check-the-callers-password">
				Çağıranın parolasını kontrol etme
			</H3>
			<p>
				Bir parolanın çağıranın mevcut parolası olup olmadığını sorar; örneğin hassas bir işlemden önce:
			</p>
			<Code language="http" code={samples.checkPassword} />
			<p>
				Eşleşirse <code>200 OK</code>, eşleşmezse <code>401</code> döner.
			</p>
			<Callout>
				parola query string&apos;de gönderilir; proxy&apos;ler ve sunucular bunu erişim log&apos;larına yazabilir. Altyapınızın bu route için query string&apos;leri loglamadığından emin olun.
			</Callout>

			<H3 id="activate-a-user">
				Kullanıcıyı etkinleştirme
			</H3>
			<Code language="http" code={samples.activate} />
			<p>
				Kullanıcıyı aktivasyon maili olmadan etkinleştirir; örneğin bir yönetici tarafından. <strong>Yanıt <code>200 OK</code></strong> ve kullanıcı; zaten aktifse <code>400 UserAlreadyActive</code>.
			</p>

			<H3 id="freeze-a-user">
				Kullanıcıyı dondurma
			</H3>
			<Code language="http" code={samples.freeze} />
			<p>
				Kullanıcıyı pasifleştirir ve <strong>tüm token&apos;larını iptal eder</strong>: her yerde oturumu kapatılır ve yeniden etkinleştirilene kadar giriş yapamaz. Bekleyen aktivasyon linkleri de çalışmaz hale gelir. <strong>Yanıt <code>200 OK</code></strong> ve kullanıcı; zaten pasifse <code>400 UserAlreadyInactive</code>.
			</p>
			<Callout>
				etkinleştirme ve dondurma, veri değiştiren <code>GET</code> istekleridir. Bunları tarayıcıların ya da crawler&apos;ların önceden yükleyebileceği düz linkler olarak sunmayın.
			</Callout>

			<H2 id="events">
				Olaylar
			</H2>
			<Table
				head={["Olay", "Ne zaman"]}
				rows={[
					[<code>UserCreated</code>, "Bir kullanıcı oluşturuldu (sağlayıcıyla kayıt dahil)"],
					[<code>UserUpdated</code>, "Bir kullanıcı güncellendi, etkinleştirildi ya da donduruldu"],
					[<code>UserDeleted</code>, "Bir kullanıcı silindi"],
					[<code>UserPasswordChanged</code>, "Bir parola değiştirildi ya da belirlendi"],
					[<code>UserPasswordReset</code>, "Bir parola sıfırlama başlatıldı"],
				]} />
			<p>
				Bkz. <DocLink to="events">Olaylar</DocLink>.
			</p>
		</>
	)
}
