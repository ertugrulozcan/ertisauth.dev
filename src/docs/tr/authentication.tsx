import * as samples from "../samples/authentication"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Authentication() {
	return (
		<>
			<p>
				ErtisAuth iki tür çağıranın kimliğini doğrular:
			</p>
			<ul>
				<li>
					<strong>Kullanıcılar</strong> bir username ya da e-posta adresi ve şifreyle (ya da bir <DocLink to="external-providers">harici sağlayıcı</DocLink> üzerinden veya <DocLink to="device-code-flow">cihaz kodu akışıyla</DocLink>) giriş yapar ve bir çift <strong>Bearer</strong> token alır: bir access token ve bir refresh token.
				</li>
				<li>
					<strong>Uygulamalar</strong> her istekte id&apos;leri ve secret&apos;larından oluşan bir <strong>Basic</strong> token gönderir. Giriş yapmaları gereken bir şey yoktur.
				</li>
			</ul>
			<p>
				İkisi de <code>Authorization</code> header&apos;ında gönderilir:
			</p>
			<Code language="http" code={samples.headers} />
			<Callout>
				HTTP Basic kimlik doğrulamasından farklı olarak Basic token base64 ile kodlanmış <strong>değildir</strong>: uygulama id&apos;si ile secret&apos;ın iki nokta üst üsteyle ayrılmış, düz metin halidir. Her zaman HTTPS kullanın.
			</Callout>

			<H2 id="endpoints">
				Endpoint&apos;ler
			</H2>
			<Table
				head={["Metot", "Route", "Açıklama", "Kimlik doğrulama"]}
				rows={[
					[<code>POST</code>, <code>/generate-token</code>, "Giriş yapma ya da scoped token alma", "yok / Bearer"],
					[<><code>GET</code> <code>POST</code></>, <code>/refresh-token</code>, "Refresh token ile yeni bir token çifti alma", "refresh token"],
					[<><code>GET</code> <code>POST</code></>, <code>/verify-token</code>, "Bir token'ı kontrol etme", "herhangi bir token"],
					[<><code>GET</code> <code>POST</code></>, <code>/revoke-token</code>, "Çıkış yapma", "access ya da refresh token"],
					[<code>GET</code>, <><code>/me</code>, <code>/whoami</code></>, "Token'ın sahibini alma", "Bearer / Basic"],
					[<code>POST</code>, <code>/oauth/{"{slug}"}/login</code>, "Harici bir sağlayıcıyla giriş yapma", "yok"],
					[<code>POST</code>, <code>/verify-otp</code>, "Tek kullanımlık şifreyi bir sıfırlama token'ıyla değiştirme", "yok"],
				]} />
			<p>
				Son ikisi <DocLink to="external-providers">Harici Kimlik Sağlayıcılar</DocLink> ve <DocLink to="account-recovery">Hesap Kurtarma</DocLink> sayfalarında anlatılır.
			</p>

			<H2 id="the-tokens">
				Token&apos;lar
			</H2>

			<H3 id="access-token">
				Access token
			</H3>
			<p>
				Membership&apos;in <code>secret_key</code> anahtarıyla <strong>HMAC-SHA256</strong> kullanılarak imzalanmış bir JWT. Claim&apos;leri:
			</p>
			<Table
				head={["Claim", "Değer"]}
				rows={[
					[<code>sub</code>, "Kullanıcının id'si"],
					[<code>prn</code>, "Membership'in id'si"],
					[<code>jti</code>, "Benzersiz bir token id'si"],
					[<code>iss</code>, "Membership'in adı"],
					[<code>aud</code>, "Membership'in slug'ı"],
					[<><code>given_name</code>, <code>family_name</code></>, "Kullanıcının adı ve soyadı"],
					[<code>unique_name</code>, "Username"],
					[<code>email</code>, "E-posta adresi"],
					[<code>scope</code>, "Boşlukla ayrılmış scope'lar (yalnızca scoped token'larda)"],
					[<><code>iat</code>, <code>nbf</code>, <code>exp</code></>, "Üretilme, geçerlilik başlangıcı ve bitiş zamanları"],
				]} />
			<p>
				Geçerlilik süresi membership&apos;in <code>expires_in</code> değeridir (saniye cinsinden).
			</p>
			<p>
				Bu claim&apos;leri okumak için token&apos;ı çözebilirsiniz, ama <strong>bir token&apos;ı yalnızca imzası geçerli diye geçerli saymayın</strong>: bir token süresi dolmadan iptal edilebilir, kullanıcı da devre dışı bırakılabilir. <a href="#verify-a-token"><code>/verify-token</code></a> ya da <code>/me</code> endpoint&apos;ini çağırın veya bunu sizin yerinize yapan <DocLink to="sdk">SDK</DocLink>&apos;yı kullanın.
			</p>

			<H3 id="refresh-token">
				Refresh token
			</H3>
			<p>
				Access token gibi bir JWT&apos;dir; ek olarak bir <code>refresh_token: true</code> claim&apos;i taşır ve membership&apos;in <code>refresh_token_expires_in</code> süresi boyunca geçerlidir. Yalnızca yeni bir token çifti almak için kullanılabilir: access token olarak kullanılırsa <code>401 InvalidToken</code> ile reddedilir.
			</p>

			<H3 id="basic-token">
				Basic token
			</H3>
			<p>
				<code>&lt;application_id&gt;:&lt;secret&gt;</code>. Süresi dolmaz; secret <DocLink to="applications" hash="rotate-the-secret">yenilendiğinde</DocLink> ya da uygulama silindiğinde çalışmaz hale gelir. Her sorun (bilinmeyen uygulama, yanlış secret, bilinmeyen membership) aynı şekilde, <code>401 InvalidToken</code> olarak bildirilir; böylece uygulama id&apos;leri yoklanamaz.
			</p>

			<H2 id="sign-in">
				Giriş yapma
			</H2>
			<Code language="http" code={samples.signInRequest} />
			<Table
				head={["Header", "Zorunlu", "Açıklama"]}
				rows={[
					[<code>X-Ertis-Alias</code>, "evet", <>Membership id&apos;si (<code>Membership</code> ya da <code>MembershipId</code> da çalışır)</>],
					[<code>X-IpAddress</code>, "hayır", "Son kullanıcının IP adresi; oturumla birlikte saklanır"],
					[<code>X-UserAgent</code>, "hayır", "Son kullanıcının user agent'ı; oturumla birlikte saklanır"],
				]} />
			<Code language="json" code={samples.signInBody} />
			<p>
				<code>username</code> alanı username&apos;i de e-posta adresini de kabul eder.
			</p>
			<p>
				<strong>Yanıt <code>201 Created</code></strong>
			</p>
			<Code language="json" code={samples.tokenResponse} />
			<p>
				<code>expires_in</code> ve <code>refresh_token_expires_in</code> saniye cinsindendir ve <code>created_at</code> anından itibaren sayılır.
			</p>
			<p>
				<strong>Hatalar</strong>
			</p>
			<Table
				head={["Durum", "Kod", "Ne zaman"]}
				rows={[
					[<code>400</code>, <code>MembershipIdRequired</code>, <><code>X-Ertis-Alias</code> eksik</>],
					[<code>401</code>, <code>InvalidCredentials</code>, "Bilinmeyen kullanıcı ya da yanlış şifre"],
					[<code>401</code>, <code>UserInactive</code>, "Şifre doğru ama hesap aktif değil (henüz aktifleştirilmemiş ya da dondurulmuş)"],
					[<code>404</code>, <code>MembershipNotFound</code>, "Membership yok"],
				]} />
			<p>
				Kullanıcılarınızı korumak için:
			</p>
			<ul>
				<li>
					bilinmeyen bir kullanıcı ile yanlış bir şifre aynı yanıtı verir ve yaklaşık aynı sürede yanıtlanır; böylece saldırganlar hangi hesapların var olduğunu öğrenemez;
				</li>
				<li>
					hesap durumu (<code>UserInactive</code>) yalnızca doğru şifreyi bilen çağıranlara gösterilir.
				</li>
			</ul>
			<p>
				Başarılı bir giriş, bir <code>TokenGenerated</code> <DocLink to="events">olayı</DocLink> ve bir <DocLink to="sessions">aktif token</DocLink> kaydeder.
			</p>

			<H3 id="signing-in-from-your-backend">
				Backend&apos;inizden giriş yapma
			</H3>
			<p>
				Backend&apos;iniz kullanıcıları onlar adına giriş yaptırıyorsa (sunucu tarafında render edilen bir web uygulaması, bir BFF), oturumların nereden geldiği görünsün diye son kullanıcının bilgilerini iletin:
			</p>
			<Code language="shell" code={samples.signInFromBackend} />

			<H2 id="scoped-tokens">
				Scoped token&apos;lar
			</H2>
			<p>
				Scoped token, kullanıcısının yapabildiklerinin <strong>yalnızca bir kısmını</strong> yapabilen bir access token&apos;dır. Bir token&apos;ı daha az güvenilen bir tarafa verirken kullanın: bir tarayıcı eklentisi, üçüncü taraf bir entegrasyon, kısa ömürlü bir iş.
			</p>
			<p>
				Kimlik bilgisi göndermeden, geçerli bir access token ve <code>scopes</code> listesiyle isteyin:
			</p>
			<Code language="shell" code={samples.scopedTokenRequest} />
			<p>
				<strong>Yanıt <code>201 Created</code></strong>
			</p>
			<Code language="json" code={samples.scopedTokenResponse} />
			<p>
				Kurallar:
			</p>
			<ul>
				<li>
					Scope&apos;lar <DocLink to="authorization" hash="permission-expressions">yetki biçimini</DocLink> kullanır (<code>users.read</code>, <code>*.users.read.*</code>…).
				</li>
				<li>
					Kullanıcı istenen her yetkiye sahip olmalıdır; aksi halde istek <code>400 UserHasNoPermissionForThisScope</code> ile başarısız olur. Geçersiz bir ifade <code>400 InvalidScope</code>, boş bir liste <code>400 ScopeRequired</code> ile başarısız olur.
				</li>
				<li>
					Bir scoped token yalnızca daraltılabilir: bir scoped token, daha az scope&apos;lu yeni bir token isteyebilir, daha fazlasıyla asla.
				</li>
				<li>
					Scoped token ile yapılan bir isteğe hem kullanıcının yetkileri <strong>hem de</strong> token&apos;ın scope&apos;ları izin vermelidir. Scope&apos;lar son kapıdır: kullanıcının sahip olmadığı hiçbir şeyi vermezler.
				</li>
				<li>
					Geçerlilik süresi membership&apos;in <code>scoped_token_expires_in</code> değeridir; ayarlanmamışsa 12 saattir.
				</li>
				<li>
					Refresh token döndürülmez.
				</li>
			</ul>

			<H2 id="refresh-a-token">
				Token yenileme
			</H2>
			<p>
				Access token&apos;ın süresi dolmadan önce refresh token&apos;ı yeni bir token çiftiyle değiştirin.
			</p>
			<Code language="http" code={samples.refreshGet} />
			<p>
				ya da refresh token gövdedeyken:
			</p>
			<Code language="http" code={samples.refreshPost} />
			<Table
				head={["Query parametresi", "Varsayılan", "Açıklama"]}
				rows={[
					[<code>revoke</code>, <code>true</code>, <>Kullanılan refresh token&apos;ı iptal eder; böylece yalnızca bir kez çalışır. Kullanılabilir kalması için <code>revoke=false</code> gönderin.</>],
				]} />
			<p>
				<strong>Yanıt <code>201 Created</code></strong>: giriş yanıtıyla aynı biçimde yeni bir token çifti. Yenilenen token orijinalinin scope&apos;larını korur.
			</p>
			<p>
				<strong>Hatalar</strong>
			</p>
			<Table
				head={["Durum", "Kod", "Ne zaman"]}
				rows={[
					[<code>400</code>, <code>RefreshTokenRequired</code>, "Header'da ya da gövdede token yok"],
					[<code>401</code>, <code>TokenIsNotRefreshable</code>, "Token bir refresh token değil, access token"],
					[<code>401</code>, <code>RefreshTokenWasExpired</code>, "Refresh token'ın süresi dolmuş: kullanıcı yeniden giriş yapmalı"],
					[<code>401</code>, <code>RefreshTokenWasRevoked</code>, "Refresh token zaten kullanılmış ya da iptal edilmiş"],
					[<code>401</code>, <code>UserInactive</code>, "Kullanıcı bu arada devre dışı bırakılmış"],
				]} />
			<Callout>
				yenileme önceki <strong>access</strong> token&apos;ı iptal etmez; o token süresi dolana kadar geçerli kalır. Hemen çalışmaz hale gelmesi gerekiyorsa açıkça iptal edin.
			</Callout>

			<H2 id="verify-a-token">
				Token doğrulama
			</H2>
			<p>
				Bir Bearer ya da Basic token&apos;ı kontrol eder: imza, süre, iptal durumu ve kullanıcısının ya da uygulamasının hâlâ var ve aktif olup olmadığı.
			</p>
			<Code language="http" code={samples.verifyGet} />
			<p>
				ya da
			</p>
			<Code language="http" code={samples.verifyPost} />
			<p>
				Gövdede token, türüyle <strong>birlikte</strong> verilir (<code>Bearer …</code> ya da <code>Basic …</code>).
			</p>
			<p>
				Bir Bearer token için <strong>yanıt <code>200 OK</code></strong>:
			</p>
			<Code language="json" code={samples.verifyResponse} />
			<Table
				head={["Alan", "Açıklama"]}
				rows={[
					[<code>verified</code>, "Token'ın geçerli olup olmadığı"],
					[<code>token_kind</code>, <><code>access_token</code> ya da <code>refresh_token</code></>],
					[<code>remaining_time</code>, "Token'ın süresinin dolmasına kalan saniye"],
				]} />
			<p>
				Bir Basic token için yanıtta yalnızca <code>verified</code> ve <code>token</code> bulunur.
			</p>
			<p>
				Geçersiz bir token sebebiyle birlikte <code>401</code> döner:
			</p>
			<Table
				head={["Kod", "Ne zaman"]}
				rows={[
					[<code>InvalidToken</code>, "Hatalı biçim, yanlış imza, bilinmeyen membership ya da bir sıfırlama/aktivasyon token'ı"],
					[<code>TokenWasExpired</code>, "Süresi dolmuş"],
					[<code>TokenWasRevoked</code>, "İptal edilmiş (çıkış yapıldı, şifre değişti, kullanıcı donduruldu…)"],
					[<code>UserInactive</code>, "Kullanıcı devre dışı bırakılmış"],
				]} />

			<H2 id="get-the-token-owner">
				Token&apos;ın sahibini alma
			</H2>
			<Code language="http" code={samples.me} />
			<p>
				<code>/whoami</code> aynı endpoint&apos;in başka bir adıdır.
			</p>
			<ul>
				<li>
					<strong>Bearer</strong> token ile yanıt, kullanıcı tipinin özel alanları dahil eksiksiz <DocLink to="users">kullanıcıdır</DocLink> (şifre hash&apos;i asla dahil değildir).
				</li>
				<li>
					<strong>Basic</strong> token ile yanıt <DocLink to="applications">uygulamadır</DocLink> (secret&apos;ı asla dahil değildir).
				</li>
			</ul>
			<Code language="json" code={samples.meResponse} />

			<H2 id="sign-out">
				Çıkış yapma
			</H2>
			<p>
				Bir token&apos;ı iptal eder. Bir token çifti birlikte iptal edilir: access token&apos;ı iptal etmek onun refresh token&apos;ını da iptal eder, tersi de geçerlidir.
			</p>
			<Code language="http" code={samples.revokeGet} />
			<p>
				ya da
			</p>
			<Code language="http" code={samples.revokePost} />
			<Table
				head={["Query parametresi", "Varsayılan", "Açıklama"]}
				rows={[
					[<code>logout-all</code>, <code>false</code>, <><code>true</code>, kullanıcının her cihazdaki <strong>tüm</strong> token&apos;larını iptal eder</>],
				]} />
			<p>
				Token iptal edildiyse <strong>yanıt <code>204 No Content</code></strong>; edilemediyse (zaten iptal edilmiş, süresi dolmuş, geçersiz) <code>401</code>.
			</p>
			<p>
				İptal edilen token&apos;lar <DocLink to="sessions" hash="revoked-tokens">Oturumlar</DocLink> sayfasında listelenir ve bir <code>TokenRevoked</code> olayı kaydeder.
			</p>

			<H3 id="other-ways-tokens-get-revoked">
				Token&apos;ların iptal edildiği diğer durumlar
			</H3>
			<Table
				head={["İşlem", "Etki"]}
				rows={[
					[<DocLink to="users" hash="change-a-password">Şifre değiştirme</DocLink>, "Kullanıcının tüm token'ları iptal edilir; kullanıcı kendi şifresini değiştirdiyse bunu yaptığı oturum hariç"],
					[<>Sıfırlama token&apos;ıyla <DocLink to="account-recovery" hash="3-set-the-new-password">yeni şifre belirleme</DocLink></>, "Kullanıcının tüm token'ları iptal edilir"],
					[<DocLink to="users" hash="freeze-a-user">Kullanıcıyı dondurma</DocLink>, "Kullanıcının tüm token'ları iptal edilir ve kullanıcı giriş yapamaz"],
					[<DocLink to="applications" hash="rotate-the-secret">Uygulama secret&apos;ını yenileme</DocLink>, "Eski Basic token hemen çalışmaz hale gelir"],
				]} />

			<H2 id="recommended-client-flow">
				Önerilen istemci akışı
			</H2>
			<ol>
				<li>
					<code>/generate-token</code> ile giriş yapın ve iki token&apos;ı da saklayın.
				</li>
				<li>
					Her istekle access token&apos;ı gönderin.
				</li>
				<li>
					<code>expires_in</code> dolmadan kısa bir süre önce ya da bir istek <code>401 TokenWasExpired</code> döndüğünde <code>/refresh-token</code> endpoint&apos;ini çağırın ve iki token&apos;ı da değiştirin.
				</li>
				<li>
					Yenileme <code>401</code> ile başarısız olursa kullanıcıyı giriş sayfasına gönderin.
				</li>
				<li>
					Çıkışta <code>/revoke-token</code> endpoint&apos;ini çağırın (&quot;her yerden çıkış yap&quot; için <code>logout-all=true</code> ile).
				</li>
			</ol>
		</>
	)
}
