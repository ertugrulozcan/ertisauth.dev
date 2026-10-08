import * as samples from "../samples/api-conventions"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function ApiConventions() {
	return (
		<>
			<p>
				Bu sayfadaki kurallar ErtisAuth API&apos;sinin her endpoint&apos;i için geçerlidir.
			</p>

			<H2 id="base-url-and-routes">
				Temel URL ve route&apos;lar
			</H2>
			<p>
				Bu dokümantasyondaki tüm örnekler temel URL olarak <code>https://auth.example.com</code> kullanır. ErtisAuth route&apos;larını host&apos;un kökünden sunar; onu bir yol öneki altında yayınlıyorsanız (örneğin bir gateway arkasında <code>/api/v1</code>), bu öneki her route&apos;a ekleyin.
			</p>
			<p>
				Route&apos;lar üç gruba ayrılır:
			</p>
			<Table
				head={["Grup", "Route'lar", "Membership'i belirleyen"]}
				rows={[
					[
						"Membership'e bağlı kaynaklar",
						<><code>/memberships/{"{membershipId}"}/users</code>, <code>/roles</code>, <code>/applications</code>, <code>/user-types</code>, <code>/providers</code>, <code>/webhooks</code>, <code>/mailhooks</code>, <code>/events</code>, <code>/code-policies</code>, <code>/codes</code>, <code>/active-tokens</code>, <code>/revoked-tokens</code></>,
						"route",
					],
					[
						"Token endpoint'leri",
						<><code>/generate-token</code>, <code>/refresh-token</code>, <code>/verify-token</code>, <code>/revoke-token</code>, <code>/me</code>, <code>/whoami</code>, <code>/verify-otp</code>, <code>/oauth/{"{slug}"}/login</code></>,
						<><code>X-Ertis-Alias</code> header&apos;ı (yalnızca membership gereken yerlerde)</>,
					],
					[
						"Kurulum geneli",
						<><code>/memberships</code>, <code>/setup</code>, <code>/healthcheck</code>, <code>/ping</code></>,
						"bir membership'e bağlı değil",
					],
				]} />

			<H3 id="membership-isolation">
				Membership izolasyonu
			</H3>
			<p>
				Membership&apos;e bağlı bir route&apos;a yapılan istek, <strong>aynı membership&apos;e ait</strong> bir token ile yapılmalıdır. Başka bir membership&apos;in geçerli bir token&apos;ı, yetkileri ne olursa olsun <code>403 AccessDenied</code> ile reddedilir.
			</p>

			<H2 id="headers">
				Header&apos;lar
			</H2>
			<Table
				head={["Header", "Kullanan", "Açıklama"]}
				rows={[
					[<code>Authorization</code>, "neredeyse tüm endpoint'ler", <>Kullanıcılar için <code>Bearer &lt;access_token&gt;</code>, uygulamalar için <code>Basic &lt;application_id&gt;:&lt;secret&gt;</code>. Şema adında büyük/küçük harf ayrımı yapılmaz.</>],
					[<code>X-Ertis-Alias</code>, "giriş endpoint'leri", <>Membership id&apos;si. Alternatif header adları olarak <code>Membership</code> ve <code>MembershipId</code> da kabul edilir.</>],
					[<code>X-IpAddress</code>, "giriş endpoint'leri", "İsteğe bağlı. Son kullanıcının IP adresi; oturumla birlikte saklanır (istek sizin backend'inizden geliyorsa işe yarar)."],
					[<code>X-UserAgent</code>, "giriş endpoint'leri", "İsteğe bağlı. Son kullanıcının user agent'ı; oturumla birlikte saklanır."],
					[<code>X-Host</code>, "aktivasyon, şifre sıfırlama, OTP", <>E-postalardaki bağlantıların işaret ettiği sayfanın temel URL&apos;si (bkz. <DocLink to="account-recovery">Hesap Kurtarma</DocLink>).</>],
					[<code>X-Setup-Token</code>, <code>/setup</code>, <>Setup token&apos;ı (bkz. <DocLink to="getting-started" hash="3-set-up-the-installation">Başlangıç</DocLink>).</>],
					[<code>Content-Type</code>, "gövdesi olan istekler", <code>application/json</code>],
				]} />

			<H2 id="request-and-response-bodies">
				İstek ve yanıt gövdeleri
			</H2>
			<ul>
				<li>
					Gövdeler JSON&apos;dır. Alan adları çoğu kaynakta <code>snake_case</code>&apos;dir (<code>email_address</code>, <code>expires_in</code>); sağlayıcılar, mail hook&apos;lar ve kullanıcı tiplerinin bayrakları <code>camelCase</code> kullanır (<code>defaultRole</code>, <code>mailSubject</code>, <code>isAbstract</code>). Her referans sayfası tam alan adlarını gösterir.
				</li>
				<li>
					Tarihler UTC cinsinden ISO 8601 dizeleridir.
				</li>
				<li>
					İstemci kabul ediyorsa yanıtlar Brotli ya da Gzip ile sıkıştırılır.
				</li>
			</ul>

			<H2 id="status-codes">
				Durum kodları
			</H2>
			<Table
				head={["Kod", "ErtisAuth'taki anlamı"]}
				rows={[
					[<code>200 OK</code>, "Gövdeli başarılı yanıt. Kısmen başarılı bir toplu silme de bunu döner (aşağıya bakın)."],
					[<code>201 Created</code>, <>Bir kaynak ya da token oluşturuldu. Token&apos;lar her zaman <code>201</code> ile döner.</>],
					[<code>204 No Content</code>, "Gövdesiz başarılı yanıt (silme, çıkış)."],
					[<code>400 Bad Request</code>, "İstek hatalı biçimlendirilmiş ya da doğrulamadan geçemiyor."],
					[<code>401 Unauthorized</code>, <>Token eksik, geçersiz, süresi dolmuş ya da iptal edilmiş; ya da kimlik bilgileri yanlış. Bir <code>WWW-Authenticate</code> header&apos;ıyla gelir.</>],
					[<code>403 Forbidden</code>, "Çağıranın kimliği doğrulandı ama izni yok: eksik yetki, başka bir membership ya da devre dışı bir sağlayıcı."],
					[<code>404 Not Found</code>, "Kaynak bu membership'te yok."],
					[<code>409 Conflict</code>, "Bir tekrar (aynı slug, aynı username…), değişiklik içermeyen bir güncelleme, hâlâ kullanımda olan bir kaynak ya da zaten yapılmış bir setup."],
					[<code>500 Internal Server Error</code>, "Beklenmeyen bir hata. Ayrıntılar yalnızca sunucu log'una yazılır."],
					[<code>501 Not Implemented</code>, "İsteğin ihtiyaç duyduğu bir özellik yapılandırılmamış; ör. mail sağlayıcısı ya da aktivasyon mail hook'u yok."],
					[<code>503 Service Unavailable</code>, "Harici bir sağlayıcıya (Google, Apple…) ulaşılamadı."],
				]} />

			<H2 id="errors">
				Hatalar
			</H2>
			<p>
				Hataların ortak bir biçimi vardır:
			</p>
			<Code language="json" code={samples.error} />
			<p>
				Kodunuzda <code>errorCode</code> alanını kullanın; <code>message</code> insanlar içindir ve değişebilir. Tüm kodlar <DocLink to="error-codes">Hata Kodları</DocLink> sayfasında listelenir.
			</p>
			<p>
				Doğrulama hataları sorunların listesini <code>data</code> alanında taşır:
			</p>
			<Code language="json" code={samples.modelValidationError} />
			<p>
				Bir kullanıcının <DocLink to="user-types">kullanıcı tipi</DocLink> şemasıyla doğrulanan özel alanlarındaki hatalar alanın adını verir:
			</p>
			<Code language="json" code={samples.fieldValidationError} />
			<p>
				Aynı anda birden fazla alan geçersizse hepsi raporlanır:
			</p>
			<Code language="json" code={samples.validationErrors} />
			<p>
				Geçerli bir ObjectId olmayan bir id <code>400 ParameterFormatError</code> döner.
			</p>

			<H2 id="listing-resources">
				Kaynakları listeleme
			</H2>
			<p>
				Liste endpoint&apos;leri (<code>GET /memberships/{"{membershipId}"}/users</code> ve benzerleri) query parametreleriyle sayfalanabilir ve sıralanabilir:
			</p>
			<Table
				head={["Parametre", "Örnek", "Açıklama"]}
				rows={[
					[<code>skip</code>, <code>skip=20</code>, "Atlanacak öğe sayısı. Negatif olamaz."],
					[<code>limit</code>, <code>limit=10</code>, "Dönecek en fazla öğe sayısı. Negatif olamaz."],
					[<code>with_count</code>, <code>with_count=true</code>, <>Eşleşen öğelerin toplam sayısını da <code>count</code> alanında döndürür.</>],
					[<code>sort</code>, <><code>sort=username</code> ya da <code>sort=sys.created_at desc</code></>, <>Sıralanacak alan; isteğe bağlı olarak ardından <code>asc</code> (varsayılan) ya da <code>desc</code>.</>],
				]} />
			<Code language="shell" code={samples.list} />
			<Code language="json" code={samples.listResponse} />
			<p>
				<code>with_count=true</code> olmadan <code>count</code> hesaplanmaz.
			</p>

			<H2 id="querying-resources">
				Kaynakları sorgulama
			</H2>
			<p>
				Kaynakların çoğunda, <code>where</code> alanında bir <a href="https://www.mongodb.com/docs/manual/tutorial/query-documents/">MongoDB sorgusu</a>, <code>select</code> alanında isteğe bağlı bir projeksiyon alan bir <code>POST …/_query</code> endpoint&apos;i vardır:
			</p>
			<Code language="shell" code={samples.query} />
			<ul>
				<li>
					Liste endpoint&apos;lerinin sayfalama ve sıralama parametreleri burada da geçerlidir.
				</li>
				<li>
					<code>select</code>, alanları <code>1</code> ya da <code>true</code> ile dahil eder, <code>0</code> ya da <code>false</code> ile dışarıda bırakır.
				</li>
				<li>
					Membership filtresi her zaman sunucu tarafından eklenir: bir sorgu başka bir membership&apos;in verisini asla okuyamaz.
				</li>
				<li>
					JavaScript operatörleri (<code>$where</code>, <code>$function</code>, <code>$accumulator</code>) <code>400 InvalidQuery</code> ile reddedilir.
				</li>
				<li>
					<code>password_hash</code> gibi gizli alanlar ne döndürülebilir ne de filtrelerde ya da sıralamada kullanılabilir.
				</li>
				<li>
					Kullanıcılarda isteğe bağlı <code>locale</code> query parametresi (ör. <code>locale=tr</code>) sıralamanın collation&apos;ını belirler; böylece adlar o dilde doğru sıralanır.
				</li>
			</ul>

			<H3 id="aggregation">
				Aggregation
			</H3>
			<p>
				Aktif token&apos;lar ayrıca, JSON dizisi olarak <a href="https://www.mongodb.com/docs/manual/core/aggregation-pipeline/">aggregation pipeline</a> aşamaları alan <code>POST …/active-tokens/_aggregate</code> endpoint&apos;ini destekler. Membership filtresi sunucu tarafından ilk aşama olarak eklenir.
			</p>
			<p>
				Yalnızca pipeline&apos;dan geçen dokümanları dönüştüren aşamalara izin verilir: <code>$match</code>, <code>$project</code>, <code>$addFields</code>, <code>$set</code>, <code>$unset</code>, <code>$group</code>, <code>$sort</code>, <code>$limit</code>, <code>$skip</code>, <code>$count</code>, <code>$unwind</code>, <code>$bucket</code>, <code>$bucketAuto</code>, <code>$sortByCount</code>, <code>$replaceRoot</code>, <code>$replaceWith</code>, <code>$sample</code>, <code>$setWindowFields</code> ve <code>$facet</code>. Diğer tüm aşamalar, özellikle başka koleksiyonları okuyan ya da onlara yazanlar (<code>$lookup</code>, <code>$graphLookup</code>, <code>$unionWith</code>, <code>$out</code>, <code>$merge</code>), <code>400 UnsupportedAggregationStage</code> ile reddedilir.
			</p>
			<Code language="shell" code={samples.aggregate} />

			<H2 id="searching-resources">
				Kaynaklarda arama
			</H2>
			<p>
				Kullanıcılar, roller, uygulamalar ve membership&apos;lerde tam metin arama vardır:
			</p>
			<Code language="shell" code={samples.search} />
			<p>
				<code>keyword</code> zorunludur (aksi halde <code>400 SearchKeywordRequired</code>). Sayfalama ve sıralama liste endpoint&apos;lerindeki gibi çalışır.
			</p>

			<H2 id="creating-and-updating">
				Oluşturma ve güncelleme
			</H2>
			<ul>
				<li>
					<code>POST</code> bir kaynak oluşturur ve kaynakla birlikte bir <code>Location</code> header&apos;ı içeren <code>201 Created</code> döner.
				</li>
				<li>
					<code>PUT /{"{id}"}</code> bir kaynağı günceller. Id her zaman route&apos;tan gelir; gövdedeki bir <code>_id</code> yok sayılır.
				</li>
				<li>
					Hiçbir şeyi değiştirmeyen bir güncelleme <code>409 IdenticalDocumentError</code> döner. İstemciniz değişmemiş veri gönderebiliyorsa bunu başarı olarak değerlendirin.
				</li>
				<li>
					Gövdede gönderilen bir <code>sys</code> nesnesi yok sayılır.
				</li>
			</ul>

			<H2 id="bulk-delete">
				Toplu silme
			</H2>
			<p>
				Kullanıcılar, roller, uygulamalar, webhook&apos;lar, mail hook&apos;lar ve kod politikaları, koleksiyon route&apos;una gövdesinde id&apos;lerden oluşan bir JSON dizisi bulunan bir <code>DELETE</code> isteğiyle toplu olarak silinebilir:
			</p>
			<Code language="shell" code={samples.bulkDelete} />
			<Table
				head={["Sonuç", "Yanıt"]}
				rows={[
					["Hepsi silindi", <code>204 No Content</code>],
					["Hiçbiri silinmedi", <code>404 BulkDeleteFailed</code>],
					["Bir kısmı silindi", <><code>BulkDeletePartial</code> hata gövdesiyle <code>200 OK</code></>],
				]} />
			<Callout>
				kısmi bir toplu silme, hata gövdesiyle birlikte <code>200</code> döner. Bir <code>200</code> yanıtını tam başarı saymadan önce <code>errorCode</code> alanını kontrol edin.
			</Callout>
		</>
	)
}
