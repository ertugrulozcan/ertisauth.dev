import * as samples from "../samples/device-code-flow"
import { Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function DeviceCodeFlow() {
	return (
		<>
			<p>
				Cihaz kodu akışı, şifre yazmanın zahmetli olduğu cihazlarda kullanıcıların giriş yapmasını sağlar: akıllı TV&apos;ler, set üstü kutular, kiosk&apos;lar, oyun konsolları, komut satırı araçları. OAuth 2.0 device authorization grant modelini izler (<a href="https://www.rfc-editor.org/rfc/rfc8628">RFC 8628</a>).
			</p>
			<ol>
				<li>
					Cihaz ErtisAuth&apos;tan bir kod ister. İki değer alır: ekranda gösterilecek kısa bir <strong>kullanıcı kodu</strong> (user code) ve kendinde tutacağı uzun bir <strong>cihaz kodu</strong> (device code).
				</li>
				<li>
					Kullanıcı, telefonunda ya da bilgisayarında zaten giriş yapmış olduğu web sitenizi veya uygulamanızı açar ve kullanıcı kodunu girer.
				</li>
				<li>
					Siteniz hangi cihazın istekte bulunduğunu gösterir ve kullanıcının onu <strong>onaylamasına</strong> ya da <strong>reddetmesine</strong> izin verir.
				</li>
				<li>
					Bu arada cihaz koduyla sürekli sorgulama yapan cihaz, o kullanıcı için bir <strong>token çifti</strong> alır.
				</li>
			</ol>
			<Code language="text" title="akış" code={samples.diagram.tr} />
			<p>
				Neden iki kod? Kullanıcı kodunu ekranı görebilen herkes görür; bu yüzden yalnızca isteği tanımlar. Token yalnızca cihazdan hiç çıkmayan cihaz koduyla alınabilir.
			</p>

			<H2 id="code-policies">
				Kod politikaları
			</H2>
			<p>
				Kullanıcı kodlarının biçimini bir <strong>kod politikası</strong> (code policy) belirler; her membership kullandığı politikayı <code>code_policy</code> alanında belirtir.
			</p>
			<Code language="json" code={samples.policy} />
			<Table
				head={["Alan", "Zorunlu", "Açıklama"]}
				rows={[
					[<code>name</code>, "evet", "Görünen ad."],
					[<code>slug</code>, "hayır", <>Verilmezse addan türetilir. Membership&apos;in <code>code_policy</code> alanı bunu gösterir.</>],
					[<code>length</code>, "evet", "Her kullanıcı kodunun karakter sayısı; her karakter kümesi için 5 ile 12 arası."],
					[<><code>contains_letters</code>, <code>contains_digits</code></>, "en az biri", <>Karakter kümesi: harfler, rakamlar ya da ikisi birden. İkisini birden içeren kodlarda kolayca karıştırılan karakterler (<code>0</code>, <code>O</code>, <code>1</code>, <code>I</code>) kullanılmaz.</>],
					[<code>expires_in</code>, "evet", "Bir kodun onaylanıp kullanılabileceği süre, saniye cinsinden; 1 ile 1800 (30 dakika) arası."],
				]} />
			<p>
				Bu sınırların dışındaki bir politika, oluşturulurken ya da güncellenirken <code>400 ModelValidationError</code> ile reddedilir.
			</p>
			<p>
				Uzunluğu ekranı düşünerek seçin: bir TV&apos;de 5 ile 8 karakter rahatça okunur ve yazılır. Kullanıcı kodu tek başına token veremediği için kısa bir kod güvenlidir; daha uzun bir kod çoğunlukla, onay bekleyen başka birinin kodunu tahmin etmeyi zorlaştırır.
			</p>

			<H3 id="endpoints">
				Endpoint&apos;ler
			</H3>
			<p>
				Tüm route&apos;lar <code>/memberships/{"{membershipId}"}</code> altındadır.
			</p>
			<Table
				head={["Metot", "Route", "Yetki"]}
				rows={[
					[<code>GET</code>, <code>/code-policies/{"{id}"}</code>, <code>code-policies.read.{"{id}"}</code>],
					[<code>GET</code>, <code>/code-policies</code>, <code>code-policies.read</code>],
					[<code>POST</code>, <code>/code-policies/_query</code>, <code>code-policies.read</code>],
					[<code>POST</code>, <code>/code-policies</code>, <code>code-policies.create</code>],
					[<code>PUT</code>, <code>/code-policies/{"{id}"}</code>, <code>code-policies.update.{"{id}"}</code>],
					[<code>DELETE</code>, <code>/code-policies/{"{id}"}</code>, <code>code-policies.delete.{"{id}"}</code>],
					[<code>DELETE</code>, <code>/code-policies</code>, <code>code-policies.delete</code>],
				]} />
			<p>
				Membership&apos;in kullandığı bir politika silinemez (<code>409 TokenCodePolicyInUse</code>). Tekrarlanan bir slug <code>409 TokenCodePolicyAlreadyExists</code>, değişiklik içermeyen bir güncelleme <code>409 IdenticalDocumentError</code> döner.
			</p>

			<H3 id="enable-the-flow">
				Akışı açma
			</H3>
			<ol>
				<li>
					Bir politika oluşturun:
					<Code language="shell" code={samples.createPolicy} />
				</li>
				<li>
					<DocLink to="memberships" hash="update-a-membership">Membership&apos;te</DocLink> <code>&quot;code_policy&quot;: &quot;tv-codes&quot;</code> değerini ayarlayın.
				</li>
			</ol>

			<H2 id="token-codes">
				Token kodları
			</H2>
			<p>
				Tüm route&apos;lar <code>/memberships/{"{membershipId}"}</code> altındadır.
			</p>
			<Table
				head={["Metot", "Route", "Açıklama", "Kim çağırır", "Yetki"]}
				rows={[
					[<code>POST</code>, <code>/codes</code>, "Kod üretme", "cihaz (ya da backend'i)", <code>tokens.create</code>],
					[<code>GET</code>, <code>/codes/{"{user_code}"}</code>, "Bir kodun cihazını gösterme", "onay sayfanız", <><code>tokens.create</code>, Bearer token</>],
					[<code>POST</code>, <code>/codes/{"{user_code}"}/approve</code>, "Kodu onaylama", "onay sayfanız", <><code>tokens.create</code>, Bearer token</>],
					[<code>POST</code>, <code>/codes/{"{user_code}"}/deny</code>, "Kodu reddetme", "onay sayfanız", <><code>tokens.create</code>, Bearer token</>],
					[<code>POST</code>, <code>/codes/token</code>, "Cihaz koduyla token alma", "cihaz", "yok"],
				]} />

			<H3 id="1-generate-a-code">
				1. Bir kod üretin
			</H3>
			<Code language="http" code={samples.generate} />
			<p>
				Cihaz bunu backend&apos;iniz üzerinden ya da rolünde yalnızca <code>tokens.create</code> yetkisi olan, cihazlara ayrılmış bir uygulamanın kimlik bilgileriyle çağırır. Bir cihaza gömülen kimlik bilgileri çıkarılabilir; bu yüzden onlara başka hiçbir yetki vermeyin.
			</p>
			<p>
				<code>X-IpAddress</code> ve <code>X-UserAgent</code> cihazı tanımlar; eksiklerse isteğin adresi ve user agent&apos;ı kullanılır. Onaydan önce kullanıcıya gösterilir ve oturumla birlikte saklanır.
			</p>
			<p>
				<strong>Yanıt <code>201 Created</code></strong>
			</p>
			<Code language="json" code={samples.generateResponse} />
			<Table
				head={["Alan", "Kullanımı"]}
				rows={[
					[<code>user_code</code>, <>Onay sayfanızın adresiyle birlikte ekranda gösterin. Okunabilirlik için bölebilirsiniz (<code>K7Q2-XD9M</code>): kullanıcı girerken büyük/küçük harf, tire ve boşluklar yok sayılır.</>],
					[<code>device_code</code>, <>Cihazın belleğinde tutun ve token almak için kullanın. <strong>Yalnızca bu yanıtta döner</strong>; ErtisAuth yalnızca hash&apos;ini saklar. Asla göstermeyin ya da loglamayın.</>],
					[<code>interval</code>, "İki token isteği arasında beklenecek saniye."],
					[<code>expire_time</code>, "Bu zamandan sonra kod kullanılamaz; yenisini isteyin."],
				]} />
			<Table
				head={["Hata", "Ne zaman"]}
				rows={[
					[<code>404 TokenCodePolicyNotFound</code>, <>Membership&apos;in <code>code_policy</code> değeri yok ya da politika mevcut değil</>],
					[<code>503 TokenCodeCouldNotBeGenerated</code>, "Kullanılmayan bir kullanıcı kodu bulunamadı; tekrar deneyin (politikanın çok az olası kodu yoksa pek olası değil)"],
				]} />

			<H3 id="2-show-the-device-to-the-user">
				2. Cihazı kullanıcıya gösterin
			</H3>
			<p>
				Onay sayfanızda giriş yapmış kullanıcı kodu girer. Onaylamadan önce ona neye giriş yapmak üzere olduğunu gösterin:
			</p>
			<Code language="http" code={samples.show} />
			<p>
				<strong>Yanıt <code>200 OK</code></strong>: cihaz kodu olmadan kod; <code>status</code> (<code>pending</code>, <code>approved</code> ya da <code>denied</code>), <code>created_at</code> ve <code>client_info</code> ile birlikte:
			</p>
			<blockquote>
				<strong>203.0.113.42</strong> adresinden, 1 dakika önce istenen <strong>LivingRoomTV/2.4 (Tizen 7.0)</strong> girişini onaylıyor musunuz?
			</blockquote>
			<Table
				head={["Hata", "Ne zaman"]}
				rows={[
					[<code>404 TokenCodeNotFound</code>, "Bilinmeyen ya da süresi dolmuş kod"],
					[<code>400 TokenTypeNotSupported</code>, "Token bir Bearer token değil"],
				]} />
			<p>
				Bu adım kullanıcıları <strong>kod oltalamasına</strong> (code phishing) karşı korur: bir saldırgan kendi cihazında bir kod üretir ve kurbanı bu kodu girmeye kandırır (&quot;ödülünüzü almak için bu kodu girin&quot;). Kullanıcı tanımadığı bir cihaz görürse isteği reddeder.
			</p>

			<H3 id="3-approve-or-deny">
				3. Onaylayın ya da reddedin
			</H3>
			<Code language="http" code={samples.approve} />
			<Code language="http" code={samples.deny} />
			<p>
				Token bir kullanıcının <strong>Bearer</strong> token&apos;ı olmalıdır: cihaz <strong>bu kullanıcı</strong> olarak giriş yapacaktır. Bir uygulamanın Basic token&apos;ı <code>400 TokenTypeNotSupported</code> ile reddedilir. Kullanıcının rolünde <code>tokens.create</code> yetkisi olmalıdır.
			</p>
			<p>
				<strong>Yanıt <code>200 OK</code></strong>: artık <code>approved</code> ya da <code>denied</code> durumundaki kod ve <code>user_id</code> alanında kullanıcının id&apos;si. Bir <code>TokenCodeApproved</code> ya da <code>TokenCodeDenied</code> <DocLink to="events">olayı</DocLink> kaydedilir.
			</p>
			<p>
				Bir kod <strong>yalnızca bir kez</strong> ve yalnızca beklemedeyken onaylanabilir ya da reddedilebilir: iki kişi aynı anda denerse yalnızca biri başarılı olur.
			</p>
			<p>
				<strong>Scoped token ile onaylama.</strong> Onay bir <DocLink to="authentication" hash="scoped-tokens">scoped token</DocLink> ile yapıldığında (scope&apos;ları <code>tokens.create</code> yetkisini kapsamalıdır) cihaz <strong>aynı scope&apos;larla</strong> sınırlı bir token alır: bir cihaz, onu onaylayan oturumdan asla fazlasını alamaz. Böyle bir token membership&apos;in <code>scoped_token_expires_in</code> süresi boyunca (varsayılan olarak 12 saat) geçerlidir ve yenilendiğinde scope&apos;larını korur. Sıradan bir access token ile yapılan onay cihaza sıradan bir token verir.
			</p>
			<Table
				head={["Hata", "Ne zaman"]}
				rows={[
					[<code>400 TokenTypeNotSupported</code>, "Token bir Bearer token değil"],
					[<code>401 TokenCodeExpired</code>, "Kodun süresi dolmuş"],
					[<code>404 TokenCodeNotFound</code>, "Bilinmeyen kod"],
					[<code>409 TokenCodeAlreadyAuthorized</code>, "Kod zaten onaylanmış ya da reddedilmiş"],
				]} />

			<H3 id="4-get-the-token">
				4. Token&apos;ı alın
			</H3>
			<p>
				Cihaz bir token alana ya da kodun süresi dolana kadar her <code>interval</code> saniyede sorgulama yapar:
			</p>
			<Code language="http" code={samples.token} />
			<p>
				Token gerekmez. Cihaz kodu, erişim log&apos;larına düşmesin diye URL&apos;de değil, gövdede gönderilir.
			</p>
			<Table
				head={["Yanıt", "Anlamı", "Cihazın yapacağı"]}
				rows={[
					[<>Token çiftiyle <code>201 Created</code></>, "Onaylandı", "Token'ları saklar ve sorgulamayı bırakır"],
					[<code>401 UnauthorizedTokenCode</code>, "Henüz onaylanmadı", <><code>interval</code> saniye bekler ve yeniden sorgular</>],
					[<code>400 TokenCodeSlowDown</code>, <><code>interval</code> saniye geçmeden sorgulandı</>, "Bir sonraki sorgudan önce daha uzun bekler"],
					[<code>401 TokenCodeDenied</code>, "Kullanıcı isteği reddetti", "Durur; bir mesaj gösterir, yeni bir kod önerir"],
					[<code>401 TokenCodeExpired</code>, "Kodun süresi doldu", "Yeni bir kod ister"],
					[<code>401 UserInactive</code>, "Onaylayan kullanıcı bu arada devre dışı bırakıldı", "Yeni bir kod ister"],
					[<code>401 InvalidToken</code>, "Bilinmeyen ya da zaten kullanılmış cihaz kodu", "Yeni bir kod ister"],
				]} />
			<ul>
				<li>
					Token çifti <strong>cihaz onu aldığında</strong> üretilir; bu yüzden geçerlilik süresi o anda başlar ve <strong>bir kez</strong> verilir: kod o anda silinir.
				</li>
				<li>
					Oturum cihazın IP adresini ve user agent&apos;ını kaydeder; böylece kullanıcının <DocLink to="sessions">oturumları</DocLink> arasında kolayca tanınır.
				</li>
				<li>
					Bundan sonra cihaz token&apos;ını diğer istemciler gibi <DocLink to="authentication" hash="refresh-a-token">yeniler</DocLink>.
				</li>
			</ul>

			<H2 id="example-device-loop">
				Örnek cihaz döngüsü
			</H2>
			<Code language="javascript" code={samples.deviceLoop} />

			<H2 id="security-notes">
				Güvenlik notları
			</H2>
			<ul>
				<li>
					Kullanıcı kodu bir sır değildir; cihaz kodu ise sırdır. Cihaz kodunu yalnızca bellekte tutun ve HTTPS kullanın.
				</li>
				<li>
					Onaydan önce her zaman cihaz bilgisini gösterin ve kullanıcıların tanımadıkları cihazları reddetmesine izin verin.
				</li>
				<li>
					Cihazların kullandığı kimlik bilgilerine yalnızca <code>tokens.create</code> yetkisi verin.
				</li>
				<li>
					<code>POST /codes</code> ve <code>POST /codes/token</code> endpoint&apos;lerine gateway&apos;inizde rate limiting uygulayın.
				</li>
			</ul>
		</>
	)
}
