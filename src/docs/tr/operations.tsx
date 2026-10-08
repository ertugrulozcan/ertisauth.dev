import * as samples from "../samples/operations"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Operations() {
	return (
		<>
			<p>
				Bu sayfa ErtisAuth&apos;u production ortamında çalıştırmayı anlatır: sağlık kontrolleri, izleme, ölçekleme, veri bakımı ve bir güvenlik kontrol listesi.
			</p>

			<H2 id="health-checks">
				Sağlık kontrolleri
			</H2>

			<H3 id="get-healthcheck">
				<code>GET /healthcheck</code>
			</H3>
			<p>
				Veritabanı bağlantısını ve kurulumun yapılıp yapılmadığını kontrol eder. Anonimdir.
			</p>
			<Table
				head={["Durum", "Kod", "Gövde"]}
				rows={[
					["Veritabanına ulaşılıyor, kurulum yapılmış", <code>200</code>, <code>{"{ \"status\": \"Healthy\" }"}</code>],
					["Veritabanına ulaşılıyor, henüz kurulum yapılmamış", <code>200</code>, <code>{"{ \"status\": \"Unhealthy\", \"message\": \"ErtisAuth has not been set up yet\" }"}</code>],
					["Veritabanına ulaşılamıyor", <code>500</code>, <code>{"{ \"status\": \"Unhealthy\", \"message\": \"Health check failed\" }"}</code>],
				]} />
			<p>
				Veritabanı hatasının ayrıntıları yalnızca log&apos;a yazılır.
			</p>
			<Callout>
				yeni bir kurulum <code>Unhealthy</code> olmasına rağmen <code>200</code> döner. Orkestratörünüz yalnızca durum koduna bakıyorsa henüz kurulmamış bir instance&apos;ı sağlıklı kabul eder; kurulumu yaparken istediğiniz de budur.
			</Callout>

			<H3 id="get-ping">
				<code>GET /ping</code>
			</H3>
			<p>
				Veritabanına dokunmadan <code>&quot;Pong&quot;</code> yanıtını verir. Bunu liveness probe, <code>/healthcheck</code>&apos;i ise readiness probe olarak kullanın.
			</p>
			<Code language="yaml" code={samples.probes} />

			<H2 id="metrics">
				Metrikler
			</H2>
			<p>
				Prometheus metrikleri <strong><code>/metrics</code></strong> adresinde sunulur:
			</p>
			<ul>
				<li>
					gelen HTTP istekleri: endpoint ve durum kodu başına sayılar, süreler ve devam eden istekler,
				</li>
				<li>
					giden HTTP çağrıları (sağlayıcılara, webhook alıcılarına, mail API&apos;lerine),
				</li>
				<li>
					.NET runtime: bellek, garbage collection, thread pool.
				</li>
			</ul>
			<p>
				<code>/metrics</code> kimlik doğrulaması gerektirmez. Herkese açmayın: ağınızın içinden toplayın ya da ingress&apos;te engelleyin.
			</p>

			<H2 id="logging-and-tracing">
				Loglama ve izleme
			</H2>
			<p>
				ErtisAuth, standart ASP.NET Core loglaması üzerinden log yazar (varsayılan olarak konsola). Beklenmeyen hatalar stack trace&apos;leriyle loglanır; istemci yalnızca <code>500 UnhandledExceptionError</code> alır.
			</p>
			<p>
				<code>ApplicationInsights:ConnectionString</code> ayarlandığında trace&apos;ler, metrikler ve log&apos;lar OpenTelemetry üzerinden <strong>Azure Monitor</strong>&apos;a aktarılır (bkz. <DocLink to="configuration" hash="azure-application-insights">Yapılandırma</DocLink>).
			</p>

			<H2 id="api-reference">
				API referansı
			</H2>
			<p>
				<code>Development</code> ortamında ErtisAuth, OpenAPI dokümanını <code>/openapi/v1.json</code> adresinde, etkileşimli bir <a href="https://scalar.com">Scalar</a> referansını ise <strong><code>/docs</code></strong> adresinde sunar. İkisi de diğer ortamlarda kapalıdır.
			</p>

			<H2 id="scaling">
				Ölçekleme
			</H2>
			<p>
				ErtisAuth, veritabanı dışında durum tutmaz; bu yüzden bir load balancer arkasında birden fazla instance çalıştırabilirsiniz.
			</p>

			<H3 id="caching">
				Önbellek
			</H3>
			<p>
				Her instance en sık okuduğu kaynakları bellekte önbelleğe alır:
			</p>
			<Table
				head={["Kaynak", "En fazla önbellek süresi"]}
				rows={[
					["Membership'ler", "1 saat"],
					["Kullanıcı tipleri", "1 saat"],
					["Sağlayıcılar", "1 saat"],
					["Roller", "5 dakika"],
					["Uygulamalar", "5 dakika"],
					["İptal edilmiş token'lar (yalnızca pozitif sorgular)", "24 saat"],
				]} />
			<p>
				Bir değişiklik, onu yapan instance&apos;ta hemen görünür. <strong>Diğer instance&apos;lar, önbellekteki kopyalarının süresi dolduğunda görür.</strong> Pratikte:
			</p>
			<ul>
				<li>
					bir rol değişikliğinin her yerde geçerli olması 5 dakikayı bulabilir;
				</li>
				<li>
					bir membership değişikliği (token ömürleri, mail sağlayıcıları, OTP ayarları…) 1 saati bulabilir;
				</li>
				<li>
					iptaller her yerde hemen görülür, çünkü yalnızca iptal edilmiş token&apos;lar önbelleğe alınır.
				</li>
			</ul>
			<p>
				Bir değişikliğin hemen geçerli olması gerekiyorsa instance&apos;ları yeniden başlatın.
			</p>

			<H3 id="background-work">
				Arka plan işleri
			</H3>
			<p>
				Webhook&apos;lar ve mail hook&apos;lar, olayın gerçekleştiği instance&apos;taki bellek içi kuyruklardan işlenir:
			</p>
			<Table
				head={["Kuyruk", "Kapasite", "Paralel çağrı"]}
				rows={[
					["Webhook'lar", "10.000", "8"],
					["Mail'ler", "10.000", "4"],
				]} />
			<p>
				Kuyruk dolduğunda yeni öğeler atılır ve loglanır. Kapanışta kuyruklar en fazla 30 saniye boyunca boşaltılır; bu sürenin sonunda hâlâ kuyrukta olan öğeler kaybolur. Pod&apos;larınıza en az 30 saniyelik bir termination grace period verin.
			</p>

			<H2 id="database">
				Veritabanı
			</H2>

			<H3 id="indexes">
				Index&apos;ler
			</H3>
			<p>
				ErtisAuth ihtiyaç duyduğu index&apos;leri başlangıçta oluşturur; bunlar arasında:
			</p>
			<ul>
				<li>
					kullanıcı tiplerinin <DocLink to="user-types" hash="unique-fields">benzersiz alanları</DocLink> için unique index&apos;ler; bir kullanıcı tipi her değiştiğinde eşitlenir (ve başlangıçta yeniden kontrol edilir);
				</li>
				<li>
					arama için text index&apos;ler;
				</li>
				<li>
					süresi dolan verileri otomatik silen <strong>TTL index&apos;leri</strong>: aktif token&apos;lar, iptal edilmiş token&apos;lar, token kodları ve tek kullanımlık şifreler süreleri dolduktan birkaç dakika sonra silinir.
				</li>
			</ul>

			<H3 id="retention">
				Saklama süresi
			</H3>
			<p>
				<code>events</code> koleksiyonu otomatik olarak <strong>temizlenmez</strong> ve her giriş ve değişiklikle büyür. Denetim kaydına ne kadar süre ihtiyacınız olduğuna karar verin ve eski olayları düzenli olarak silin; örneğin <code>event_time</code> üzerinde kendi TTL index&apos;inizle:
			</p>
			<Code language="javascript" code={samples.eventsTtl} />

			<H3 id="backups">
				Yedekler
			</H3>
			<p>
				ErtisAuth&apos;un bildiği her şey MongoDB veritabanındadır. Onu her production veritabanı gibi yedekleyin ve yedekleri koruyun: parola hash&apos;lerini, membership secret key&apos;lerini, sağlayıcı anahtarlarını ve mail sağlayıcısı kimlik bilgilerini içerirler.
			</p>

			<H2 id="security-checklist">
				Güvenlik kontrol listesi
			</H2>
			<ul>
				<li>
					ErtisAuth&apos;u yalnızca <strong>HTTPS</strong> üzerinden sunun. Basic token&apos;lar ve parolalar TLS bağlantısı içinde düz metin olarak taşınır.
				</li>
				<li>
					Her membership için uzun ve rastgele bir <code>secret_key</code> kullanın (<code>openssl rand -base64 48</code>) ve gizli tutun.
				</li>
				<li>
					Yeni membership&apos;lerde hash algoritması olarak <code>ARGON2ID</code> kullanın.
				</li>
				<li>
					<code>Database:ConnectionString</code> ve diğer secret&apos;ları kaynak kontrolünün dışında tutun.
				</li>
				<li>
					Hassas okuma yetkilerini yalnızca operatörlere verin:
					<ul>
						<li>
							<code>memberships.read</code> secret key&apos;leri ve mail kimlik bilgilerini açığa çıkarır,
						</li>
						<li>
							<code>tokens.read</code> canlı token&apos;ları açığa çıkarır,
						</li>
						<li>
							<code>events.read</code> kullanıcı verilerini açığa çıkarır.
						</li>
					</ul>
				</li>
				<li>
					Her uygulamaya yalnızca ihtiyacı olanı içeren kendi rolünü verin ve uygulama secret&apos;larını düzenli olarak yenileyin.
				</li>
				<li>
					Herkese açık endpoint&apos;lere gateway&apos;inizde <strong>istek sınırı</strong> koyun: <code>/generate-token</code>, <code>/verify-otp</code>, <code>/oauth/{"{slug}"}/login</code>, <code>/memberships/{"{m}"}/codes</code> ve <code>/memberships/{"{m}"}/codes/token</code>. ErtisAuth istek hızını kendisi sınırlamaz.
				</li>
				<li>
					İstemcileriniz yalnızca bilinen origin&apos;lerdeyse CORS&apos;u gateway&apos;inizde kısıtlayın (ErtisAuth her origin&apos;e izin verir).
				</li>
				<li>
					<code>/users/check-password</code> isteklerinin query string&apos;lerini loglamayın (parola taşır).
				</li>
				<li>
					<code>/metrics</code>&apos;i internete kapatın.
				</li>
				<li>
					Sağlayıcılarda <code>trust_email</code>&apos;i yalnızca ne anlama geldiğini kontrol ettikten sonra açın (bkz. <DocLink to="external-providers" hash="linking-to-existing-accounts">Harici Kimlik Sağlayıcılar</DocLink>).
				</li>
				<li>
					<code>events</code> koleksiyonunun saklama süresini planlayın.
				</li>
			</ul>
		</>
	)
}
