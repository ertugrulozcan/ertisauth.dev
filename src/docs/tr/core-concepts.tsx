import * as samples from "../samples/core-concepts"
import { Code, DocLink, H2, Table } from "@/components/docs/prose"

export default function CoreConcepts() {
	return (
		<>
			<p>
				Bu sayfa ErtisAuth&apos;un yapı taşlarını ve birbirleriyle ilişkilerini tanıtır. Her kavramın tüm ayrıntılarını içeren kendi referans sayfası vardır.
			</p>
			<Code language="text" title="genel bakış" code={samples.tree.tr} />

			<H2 id="membership">
				Membership
			</H2>
			<p>
				<strong>Membership</strong>, Keycloak&apos;taki <em>realm</em> gibi izole bir kiracıdır. Diğer her şey tam olarak bir membership&apos;e aittir ve bir membership&apos;te üretilen token başka bir membership&apos;in kaynaklarına erişemez.
			</p>
			<p>
				Membership ayrıca kullanıcılarının kimlik doğrulamasına ait ayarları da tutar:
			</p>
			<ul>
				<li>
					access, refresh, scoped ve sıfırlama token&apos;larının süreleri,
				</li>
				<li>
					token&apos;ların imzalandığı <strong>gizli anahtar</strong> (secret key),
				</li>
				<li>
					<strong>şifre hash algoritması</strong> ve metin kodlaması,
				</li>
				<li>
					mail sağlayıcıları, aktivasyon politikası, OTP ayarları ve cihaz kodu politikası.
				</li>
			</ul>
			<p>
				Tek bir kurulum, örneğin her ürün ya da her müşteri için bir tane olmak üzere çok sayıda membership barındırabilir. Bkz. <DocLink to="memberships">Membership&apos;ler</DocLink>.
			</p>

			<H2 id="user">
				Kullanıcı
			</H2>
			<p>
				<strong>Kullanıcı</strong>, giriş yapan bir kişidir. Her kullanıcının şunları vardır:
			</p>
			<ul>
				<li>
					membership içinde benzersiz olan bir <code>username</code> ve bir <code>email_address</code> (ikisi de giriş için kullanılabilir),
				</li>
				<li>
					yetkilerinin çoğunu veren bir <code>role</code>,
				</li>
				<li>
					kullanıcının başka hangi alanlara sahip olduğunu belirleyen bir <code>user_type</code>,
				</li>
				<li>
					isteğe bağlı, kendine ait <code>permissions</code> ve <code>forbidden</code> listeleri (UBAC),
				</li>
				<li>
					bir <code>is_active</code> bayrağı: aktif olmayan kullanıcılar giriş yapamaz.
				</li>
			</ul>
			<p>
				Bkz. <DocLink to="users">Kullanıcılar</DocLink>.
			</p>

			<H2 id="user-type">
				Kullanıcı tipi
			</H2>
			<p>
				<strong>Kullanıcı tipi</strong>, bir kullanıcı türünün şemasıdır; örneğin <em>Müşteri</em> ya da <em>Çalışan</em>. Özel alanları (bir telefon numarası, bir doğum tarihi, bir adres listesi…) tipleri ve doğrulama kurallarıyla birlikte tanımlar. Kullanıcı tipleri birbirinden türeyebilir; hepsi en sonunda standart alanları (<code>firstname</code>, <code>lastname</code>, <code>username</code>, <code>email_address</code>, <code>role</code>…) tanımlayan yerleşik <code>base-user</code> tipinden türer.
			</p>
			<p>
				Bkz. <DocLink to="user-types">Kullanıcı Tipleri</DocLink>.
			</p>

			<H2 id="role">
				Rol
			</H2>
			<p>
				<strong>Rol</strong>, birçok kullanıcı ve uygulamanın paylaştığı, isimlendirilmiş bir yetki (<code>permissions</code>) ve yasak (<code>forbidden</code>) kümesidir. Setup, her şeyi yapabilen ayrılmış <code>admin</code> rolünü oluşturur.
			</p>
			<p>
				Bkz. <DocLink to="roles">Roller</DocLink> ve <DocLink to="authorization">Yetkilendirme</DocLink>.
			</p>

			<H2 id="application">
				Uygulama
			</H2>
			<p>
				<strong>Uygulama</strong> bir makine istemcisidir: bir backend servisi, zamanlanmış bir iş, sunucu tarafında çalışan bir web uygulaması. Id&apos;si ve bir secret&apos;tan oluşan bir <strong>Basic token</strong> ile kimliğini doğrular; bir kullanıcı gibi bir rolü ve isteğe bağlı kendi yetkileri vardır.
			</p>
			<p>
				Bkz. <DocLink to="applications">Uygulamalar</DocLink>.
			</p>

			<H2 id="utilizer">
				Utilizer
			</H2>
			<p>
				<em>Utilizer</em>, ErtisAuth&apos;ta <strong>isteği yapan</strong> için kullanılan terimdir: bir kullanıcı (Bearer token ile) ya da bir uygulama (Basic token ile). Olaylar onlara sebep olan utilizer&apos;ı kaydeder ve yetkiler utilizer için değerlendirilir.
			</p>

			<H2 id="tokens">
				Token&apos;lar
			</H2>
			<Table>
				<thead>
					<tr>
						<th>
							Token
						</th>
						<th>
							Kim
						</th>
						<th>
							Biçim
						</th>
						<th>
							Ne için
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							Access token
						</td>
						<td>
							kullanıcılar
						</td>
						<td>
							JWT, <code>Authorization: Bearer …</code>
						</td>
						<td>
							API&apos;yi çağırmak
						</td>
					</tr>
					<tr>
						<td>
							Refresh token
						</td>
						<td>
							kullanıcılar
						</td>
						<td>
							JWT
						</td>
						<td>
							yeni bir access token almak
						</td>
					</tr>
					<tr>
						<td>
							Scoped token
						</td>
						<td>
							kullanıcılar
						</td>
						<td>
							JWT, <code>Authorization: Bearer …</code>
						</td>
						<td>
							bazı yetkilerle sınırlandırılmış bir access token
						</td>
					</tr>
					<tr>
						<td>
							Basic token
						</td>
						<td>
							uygulamalar
						</td>
						<td>
							<code>Authorization: Basic &lt;id&gt;:&lt;secret&gt;</code>
						</td>
						<td>
							API&apos;yi çağırmak
						</td>
					</tr>
					<tr>
						<td>
							Sıfırlama token&apos;ı (reset token)
						</td>
						<td>
							kullanıcılar
						</td>
						<td>
							opak bir dize
						</td>
						<td>
							yeni bir şifre belirlemek
						</td>
					</tr>
					<tr>
						<td>
							Aktivasyon token&apos;ı
						</td>
						<td>
							kullanıcılar
						</td>
						<td>
							opak bir dize
						</td>
						<td>
							bir hesabı aktifleştirmek
						</td>
					</tr>
				</tbody>
			</Table>
			<p>
				Bkz. <DocLink to="authentication">Kimlik Doğrulama</DocLink>.
			</p>

			<H2 id="provider">
				Sağlayıcı
			</H2>
			<p>
				<strong>Sağlayıcı</strong> (provider), harici bir kimlik sağlayıcıyı (Google, Apple, Facebook, Microsoft) bir membership&apos;e bağlar. Onunla giriş yapan kullanıcılar ilk girişlerinde oluşturulur ya da mevcut bir hesaba bağlanır.
			</p>
			<p>
				Bkz. <DocLink to="external-providers">Harici Kimlik Sağlayıcılar</DocLink>.
			</p>

			<H2 id="events-webhooks-and-mail-hooks">
				Olaylar, webhook&apos;lar ve mail hook&apos;lar
			</H2>
			<p>
				İşlemlerin çoğu bir <strong>olay</strong> (event) kaydeder: bir kullanıcı oluşturuldu, bir token üretildi, bir rol güncellendi… Olaylar API üzerinden okunabilir ve şunları tetikler:
			</p>
			<ul>
				<li>
					seçtiğiniz bir URL&apos;ye HTTP isteği gönderen <strong>webhook&apos;lar</strong>,
				</li>
				<li>
					şablonlu bir e-posta gönderen <strong>mail hook&apos;lar</strong>.
				</li>
			</ul>
			<p>
				Bkz. <DocLink to="events">Olaylar</DocLink>, <DocLink to="webhooks">Webhook&apos;lar</DocLink> ve <DocLink to="mail-hooks">Mail Hook&apos;lar</DocLink>.
			</p>

			<H2 id="identifiers-and-slugs">
				Kimlikler ve slug&apos;lar
			</H2>
			<ul>
				<li>
					Her kaynağın bir <code>_id</code>&apos;si vardır (MongoDB ObjectId dizesi).
				</li>
				<li>
					Membership&apos;ler, roller, uygulamalar, kullanıcı tipleri, sağlayıcılar, webhook&apos;lar, mail hook&apos;lar ve kod politikalarının ayrıca bir <strong>slug</strong>&apos;ı vardır: siz belirtmezseniz <code>name</code> alanından türetilen, URL&apos;lerde kullanılabilen bir ad. Slug boşluk içeremez ve rakamla başlayamaz.
				</li>
				<li>
					Bir kaynağa başka bir kaynaktan başvurulduğunda slug kullanılır: bir kullanıcının <code>role</code> ve <code>user_type</code> alanları slug&apos;dır; bir sağlayıcının <code>defaultRole</code> ve <code>defaultUserType</code> alanları da öyle.
				</li>
				<li>
					Membership&apos;lerin, rollerin, uygulamaların, kullanıcı tiplerinin ve sağlayıcıların tek kaynak endpoint&apos;leri id&apos;yi de slug&apos;ı da kabul eder.
				</li>
			</ul>

			<H2 id="the-sys-field">
				<code>sys</code> alanı
			</H2>
			<p>
				Kaynaklar, sunucunun güncel tuttuğu bir <code>sys</code> nesnesi taşır:
			</p>
			<Code language="json" code={samples.sys} />
			<p>
				<code>created_by</code> ve <code>modified_by</code>, değişikliği yapan kullanıcının username&apos;ini ya da uygulamanın slug&apos;ını tutar (setup ya da bir sağlayıcıyla kayıt gibi ErtisAuth&apos;un kendi yaptığı değişikliklerde <code>system</code>). İstek gövdesinde gönderilen bir <code>sys</code> yok sayılır. Tüm tarihler UTC&apos;dir.
			</p>
		</>
	)
}
