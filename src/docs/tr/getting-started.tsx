import * as samples from "../samples/getting-started"
import { Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function GettingStarted() {
	return (
		<>
			<p>
				Bu rehber, boş bir makineden başlayıp membership&apos;i, yöneticisi ve ilk token&apos;ı olan, çalışır durumda bir ErtisAuth sunucusuna ulaşmanızı sağlar. Yaklaşık on dakika sürer.
			</p>

			<H2 id="1-requirements">
				1. Gereksinimler
			</H2>
			<ul>
				<li>
					<a href="https://dotnet.microsoft.com/download">.NET 10 SDK</a> (kaynak koddan derlemek için) ya da Docker
				</li>
				<li>
					<a href="https://www.mongodb.com/">MongoDB</a> 7.0 veya üstü. Tek başına çalışan bir sunucu yeterlidir; replica set gerekmez.
				</li>
			</ul>

			<H2 id="2-run-ertisauth">
				2. ErtisAuth&apos;u çalıştırın
			</H2>

			<H3 id="from-source">
				Kaynak koddan
			</H3>
			<Code language="shell" code={samples.fromSource} />
			<p>
				Geliştirme ortamında API <code>http://localhost:9716</code> adresinde dinler, etkileşimli API referansı da <code>http://localhost:9716/docs</code> adresindedir.
			</p>

			<H3 id="with-docker-compose">
				Docker Compose ile
			</H3>
			<p>
				Repo, ErtisAuth&apos;u bir MongoDB ile birlikte başlatan bir <code>docker-compose.yml</code> dosyası içerir:
			</p>
			<Code language="shell" code={samples.dockerCompose} />
			<p>
				API <code>http://localhost:9716</code> adresinde dinler, API referansı <code>http://localhost:9716/docs</code> adresindedir. MongoDB verileri <code>mongo-data</code> volume&apos;ünde saklanır.
			</p>

			<H3 id="with-docker">
				Docker ile
			</H3>
			<p>
				İmajı derleyin ve kendi MongoDB&apos;nizle çalıştırın:
			</p>
			<Code language="shell" code={samples.docker} />
			<p>
				Container <strong>8080</strong> portunda dinler ve .NET imajlarının root olmayan <code>app</code> kullanıcısıyla çalışır. ICU ve saat dilimi veritabanını içeren Debian tabanlı ASP.NET Core imajını kullandığı için kültür ve saat dilimi işlemleri bir geliştirme makinesindeki gibi çalışır.
			</p>
			<p className="border-l-4 border-border text-faint italic pl-4">
				NOT: Alpine varyantı docker imajlarında lokalizasyon ve globalizasyon için ihtiyaç duyulan bazı ICU paketleri eksik olabilir. ErtisAuth için kullanımı tavsiye edilmez.
			</p>
			<p>
				ErtisAuth verilerini <code>Database:DefaultAuthDatabase</code> ayarıyla belirtilen veritabanında saklar (varsayılan olarak <code>auth</code>). Tüm ayarlar için <DocLink to="configuration">Yapılandırma</DocLink> sayfasına bakın.
			</p>
			<p>
				ErtisAuth başlarken ihtiyaç duyduğu index&apos;leri oluşturur. Çalıştığını kontrol edin:
			</p>
			<Code language="shell" code={samples.healthCheck} />
			<Code language="json" code={samples.healthCheckResponse} />
			<p>
				Bu aşamada bu mesajla birlikte <code>Unhealthy</code> yanıtı beklenen bir durumdur: sunucu çalışıyor, ama henüz bir membership&apos;i yok.
			</p>

			<H2 id="3-set-up-the-installation">
				3. İlk kurulumu yapın
			</H2>
			<p>
				Yeni bir kurulumda hiç kullanıcı yoktur; bu yüzden ilk kullanıcıları oluşturmak için kimse giriş yapamaz. <strong>Setup endpoint&apos;i</strong> bu sorunu çözer: ilk kaynakları tek bir çağrıyla oluşturur ve veritabanına sizin eklediğiniz bir token ile yetkilendirilir. Veritabanına yazma erişiminizin olması, kurulumun operatörü olduğunuzu kanıtlar.
			</p>

			<H3 id="31-insert-a-setup-token">
				3.1 Bir setup token&apos;ı ekleyin
			</H3>
			<p>
				En az 32 karakterlik rastgele bir token üretin:
			</p>
			<Code language="shell" code={samples.setupToken} />
			<p>
				Token&apos;ı ErtisAuth veritabanındaki <code>setup</code> koleksiyonuna ekleyin (<code>mongosh</code> ile):
			</p>
			<Code language="javascript" code={samples.insertSetupToken} />
			<p>
				Docker Compose kullanıyorsanız komutu MongoDB container&apos;ında çalıştırın:
			</p>
			<Code language="shell" code={samples.insertSetupTokenCompose} />

			<H3 id="32-call-the-setup-endpoint">
				3.2 Setup endpoint&apos;ini çağırın
			</H3>
			<Code language="shell" code={samples.setup} />
			<Table>
				<thead>
					<tr>
						<th>
							Alan
						</th>
						<th>
							Zorunlu
						</th>
						<th>
							Açıklama
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<code>membership.name</code>
						</td>
						<td>
							evet
						</td>
						<td>
							Membership&apos;in görünen adı.
						</td>
					</tr>
					<tr>
						<td>
							<code>membership.slug</code>
						</td>
						<td>
							hayır
						</td>
						<td>
							URL&apos;lerde kullanılabilen ad; verilmezse addan türetilir.
						</td>
					</tr>
					<tr>
						<td>
							<code>membership.expires_in</code>
						</td>
						<td>
							evet
						</td>
						<td>
							Access token&apos;ın geçerlilik süresi, saniye cinsinden.
						</td>
					</tr>
					<tr>
						<td>
							<code>membership.refresh_token_expires_in</code>
						</td>
						<td>
							evet
						</td>
						<td>
							Refresh token&apos;ın geçerlilik süresi, saniye cinsinden.
						</td>
					</tr>
					<tr>
						<td>
							<code>membership.hash_algorithm</code>
						</td>
						<td>
							evet
						</td>
						<td>
							Şifre hash algoritması. <code>ARGON2ID</code> önerilir (bkz. <DocLink to="memberships" hash="password-hash-algorithms">Membership&apos;ler</DocLink>).
						</td>
					</tr>
					<tr>
						<td>
							<code>membership.encoding</code>
						</td>
						<td>
							hayır
						</td>
						<td>
							Hash&apos;leme ve imzalamada kullanılan metin kodlaması (varsayılan olarak <code>UTF-8</code>).
						</td>
					</tr>
					<tr>
						<td>
							<code>membership.secret_key</code>
						</td>
						<td>
							hayır
						</td>
						<td>
							Token&apos;ların imzalandığı anahtar, en az 32 bayt. Verilmezse rastgele bir anahtar üretilir.
						</td>
					</tr>
					<tr>
						<td>
							<code>user.*</code>
						</td>
						<td>
							evet
						</td>
						<td>
							Yönetici kullanıcı. <code>firstname</code>, <code>username</code>, <code>email_address</code> ve <code>password</code> (en az 6 karakter) zorunludur.
						</td>
					</tr>
					<tr>
						<td>
							<code>user.user_type</code>
						</td>
						<td>
							hayır
						</td>
						<td>
							Yönetici için oluşturulan kullanıcı tipinin adı (varsayılan olarak <code>User</code>).
						</td>
					</tr>
					<tr>
						<td>
							<code>application</code>
						</td>
						<td>
							hayır
						</td>
						<td>
							Makineler arası erişim için bir uygulama; genellikle <code>admin</code> rolüyle.
						</td>
					</tr>
				</tbody>
			</Table>
			<p>
				Setup şunları bu sırayla oluşturur:
			</p>
			<ol>
				<li>
					<strong>membership</strong>,
				</li>
				<li>
					tüm ErtisAuth kaynakları üzerinde her yetkiye sahip <strong><code>admin</code> rolü</strong>,
				</li>
				<li>
					yerleşik <code>base-user</code> tipinden türeyen bir <strong>kullanıcı tipi</strong>,
				</li>
				<li>
					<code>admin</code> rolüne sahip, aktif durumda <strong>yönetici kullanıcı</strong>,
				</li>
				<li>
					istendiyse <strong>uygulama</strong>.
				</li>
			</ol>
			<p>
				Adımlardan biri başarısız olursa ondan önce oluşturulan kaynaklar silinir; bu yüzden başarısız bir setup doğrudan tekrar denenebilir.
			</p>

			<H3 id="33-keep-the-response">
				3.3 Yanıtı saklayın
			</H3>
			<Code language="json" code={samples.setupResponse} />
			<p>
				Şunları not edin:
			</p>
			<ul>
				<li>
					<strong><code>membership._id</code></strong>: her giriş isteğinde göndereceksiniz.
				</li>
				<li>
					<strong><code>application.secret</code></strong>: yalnızca bir kez döner. ErtisAuth yalnızca hash&apos;ini saklar; kaybederseniz <DocLink to="applications" hash="rotate-the-secret">yenisini üretin</DocLink>.
				</li>
			</ul>
			<p>
				Setup başarılı olunca <code>setup</code> koleksiyonu silinir ve endpoint kalıcı olarak kapanır: sonraki çağrılar <code>409 AlreadySetUp</code> döner. Health check artık <code>Healthy</code> yanıtını verir.
			</p>

			<H2 id="4-sign-in">
				4. Giriş yapın
			</H2>
			<Code language="shell" code={samples.signIn} />
			<Code language="json" code={samples.signInResponse} />
			<p>
				<code>username</code> alanı e-posta adresini de kabul eder.
			</p>

			<H2 id="5-call-the-api">
				5. API&apos;yi çağırın
			</H2>
			<Code language="shell" code={samples.me} />
			<Code language="shell" code={samples.listUsers} />
			<p>
				Uygulama da aynı endpoint&apos;leri, id&apos;si ve secret&apos;ından oluşan bir Basic token ile çağırabilir:
			</p>
			<Code language="shell" code={samples.basicToken} />

			<H2 id="next-steps">
				Sonraki adımlar
			</H2>
			<ul>
				<li>
					Kullanıcı modelinizi <DocLink to="user-types">Kullanıcı Tipleri</DocLink> ile tasarlayın.
				</li>
				<li>
					Kullanıcılarınız için <DocLink to="roles">Roller</DocLink> sayfasında roller oluşturun ve <DocLink to="authorization">yetki modelini</DocLink> öğrenin.
				</li>
				<li>
					Aktivasyon ve şifre sıfırlama e-postalarını <DocLink to="mail-hooks">Mail Hook&apos;lar</DocLink> ve <DocLink to="account-recovery">Hesap Kurtarma</DocLink> ile yapılandırın.
				</li>
				<li>
					Kendi servislerinizi <DocLink to="sdk">.NET SDK</DocLink> ile koruyun.
				</li>
			</ul>
		</>
	)
}
