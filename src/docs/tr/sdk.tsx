import * as samples from "../samples/sdk"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Sdk() {
	return (
		<>
			<p>
				ErtisAuth iki .NET kütüphanesiyle gelir:
			</p>
			<Table
				head={["Paket", "Ne yapar"]}
				rows={[
					[<code>ErtisAuth.Sdk</code>, "ErtisAuth REST API'si için tipli bir istemci: giriş, token'lar, kullanıcılar, roller, uygulamalar, hook'lar…"],
					[<code>ErtisAuth.Sdk.AspNetCore</code>, <><strong>Kendi</strong> ASP.NET Core API&apos;lerinizi attribute&apos;larla, ErtisAuth token&apos;ları ve yetkileriyle korur. <code>ErtisAuth.Sdk</code>&apos;yı içerir.</>],
				]} />
			<p>
				Endpoint&apos;lerini ErtisAuth kullanıcılarının ve uygulamalarının çağırdığı bir ASP.NET Core API&apos;si için <code>ErtisAuth.Sdk.AspNetCore</code>&apos;u kullanın. ErtisAuth&apos;u bir worker&apos;dan, bir console uygulamasından ya da başka bir .NET programından çağırmak için yalnızca <code>ErtisAuth.Sdk</code> yeterlidir. İkisi de .NET 10 hedefler.
			</p>

			<H2 id="quick-start">
				Hızlı başlangıç
			</H2>
			<p>
				Bir ASP.NET Core API&apos;sini dört adımda koruyun.
			</p>
			<p>
				<strong>1.</strong> Paketi ekleyin:
			</p>
			<Code language="shell" code={samples.install} />
			<p>
				<strong>2.</strong> Ayarları <code>appsettings.json</code> dosyasına ekleyin:
			</p>
			<Code language="json" code={samples.quickSettings} />
			<p>
				<strong>3.</strong> SDK&apos;yı <code>Program.cs</code> içinde kaydedin:
			</p>
			<Code language="csharp" code={samples.setup} />
			<p>
				<strong>4.</strong> Bir controller&apos;ı koruyun:
			</p>
			<Code language="csharp" code={samples.quickController} />
			<p>
				<code>GET /orders</code> endpoint&apos;ini bir ErtisAuth kullanıcısının access token&apos;ıyla (<code>Authorization: Bearer &lt;access_token&gt;</code>) ya da bir uygulamanın Basic token&apos;ıyla çağırın:
			</p>
			<Table
				head={["İstek", "Yanıt"]}
				rows={[
					["Token olmadan ya da geçersiz, süresi dolmuş veya iptal edilmiş bir token'la", <code>401</code>],
					[<>Rolü <code>orders.read</code> izni vermeyen bir kullanıcı ya da uygulama</>, <code>403 AccessDenied</code>],
					[<>Rolü <code>orders.read</code> izni veren bir kullanıcı ya da uygulama</>, <code>200</code>],
				]} />

			<H2 id="configuration">
				Yapılandırma
			</H2>
			<Table
				head={["Ayar", "Zorunlu", "Açıklama"]}
				rows={[
					[<code>BaseUrl</code>, "evet", <>ErtisAuth&apos;un, varsa yol öneki dahil, mutlak <code>http</code> ya da <code>https</code> URL&apos;si.</>],
					[<code>MembershipId</code>, "evet", "Uygulamanızın ait olduğu membership."],
					[<code>BasicTokenCacheTTL</code>, "hayır", <>Doğrulanmış bir Basic token&apos;ın API&apos;niz tarafından önbellekte tutulacağı saniye (<code>ErtisAuth.Sdk.AspNetCore</code>). <code>0</code> ya da verilmezse önbellek kapalıdır.</>],
				]} />

			<H3 id="where-the-settings-come-from">
				Ayarlar nereden okunur
			</H3>
			<p>
				<code>AddErtisAuth()</code>, uygulamanızın yapılandırmasındaki (<code>builder.Configuration</code>) <code>ErtisAuth</code> bölümünü okur. Uygulamanın tüm yapılandırma kaynakları geçerlidir: <code>appsettings.json</code> ve <code>appsettings.{"{Environment}"}.json</code>, ortam değişkenleri, user secrets, komut satırı argümanları, Azure Key Vault vb. Örneğin Kubernetes&apos;te:
			</p>
			<Code language="yaml" code={samples.kubernetes} />
			<p>
				Ayarlar uygulama başlarken doğrulanır. Geçersiz ayarlar, tüm sorunları listeleyen bir mesajla uygulamayı durdurur.
			</p>
			<p>
				Ayarları vermenin diğer yolları:
			</p>
			<Table
				head={["Çağrı", "Okunan"]}
				rows={[
					[<code>AddErtisAuth()</code>, <><code>ErtisAuth</code> bölümü</>],
					[<code>AddErtisAuth(&quot;Identity&quot;)</code>, "Yapılandırmanın başka bir bölümü"],
					[<code>AddErtisAuth(builder.Configuration.GetSection(&quot;Identity&quot;))</code>, "Verilen bölüm, hemen doğrulanır"],
					[<code>AddErtisAuth(options =&gt; {"{ … }"})</code>, "Yalnızca verilen değerler; hiçbir yapılandırma okunmaz"],
				]} />
			<Code language="csharp" code={samples.settingsInCode} />
			<p>
				<code>AddErtisAuth</code> SDK&apos;yı bir kez kaydeder: sonraki çağrılar, ayarları ne olursa olsun yok sayılır.
			</p>
			<Callout>
				.NET host&apos;u olmayan bir programın (<code>WebApplication.CreateBuilder</code> ya da <code>Host.CreateApplicationBuilder</code> kullanmayan) uygulama yapılandırması yoktur. Bu durumda <code>AddErtisAuth()</code>, çıktı klasöründeki <code>appsettings.json</code> ve <code>appsettings.{"{ASPNETCORE_ENVIRONMENT}"}.json</code> dosyalarını ve ortam değişkenlerini okur.
			</Callout>

			<H2 id="protecting-endpoints">
				Endpoint&apos;leri koruma
			</H2>

			<H3 id="which-endpoints-are-protected">
				Hangi endpoint&apos;ler korunur
			</H3>
			<p>
				Controller&apos;ı <code>[Authorized]</code> ile işaretleyin: controller&apos;ın her action&apos;ı geçerli bir token ve rbac attribute&apos;larının tanımladığı yetkiyi gerektirir. Tek bir action için istisna yapmak isterseniz action&apos;ı işaretleyin:
			</p>
			<ul>
				<li>
					<code>[Unauthorized]</code>: action herkese açıktır.
				</li>
				<li>
					<code>[SelfAuthorized]</code>: action geçerli bir token gerektirir, ama <a href="#endpoints-that-check-the-permission-themselves">yetkiyi kendisi kontrol eder</a>.
				</li>
			</ul>
			<p>
				En spesifik attribute geçerlidir: action&apos;daki attribute controller&apos;dakini ezer.
			</p>
			<Table
				head={["Controller", "Action", "Endpoint"]}
				rows={[
					[<code>[Authorized]</code>, "", "token ve yetki gerektirir"],
					[<code>[Authorized]</code>, <code>[Unauthorized]</code>, "herkese açıktır"],
					[<code>[Authorized]</code>, <code>[SelfAuthorized]</code>, "token gerektirir; yetkiyi action kontrol eder"],
					[<code>[Unauthorized]</code>, <code>[SelfAuthorized]</code>, "token gerektirir; yetkiyi action kontrol eder"],
					["", <code>[SelfAuthorized]</code>, "token gerektirir; yetkiyi action kontrol eder"],
					["", "", <strong>hiç korunmaz</strong>],
				]} />
			<p>
				<code>[Authorized]</code> yalnızca controller&apos;a konabilir; action&apos;larda tekrarlamaya gerek yoktur.
			</p>
			<Callout type="warning">
				<code>[Authorized]</code> ya da <code>[SelfAuthorized]</code> yoksa endpoint herkese açıktır ve rbac attribute&apos;ları hiçbir işe yaramaz. SDK bunu derleme sırasında bildirir (<code>ERTISAUTH610</code>, bkz. <a href="#compile-time-checks">Derleme zamanı kontrolleri</a>).
			</Callout>

			<H3 id="attributes">
				Attribute&apos;lar
			</H3>
			<p>
				Attribute&apos;lar <code>ErtisAuth.Extensions.Authorization.Attributes</code> namespace&apos;indedir.
			</p>
			<Table
				head={["Attribute", "Nerede", "Anlamı"]}
				rows={[
					[<code>[Authorized]</code>, "controller", <>Her action&apos;da geçerli bir token <strong>ve</strong> rbac attribute&apos;larının tanımladığı yetki gerekir.</>],
					[<code>[SelfAuthorized]</code>, "controller ya da action", "Geçerli bir token gerekir; yetkiyi action'ın kendisi kontrol eder."],
					[<code>[Unauthorized]</code>, "controller ya da action", "Herkese açık: token gerekmez."],
					[<code>[RbacResource(&quot;orders&quot;)]</code>, "controller ya da action", <>Yetkinin <code>resource</code> bölümü.</>],
					[<><code>[RbacAction(&quot;approve&quot;)]</code> ya da <code>[RbacAction(Rbac.CrudActions.Read)]</code></>, "action", <><code>action</code> bölümü.</>],
					[<code>[RbacObject(&quot;{"{id}"}&quot;)]</code>, "action", <><code>object</code> bölümü; genellikle route&apos;taki id.</>],
					[<code>[RbacSubject(&quot;…&quot;)]</code>, "action", <><code>subject</code> bölümü.</>],
				]} />

			<H3 id="the-permission-that-is-checked">
				Kontrol edilen yetki
			</H3>
			<p>
				Rbac attribute&apos;ları bir <DocLink to="authorization" hash="permission-expressions">yetki ifadesi</DocLink> oluşturur: <code>subject.resource.action.object</code>. ErtisAuth bu ifadeyi çağıranın rolüne, kendi yetkilerine ve token&apos;ının scope&apos;larına göre kontrol eder.
			</p>
			<Table
				head={["Bölüm", "Kaynağı", "Attribute verilmezse"]}
				rows={[
					["subject", <code>[RbacSubject]</code>, "Çağıranın id'si; neredeyse her zaman istediğiniz de budur"],
					["resource", <>Action&apos;ın, yoksa controller&apos;ın <code>[RbacResource]</code>&apos;u</>, <>⚠️ Route şablonunun son parçası, ör. <code>{"orders/{id}"}</code> için <code>{"{id}"}</code></>],
					["action", <code>[RbacAction]</code>, <>⚠️ <code>*</code>: yalnızca kaynak üzerindeki her işleme izin veren yetkiler geçer</>],
					["object", <code>[RbacObject]</code>, <code>*</code>],
				]} />
			<p>
				<code>[RbacResource]</code> ve <code>[RbacAction]</code>&apos;ı her zaman verin. Bir action&apos;daki <code>[RbacResource]</code>, controller&apos;dakini ezer; örneğin <code>[RbacResource(&quot;users&quot;)]</code> bir controller&apos;ın tek bir action&apos;ındaki <code>[RbacResource(&quot;otp&quot;)]</code>.
			</p>
			<Code language="csharp" code={samples.controller} />

			<H3 id="endpoints-that-check-the-permission-themselves">
				Yetkiyi kendisi kontrol eden endpoint&apos;ler
			</H3>
			<p>
				Yetki, attribute&apos;ların erişemediği bir veriye bağlıysa (örneğin istenen kaydın bir alanına) action&apos;ı <code>[SelfAuthorized]</code> ile işaretleyin. SDK token&apos;ın kimliğini doğrular; action ise yetkiyi çağıranın token&apos;ıyla <code>IRoleService.CheckPermissionAsync</code> üzerinden kontrol eder:
			</p>
			<Code language="csharp" code={samples.selfAuthorized} />
			<p>
				<code>CheckPermissionAsync</code>, attribute&apos;lar gibi rolü, çağıranın kendi yetkilerini ve token&apos;ının scope&apos;larını uygular. ErtisAuth&apos;a ulaşılamazsa exception fırlatır.
			</p>

			<H3 id="minimal-apis">
				Minimal API&apos;ler
			</H3>
			<p>
				Minimal API endpoint&apos;leri aynı attribute&apos;ları metadata olarak alır:
			</p>
			<Code language="csharp" code={samples.minimalApi} />
			<p>
				<a href="#compile-time-checks">Derleme zamanı kontrolleri</a> minimal API endpoint&apos;lerini kapsamaz, çünkü attribute&apos;ları ancak çalışma zamanında bilinir.
			</p>

			<H3 id="what-happens-on-a-request">
				Bir istekte ne olur
			</H3>
			<p>
				<strong>Bearer</strong> token için SDK:
			</p>
			<ol>
				<li>
					token&apos;ın kimliğini doğrulamak için ErtisAuth&apos;un <code>/whoami</code> endpoint&apos;ini çağırır,
				</li>
				<li>
					attribute&apos;lardan oluşturulan ifadeyle <code>/roles/check-permission</code> endpoint&apos;ini çağırır; bu endpoint rolü, kullanıcının kendi yetkilerini ve token&apos;ın scope&apos;larını uygular.
				</li>
			</ol>
			<p>
				<strong>Basic</strong> token için uygulamayı token&apos;ın kendisiyle ErtisAuth&apos;tan okur (bu, token&apos;ın kimliğini doğrular) ve yetkiyi aynı şekilde kontrol eder. <code>BasicTokenCacheTTL</code> ile doğrulanmış bir Basic token o kadar saniye önbellekte tutulur; bu çağrıları azaltır ama bir secret yenilemesinin etkisini en fazla o süre kadar geciktirir.
			</p>
			<Table
				head={["API'nizin yanıtı", "Ne zaman"]}
				rows={[
					[<>ErtisAuth hata gövdesiyle <code>401</code></>, "Token yok, desteklenmeyen token tipi ya da geçersiz, süresi dolmuş veya iptal edilmiş bir token"],
					[<code>403 AccessDenied</code>, "Token geçerli ama yetki eksik"],
					[<code>503 AuthenticationServiceUnavailable</code>, "ErtisAuth'a ulaşılamadı ya da bir hatayla yanıt verdi. İstemciler kullanıcıyı çıkış yaptırmak yerine yeniden denemelidir."],
				]} />

			<H3 id="placeholders">
				Placeholder&apos;lar
			</H3>
			<p>
				Rbac attribute değerleri, her istekte çözülen placeholder&apos;lar içerebilir:
			</p>
			<Table
				head={["Placeholder", "Kaynak"]}
				rows={[
					[<><code>{"{id}"}</code> ya da <code>{"{route::id}"}</code></>, "Bir route değeri"],
					[<code>{"{query::id}"}</code>, "Bir query string parametresi"],
					[<code>{"{header::X-Tenant}"}</code>, "Bir istek header'ı"],
					[<code>{"{env::REGION}"}</code>, "Bir ortam değişkeni"],
				]} />
			<Code language="csharp" code={samples.placeholder} />
			<p>
				Kontrol ile action&apos;ın aynı şeye bakmasını sağlayan kurallar:
			</p>
			<ul>
				<li>
					çözülemeyen bir <code>query</code>, <code>header</code> ya da <code>env</code> placeholder&apos;ı isteği reddeder; değeri eksik bir route placeholder&apos;ı ise yazıldığı gibi kalır;
				</li>
				<li>
					çözülen değer <code>*</code> ise ya da nokta (<code>%2E</code>), boşluk veya kontrol karakteri içeriyorsa istek reddedilir;
				</li>
				<li>
					<code>[RbacSubject]</code>, istemcinin kontrol ettiği kaynakları (<code>query</code>, <code>header</code>) kullanamaz.
				</li>
			</ul>

			<H3 id="compile-time-checks">
				Derleme zamanı kontrolleri
			</H3>
			<p>
				<code>ErtisAuth.Sdk.AspNetCore</code>, hataları derleme sırasında bildiren Roslyn analyzer&apos;ları içerir:
			</p>
			<Table
				head={["Tanılama", "Önem", "Sorun"]}
				rows={[
					[<code>ERTISAUTH601</code>, "uyarı", "Placeholder, action'ın bir route parametresi değil"],
					[<code>ERTISAUTH602</code>, "hata", <>Placeholder bilinmeyen bir kaynak belirtiyor (yalnızca <code>route</code>, <code>query</code>, <code>header</code> ve <code>env</code> vardır)</>],
					[<code>ERTISAUTH603</code>, "hata", <><code>[RbacSubject]</code> istemcinin kontrol ettiği bir kaynaktan okuyor</>],
					[<code>ERTISAUTH610</code>, "uyarı", <>Action&apos;ın rbac attribute&apos;ları var, ama ne action&apos;da ne controller&apos;ında <code>[Authorized]</code> ya da <code>[SelfAuthorized]</code> var: endpoint herkese açık</>],
					[<code>ERTISAUTH611</code>, "uyarı", <><code>[Authorized]</code>, <code>[SelfAuthorized]</code> ve <code>[Unauthorized]</code> aynı seviyede çelişiyor (base sınıflarıyla birlikte controller ya da action)</>],
					[<code>ERTISAUTH612</code>, "bilgi", <><code>[SelfAuthorized]</code> ya da <code>[Unauthorized]</code> bir action&apos;ın rbac attribute&apos;ları kontrol edilmiyor</>],
					[<code>ERTISAUTH613</code>, "uyarı", <>Kimlik doğrulanmayan bir action <code>GetUtilizer()</code> çağırıyor; orada her zaman <code>null</code> döner</>],
				]} 
			/>

			<H3 id="the-caller">
				Çağıran
			</H3>
			<p>
				Bir action içinde <code>this.GetUtilizer()</code>, ErtisAuth&apos;un kimliğini doğruladığı çağıranı döner: <code>Id</code>, <code>Username</code>, <code>Role</code>, <code>Permissions</code>, <code>Forbidden</code>, <code>MembershipId</code>, <code>Type</code>, <code>Token</code> ve <code>TokenType</code> özellikleriyle bir kullanıcı ya da uygulama. Kimlik doğrulanmayan endpoint&apos;lerde (<code>[Unauthorized]</code> ya da ErtisAuth attribute&apos;u olmayan) <code>null</code> döner; böyle bir action&apos;daki çağrıyı <code>ERTISAUTH613</code> bildirir.
			</p>
			<p>
				<code>this.GetUnverifiedUtilizer()</code> bu endpoint&apos;lerde de çalışır: orada isteğin token&apos;ını <strong>doğrulamadan</strong> okur (Bearer token&apos;larda imza, süre ve iptal kontrolü, Basic token&apos;larda secret kontrolü yapılmaz).
			</p>
			<Callout type="warning">
				herkes, istediği kimliği iddia eden bir token gönderebilir. <code>GetUnverifiedUtilizer()</code>&apos;ı yetki kararlarında ya da veriye erişimde asla kullanmayın; <code>[Authorized]</code> ya da <code>[SelfAuthorized]</code> bir endpoint&apos;te <code>GetUtilizer()</code> kullanın.
			</Callout>

			<H2 id="calling-the-ertisauth-api">
				ErtisAuth API&apos;sini çağırma
			</H2>
			<p>
				İstemciyi tek başına (ASP.NET Core entegrasyonu olmadan) <code>ErtisAuth.Sdk</code> ile kaydedin:
			</p>
			<Code language="csharp" code={samples.clientRegistration} />
			<p>
				<a href="#configuration">Aynı ayarları</a> kullanır. Ardından ihtiyacınız olan servisleri inject edin:
			</p>
			<Table
				head={["Servis", "Metotlar"]}
				rows={[
					[<code>IAuthenticationService</code>, <><code>GetTokenAsync</code>, <code>RefreshTokenAsync</code>, <code>VerifyTokenAsync</code>, <code>RevokeTokenAsync</code>, <code>MeAsync</code>, <code>WhoAmIAsync</code></>],
					[<code>IUserService</code>, <><code>GetAsync</code>, <code>QueryAsync</code>, <code>CreateAsync</code>, <code>UpdateAsync</code>, <code>DeleteAsync</code>, <code>BulkDeleteAsync</code>, <code>GetActiveTokensAsync</code>, <code>GetRevokedTokensAsync</code></>],
					[<code>IPasswordService</code>, <><code>ChangePasswordAsync</code>, <code>ResetPasswordAsync</code>, <code>SetPasswordAsync</code></>],
					[<code>IRoleService</code>, <>CRUD, <code>CheckPermissionAsync</code>, <code>CheckPermissionByRoleAsync</code></>],
					[<><code>IApplicationService</code>, <code>IWebhookService</code>, <code>IMailHookService</code></>, "CRUD"],
					[<code>IMembershipService</code>, <><code>GetMembershipAsync</code>, <code>GetMembershipsAsync</code>, <code>QueryMembershipsAsync</code>, <code>CreateMembershipAsync</code>, <code>UpdateMembershipAsync</code>, <code>DeleteMembershipAsync</code></>],
					[<><code>IActiveTokensService</code>, <code>IRevokedTokensService</code></>, <><code>GetAsync</code>, <code>QueryAsync</code></>],
				]} />
			<p>
				<code>IAuthenticationService</code>, ASP.NET Core&apos;un <code>Microsoft.AspNetCore.Authentication.IAuthenticationService</code> arayüzüyle aynı adı taşır; iki namespace birden import edilmişse tam adı ya da bir alias kullanın.
			</p>

			<H3 id="tokens">
				Token&apos;lar
			</H3>
			<p>
				Kaynak servisleri, çağrıda kullanılacak token&apos;ı parametre olarak alır:
			</p>
			<ul>
				<li>
					kullanıcı adına yapılan çağrılar için giriş yapmış kullanıcının bir <code>BearerToken</code>&apos;ı: <code>BearerToken.CreateTemp(accessToken)</code> ham bir access token&apos;ı sarmalar;
				</li>
				<li>
					backend&apos;inizin çağrıları için uygulamanızın bir <code>BasicToken</code>&apos;ı: <code>new BasicToken($&quot;{"{applicationId}"}:{"{applicationSecret}"}&quot;)</code>.
				</li>
			</ul>
			<p>
				Uygulama secret&apos;ını sunucuda tutun: bir secret store&apos;da ya da bir ortam değişkeninde; asla bir tarayıcıda ya da mobil uygulamada değil.
			</p>

			<H3 id="handling-responses">
				Yanıtları işleme
			</H3>
			<p>
				Her metot, HTTP hatalarında exception fırlatmak yerine bir <code>IResponseResult</code> (ya da <code>IResponseResult&lt;T&gt;</code>) döner:
			</p>
			<Table
				head={["Özellik", "İçerik"]}
				rows={[
					[<code>IsSuccess</code>, "ErtisAuth'un başarılı bir durum koduyla yanıt verip vermediği"],
					[<code>Data</code>, "Başarı durumunda sonuç"],
					[<code>StatusCode</code>, <>ErtisAuth yanıtının HTTP durum kodu; yanıt hiç gelmediyse (ör. bir ağ hatası) <code>null</code></>],
					[<code>Json</code>, <>Yanıtın gövdesi: hata durumunda ErtisAuth&apos;un <DocLink to="api-conventions" hash="errors">hata JSON&apos;u</DocLink></>],
					[<code>Exception</code>, "Yanıt hiç gelmediğinde exception"],
				]} />
			<p>
				<code>response.IsServiceUnavailable()</code> (namespace <code>ErtisAuth.Sdk.Extensions</code>), ErtisAuth&apos;un erişilemez olmasını (yanıt yok ya da <code>5xx</code>) bir reddetmeden (ör. <code>401</code>, <code>403</code>) ayırır. İkisini farklı ele alın: erişilemezlik durumunda yeniden denenmeli, reddetmede denenmemelidir.
			</p>
			<p>
				ErtisAuth&apos;un hatalarını istemciye ileten, backend&apos;inizdeki bir giriş endpoint&apos;i:
			</p>
			<Code language="csharp" code={samples.signIn} />

			<H3 id="common-tasks">
				Sık yapılan işler
			</H3>
			<p>
				Access token&apos;ın süresi dolmadan token çiftini yenileme:
			</p>
			<Code language="csharp" code={samples.refresh} />
			<p>
				Çıkış yapma (<code>logoutFromAllDevices: true</code> ile tüm cihazlarda):
			</p>
			<Code language="csharp" code={samples.revoke} />
			<p>
				Uygulamanın token&apos;ıyla kullanıcı oluşturma. <DocLink to="user-types">Kullanıcı tipinin</DocLink> özel alanları, <code>UserWithPassword</code>&apos;dan türeyen bir sınıfın özellikleridir:
			</p>
			<Code language="csharp" code={samples.createUser} />
			<p>
				Parola sıfırlama (bkz. <DocLink to="account-recovery" hash="password-reset">Hesap Kurtarma</DocLink>): sıfırlamayı sıfırlama sayfanızın URL&apos;siyle başlatın, ardından linkteki token&apos;la yeni parolayı belirleyin:
			</p>
			<Code language="csharp" code={samples.resetPassword} />
			<p>
				Kullanıcıları sorgulama:
			</p>
			<Code language="csharp" code={samples.queryUsers} />
			<Callout>
				<code>GetAsync</code> ve <code>QueryAsync</code>&apos;in yalnızca sıralama parametreleriyle ayrılan iki overload&apos;ı vardır (<code>sorting</code>, ya da <code>orderBy</code> ve <code>sortDirection</code>). Sıralama yapmıyorsanız birini adıyla verin (<code>sorting: null</code>); aksi halde çağrı belirsiz olur ve derlenmez (<code>CS0121</code>).
			</Callout>

			<H2 id="applications-without-aspnet-core">
				ASP.NET Core olmayan uygulamalar
			</H2>
			<p>
				Bir worker ya da console uygulaması <code>ErtisAuth.Sdk</code>&apos;yı .NET generic host ile kullanır; bu ona aynı <a href="#configuration">yapılandırmayı</a> sağlar:
			</p>
			<Code language="csharp" code={samples.workerProgram} />
			<Code language="csharp" code={samples.worker} />

			<H2 id="custom-authentication-handler">
				Özel authentication handler
			</H2>
			<p>
				<code>AddErtisAuth&lt;THandler&gt;()</code>, SDK&apos;nın handler&apos;ı yerine kendi authentication handler&apos;ınızı kaydeder ve <code>AddErtisAuth()</code> ile aynı argümanları alır. ErtisAuth kontrollerini koruyup çevresine kendi davranışınızı eklemek için handler&apos;ı <code>ErtisAuthAuthenticationHandler</code>&apos;dan türetin:
			</p>
			<Code language="csharp" code={samples.customHandler} />
			<Code language="csharp" code={samples.customHandlerRegistration} />

			<H3 id="testing-your-api">
				API&apos;nizi test etme
			</H3>
			<p>
				API&apos;nizin entegrasyon testleri (örneğin <code>WebApplicationFactory</code> ile) çalışan bir ErtisAuth&apos;a ihtiyaç duymamalı. <code>Program.cs</code>&apos;i değiştirmeden handler&apos;ı, bir test çağıranını giriş yaptıran bir handler&apos;la değiştirin. <code>AddErtisAuth</code> yalnızca bir kez kaydettiği için test handler&apos;ını <code>ErtisAuthAuthenticationHandler</code> <strong>olarak</strong> kaydedin:
			</p>
			<Code language="csharp" code={samples.testHandler} />
			<Code language="csharp" code={samples.testFactory} />
			<p>
				Böylece her istek test çağıranı olarak doğrulanır ve hiçbir yetki kontrol edilmez. <code>Token</code> ve <code>TokenType</code> verilmelidir: <code>GetUtilizer()</code> bunları gerektirir.
			</p>

			<H2 id="checklist">
				Kontrol listesi
			</H2>
			<ul>
				<li>
					Korunacak endpoint&apos;leri olan her controller&apos;da <code>[Authorized]</code> var ya da action&apos;larında <code>[SelfAuthorized]</code> var. Her <code>ERTISAUTH610</code> uyarısını düzeltin.
				</li>
				<li>
					Korunan her action&apos;da (ya da controller&apos;ında) <code>[RbacResource]</code> ve action&apos;da <code>[RbacAction]</code> var.
				</li>
				<li>
					Yetki kararlarında <code>GetUtilizer()</code> kullanılıyor, asla <code>GetUnverifiedUtilizer()</code> değil.
				</li>
				<li>
					İstemciler <code>503 AuthenticationServiceUnavailable</code> aldığında kullanıcıyı çıkış yaptırmak yerine yeniden deniyor.
				</li>
				<li>
					Uygulama secret&apos;ı yalnızca sunucuda.
				</li>
				<li>
					<code>BasicTokenCacheTTL</code> ile, yenilenmiş bir secret API&apos;nizde en fazla o kadar saniye çalışmaya devam eder.
				</li>
				<li>
					Ayarlar kodda değil, uygulamanın yapılandırmasında (<code>appsettings.json</code>, ortam değişkenleri…).
				</li>
			</ul>
		</>
	)
}
