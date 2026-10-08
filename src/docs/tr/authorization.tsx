import * as samples from "../samples/authorization"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Authorization() {
	return (
		<>
			<p>
				Çağıranın kimliği doğrulandıktan sonra ErtisAuth isteği yapıp yapamayacağına karar verir. Karar iki modeli birleştirir:
			</p>
			<ul>
				<li>
					<strong>RBAC</strong> (rol tabanlı erişim kontrolü): çağıranın <DocLink to="roles">rolünün</DocLink> yetkileri.
				</li>
				<li>
					<strong>UBAC</strong> (kullanıcı tabanlı erişim kontrolü): <DocLink to="users">kullanıcı</DocLink> ya da <DocLink to="applications">uygulama</DocLink> üzerinde saklanan, çağıranın kendine ait yetkileri.
				</li>
			</ul>
			<p>
				Aynı model hem ErtisAuth&apos;un kendi API&apos;sini hem de <DocLink to="sdk">SDK</DocLink> aracılığıyla sizin API&apos;lerinizi korur.
			</p>

			<H2 id="permission-expressions">
				Yetki ifadeleri
			</H2>
			<p>
				Bir yetki, noktalarla ayrılmış en fazla dört bölümden oluşan bir ifadedir:
			</p>
			<Code language="text" code={samples.expression} />
			<Table
				head={["Bölüm", "Anlamı", "Örnekler"]}
				rows={[
					[<code>subject</code>, "İşlemi yapan: bir kullanıcı ya da uygulama id'si", <><code>*</code>, <code>66f1c0d2a4b5c6d7e8f90124</code></>],
					[<code>resource</code>, "Ne tür bir şey", <><code>users</code>, <code>roles</code>, <code>orders</code></>],
					[<code>action</code>, "Ne yapılıyor", <><code>create</code>, <code>read</code>, <code>update</code>, <code>delete</code> ya da <code>approve</code> gibi herhangi bir özel işlem</>],
					[<code>object</code>, "Tek bir şey: bir kaynak id'si", <><code>*</code>, <code>66f1c0d2a4b5c6d7e8f90127</code></>],
				]} />
			<p>
				<code>*</code>, bulunduğu bölümün her değeriyle eşleşir. Kısa yazımlarda eksik bölümler <code>*</code> sayılır:
			</p>
			<Table
				head={["Yazılan", "Anlamı", "İzin verdiği"]}
				rows={[
					[<code>users</code>, <code>*.users.*.*</code>, "kullanıcılar üzerinde her şey"],
					[<code>users.read</code>, <code>*.users.read.*</code>, "herhangi bir kullanıcıyı okuma"],
					[<code>users.update.66f1…27</code>, <code>*.users.update.66f1…27</code>, "o tek kullanıcıyı güncelleme"],
					[<code>66f1…24.orders.approve.*</code>, "(yazıldığı gibi)", "o subject'in herhangi bir siparişi onaylaması"],
				]} />
			<p>
				Bölümlerin kuralları:
			</p>
			<ul>
				<li>
					<code>resource</code> ve <code>action</code> addır ve <strong>büyük/küçük harf ayrımı yapılmadan</strong> karşılaştırılır (<code>Users.Read</code>, <code>users.read</code> ile aynıdır).
				</li>
				<li>
					<code>subject</code> ve <code>object</code> id&apos;dir ve birebir karşılaştırılır.
				</li>
				<li>
					Bir bölüm boş olamaz, <code>.</code> ya da <code>*</code> ile başlayıp bitemez ve <code>*</code> bir değerin parçası olarak kullanılamaz (<code>user*</code> geçersizdir). Geçersiz ifadeler <code>400 InvalidRbac</code> ile reddedilir.
				</li>
			</ul>

			<H3 id="ubac-expressions">
				UBAC ifadeleri
			</H3>
			<p>
				Bir kullanıcının ya da uygulamanın <code>permissions</code> ve <code>forbidden</code> listeleri aynı biçimi <strong>subject olmadan</strong> kullanır (subject, kullanıcının ya da uygulamanın kendisidir): <code>resource.action.object</code>; kısa yazımlar da aynıdır (<code>users</code>, <code>users.read</code>).
			</p>

			<H2 id="how-a-request-is-checked">
				Bir istek nasıl kontrol edilir
			</H2>
			<p>
				ErtisAuth, korunan bir endpoint&apos;e gelen her istek için endpoint&apos;ten ve çağırandan isteğin ifadesini oluşturur:
			</p>
			<ul>
				<li>
					<code>subject</code>: çağıranın id&apos;si,
				</li>
				<li>
					<code>resource</code> ve <code>action</code>: endpoint&apos;in tanımladığı değerler (örneğin <code>users</code> ve <code>read</code>),
				</li>
				<li>
					<code>object</code>: tek kaynak endpoint&apos;lerinde route&apos;taki id (<code>GET /users/{"{id}"}</code>), diğerlerinde <code>*</code>.
				</li>
			</ul>
			<p>
				Örneğin <code>66f1…24</code> kullanıcısının yaptığı <code>GET /memberships/{"{m}"}/users/66f1…27</code> isteği <code>66f1…24.users.read.66f1…27</code> olarak kontrol edilir.
			</p>
			<p>
				Ardından karar bu sırayla verilir:
			</p>
			<ol>
				<li>
					<strong>Önce UBAC.</strong> Çağıranın kendi <code>permissions</code> ya da <code>forbidden</code> listesindeki bir girdi eşleşirse kararı yalnızca çağıranın kendi girdileri verir: bir yetki eşleşir ve hiçbir yasak eşleşmezse izin verilir, aksi halde reddedilir.
				</li>
				<li>
					<strong>Sonra rol.</strong> Aksi halde rol karar verir: <code>permissions</code> girdilerinden biri eşleşir ve <code>forbidden</code> girdilerinden hiçbiri eşleşmezse izin verilir. Bir yasak girdisi, aynı rolün yetkisine karşı her zaman kazanır.
				</li>
				<li>
					<strong>Sonra kendi kaydı kuralları.</strong> İkisi de izin vermezse, rol işlemi açıkça yasaklamadıkça iki istisna yine de geçerlidir:
					<ul>
						<li>
							bir kullanıcı kendi kullanıcı kaydını, bir uygulama da kendi uygulama kaydını <strong>güncelleyebilir</strong>;
						</li>
						<li>
							bir uygulama kendi uygulama kaydını <strong>okuyabilir</strong>.
						</li>
					</ul>
				</li>
				<li>
					<strong>En son scope&apos;lar.</strong> Token bir <DocLink to="authentication" hash="scoped-tokens">scoped token</DocLink> ise, yukarıda izni hangisi vermiş olursa olsun, scope&apos;larının da isteği kapsaması gerekir.
				</li>
			</ol>
			<p>
				Reddedilen bir istek <code>403 AccessDenied</code> döner.
			</p>
			<p>
				Her kullanıcının ve uygulamanın bir rolü olmalıdır. Rolü boş olan ya da rolü artık mevcut olmayan biri, kendi yetkileri ne olursa olsun korunan her endpoint&apos;te reddedilir (<code>403 AccessDenied</code>, &quot;The user has no role&quot; ya da &quot;The user role is not found by the given slug&quot;). API her zaman bir rol istediği için bu yalnızca veri API dışında değiştirildiğinde ya da hâlâ kullanımda olan bir rol silindiğinde olur.
			</p>

			<H3 id="examples">
				Örnekler
			</H3>
			<p>
				Bir rol:
			</p>
			<Code language="json" code={samples.role} />
			<Table
				head={["İstek", "Sonuç", "Neden"]}
				rows={[
					["Herhangi bir kullanıcıyı okuma", "izin verilir", <code>users.read</code>],
					[<><code>…27</code> kullanıcısını güncelleme</>, "izin verilir", <code>users.update</code>],
					[<><code>…24</code> kullanıcısını güncelleme</>, "reddedilir", "rol bunu yasaklıyor"],
					["Herhangi bir kullanıcıyı silme", "reddedilir", "eşleşen yetki yok"],
					["Rolleri okuma", "izin verilir", <code>roles.read</code>],
				]} />
			<p>
				Bu role ve kendi girdilerine sahip bir kullanıcı:
			</p>
			<Code language="json" code={samples.user} />
			<Table
				head={["İstek", "Sonuç", "Neden"]}
				rows={[
					["Herhangi bir kullanıcıyı silme", "izin verilir", "kullanıcının kendi yetkisi karar verir (önce UBAC)"],
					["Rolleri okuma", "reddedilir", "kullanıcının kendi yasak girdisi karar verir"],
					["Herhangi bir kullanıcıyı okuma", "izin verilir", "hiçbir UBAC girdisi eşleşmiyor, rol izin veriyor"],
				]} />
			<Callout>
				UBAC girdileri rolden önce karar verdiği için bir kullanıcının kendi yetkisi, rolün yasakladığı bir şeye izin verebilir. UBAC&apos;ı bilinçli, kullanıcıya özel istisnalar için kullanın.
			</Callout>
			<p>
				Aynı ifade hem <code>permissions</code> hem de <code>forbidden</code> listesinde bulunamaz: böyle bir rol ya da uygulama <code>400 ModelValidationError</code>, böyle bir kullanıcı <code>409 UbacsConflicted</code> ile reddedilir.
			</p>

			<H2 id="changing-privileged-fields">
				Ayrıcalıklı alanları değiştirme
			</H2>
			<p>
				Kendi kaydı kuralı kullanıcıların kendi profillerini düzenlemesine izin verir, ama bazı alanlar güç verir. Bir kullanıcıda bunlardan herhangi birini değiştirmek, rolden ya da UBAC&apos;tan gelen, o kullanıcı üzerinde <strong>gerçek</strong> bir <code>users.update</code> yetkisi gerektirir; kendi kaydı kuralı bunları kapsamaz:
			</p>
			<ul>
				<li>
					<code>role</code>
				</li>
				<li>
					<code>permissions</code>
				</li>
				<li>
					<code>forbidden</code>
				</li>
				<li>
					<code>is_active</code>
				</li>
				<li>
					<code>user_type</code>
				</li>
			</ul>
			<p>
				Aksi halde güncelleme, alanların listesiyle birlikte <code>403 AccessDenied</code> ile reddedilir.
			</p>
			<p>
				<code>source_provider</code> ve <code>connected_accounts</code> alanlarını ErtisAuth kendisi yönetir: istemcilerin gönderdiği değerler yok sayılır.
			</p>

			<H2 id="resources-of-the-ertisauth-api">
				ErtisAuth API&apos;sinin kaynakları
			</H2>
			<Table
				head={["Kaynak", "Endpoint'ler", "İşlemler"]}
				rows={[
					[<code>memberships</code>, <code>/memberships</code>, <><code>create</code>, <code>read</code>, <code>update</code>, <code>delete</code></>],
					[<code>users</code>, <code>/memberships/{"{m}"}/users</code>, <><code>create</code>, <code>read</code>, <code>update</code>, <code>delete</code></>],
					[<code>otp</code>, <code>/memberships/{"{m}"}/users/{"{id}"}/generate-otp</code>, <code>create</code>],
					[<code>user-types</code>, <code>/memberships/{"{m}"}/user-types</code>, <><code>create</code>, <code>read</code>, <code>update</code>, <code>delete</code></>],
					[<code>roles</code>, <code>/memberships/{"{m}"}/roles</code>, <><code>create</code>, <code>read</code>, <code>update</code>, <code>delete</code></>],
					[<code>applications</code>, <code>/memberships/{"{m}"}/applications</code>, <><code>create</code>, <code>read</code>, <code>update</code>, <code>delete</code></>],
					[<code>providers</code>, <code>/memberships/{"{m}"}/providers</code>, <><code>create</code>, <code>read</code>, <code>update</code>, <code>delete</code></>],
					[<code>tokens</code>, <><code>/memberships/{"{m}"}/active-tokens</code>, <code>/revoked-tokens</code>, <code>/codes</code></>, <><code>read</code>, <code>create</code></>],
					[<code>events</code>, <code>/memberships/{"{m}"}/events</code>, <code>read</code>],
					[<code>webhooks</code>, <code>/memberships/{"{m}"}/webhooks</code>, <><code>create</code>, <code>read</code>, <code>update</code>, <code>delete</code></>],
					[<code>mailhooks</code>, <code>/memberships/{"{m}"}/mailhooks</code>, <><code>create</code>, <code>read</code>, <code>update</code>, <code>delete</code></>],
					[<code>code-policies</code>, <code>/memberships/{"{m}"}/code-policies</code>, <><code>create</code>, <code>read</code>, <code>update</code>, <code>delete</code></>],
				]} />
			<p>
				Her referans sayfası, her endpoint&apos;in istediği yetkiyi listeler. Birkaç endpoint, beklemeyebileceğiniz bir yetki ister:
			</p>
			<Table
				head={["Endpoint", "Yetki"]}
				rows={[
					[<><code>GET /users/activation</code>, <code>POST /users/reset-password</code>, <code>POST /users/set-password</code></>, <code>users.update</code>],
					[<code>POST /users/resend-activation-mail</code>, <code>users.create</code>],
					[<><code>GET /users/verify-reset-token</code>, <code>GET /users/check-password</code></>, <code>users.read</code>],
					[<code>GET /users/{"{id}"}/generate-otp</code>, <code>otp.create</code>],
					[<><code>POST /codes</code>, <code>GET /codes/{"{user_code}"}</code>, <code>POST /codes/{"{user_code}"}/approve</code>, <code>POST /codes/{"{user_code}"}/deny</code></>, <code>tokens.create</code>],
				]} />
			<p>
				Şifre sıfırlama sayfası gibi herkese açık sayfalar bu endpoint&apos;leri genellikle bir uygulamanın Basic token&apos;ıyla, backend&apos;inizden çağırır.
			</p>
			<Callout>
				<code>memberships</code> kaynağı kurulum genelidir. Okuma yetkisi membership&apos;lerin gizli anahtarlarını açığa çıkardığı için bu yetkiyi yalnızca kurulumun operatörlerine verin.
			</Callout>

			<H3 id="the-admin-role">
				<code>admin</code> rolü
			</H3>
			<p>
				Setup, yukarıdaki her kaynak üzerinde <code>create</code>, <code>read</code>, <code>update</code> ve <code>delete</code> yetkisine sahip ayrılmış <code>admin</code> rolünü oluşturur (örneğin <code>*.users.read.*</code>). <code>admin</code> slug&apos;ına sahip başka bir rol oluşturulamaz (<code>409 ReservedRole</code>) ve <code>admin</code> rolü silinemez (<code>409 SystemRolesCannotBeDeleted</code>).
			</p>

			<H2 id="checking-a-permission">
				Yetki kontrolü
			</H2>

			<H3 id="for-the-caller">
				Çağıran için
			</H3>
			<p>
				Çağıranın token&apos;ının, rolü, UBAC girdileri ve scope&apos;larıyla birlikte bir şeyi yapıp yapamayacağını sorun:
			</p>
			<Code language="http" code={samples.checkForCaller} />
			<p>
				Membership&apos;in geçerli her token&apos;ı bu endpoint&apos;i çağırabilir. İzin varsa <code>200 OK</code>, yoksa <code>401</code> döner.
			</p>
			<p>
				<DocLink to="sdk">SDK</DocLink>&apos;nın, API&apos;lerinize gelen her istekte çağırdığı endpoint budur.
			</p>

			<H3 id="for-a-role">
				Bir rol için
			</H3>
			<Code language="http" code={samples.checkForRole} />
			<p>
				<code>roles.read</code> yetkisi gerektirir. Rolün yetkisi varsa <code>200 OK</code>, yoksa <code>401</code> döner.
			</p>
			<Callout>
				iki kontrol endpoint&apos;i de reddedilen bir yetkiyi <code>403</code> ile değil, <code>401</code> ile yanıtlar.
			</Callout>
			<Table
				head={["Hata", "Ne zaman"]}
				rows={[
					[<code>400 PermissionParameterRequired</code>, <><code>permission</code> eksik</>],
					[<code>400 InvalidRbac</code>, <><code>permission</code> geçerli bir ifade değil</>],
					[<code>404 RoleNotFound</code>, "Rol yok"],
				]} />

			<H2 id="designing-permissions-for-your-own-apis">
				Kendi API&apos;leriniz için yetki tasarlama
			</H2>
			<p>
				Kaynaklar ve işlemler serbest adlardır; böylece kendi alanınızı modelleyebilirsiniz:
			</p>
			<Code language="json" code={samples.ownApiRole} />
			<p>
				Ardından endpoint&apos;lerinizi aynı adlarla koruyun; bkz. <DocLink to="sdk" hash="protecting-endpoints">.NET SDK</DocLink>.
			</p>
		</>
	)
}
