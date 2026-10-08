import * as samples from "../samples/configuration"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Configuration() {
	return (
		<>
			<p>
				ErtisAuth ayarlarını ASP.NET Core&apos;un standart yapılandırma sistemiyle okur: <code>appsettings.json</code>, <code>appsettings.{"{Environment}"}.json</code>, ortam değişkenleri ve komut satırı argümanları; öncelik bu sırayla artar.
			</p>
			<p>
				Ortam değişkenlerinde iç içe anahtarlar çift alt çizgiyle ayrılır: <code>Database:ConnectionString</code>, <code>Database__ConnectionString</code> olur.
			</p>
			<p>
				ErtisAuth&apos;un davranışının büyük kısmı (token süreleri, hash algoritması, mail sağlayıcıları, aktivasyon, OTP) sunucu yapılandırması değildir: API üzerinden <strong>membership bazında</strong> ayarlanır. Bkz. <DocLink to="memberships">Membership&apos;ler</DocLink>.
			</p>

			<H2 id="settings">
				Ayarlar
			</H2>

			<H3 id="database">
				Veritabanı
			</H3>
			<Table>
				<thead>
					<tr>
						<th>
							Anahtar
						</th>
						<th>
							Varsayılan
						</th>
						<th>
							Açıklama
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<code>Database:ConnectionString</code>
						</td>
						<td>
							yok (zorunlu)
						</td>
						<td>
							MongoDB bağlantı dizesi, ör. <code>mongodb://user:password@host:27017</code>.
						</td>
					</tr>
					<tr>
						<td>
							<code>Database:DefaultAuthDatabase</code>
						</td>
						<td>
							<code>auth</code>
						</td>
						<td>
							ErtisAuth&apos;un kullandığı veritabanının adı.
						</td>
					</tr>
					<tr>
						<td>
							<code>Database:AllowDiskUse</code>
						</td>
						<td>
							<code>false</code>
						</td>
						<td>
							Büyük sıralama ve aggregation işlemlerinde MongoDB&apos;nin geçici dosya kullanmasına izin verir.
						</td>
					</tr>
				</tbody>
			</Table>
			<p>
				ErtisAuth MongoDB transaction&apos;larını kullanmaz; bu yüzden tek başına çalışan bir sunucu da replica set kadar iyi çalışır.
			</p>

			<H3 id="azure-application-insights">
				Azure Application Insights
			</H3>
			<Table>
				<thead>
					<tr>
						<th>
							Anahtar
						</th>
						<th>
							Varsayılan
						</th>
						<th>
							Açıklama
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<code>ApplicationInsights:ConnectionString</code>
						</td>
						<td>
							boş
						</td>
						<td>
							Ayarlandığında trace&apos;ler, metrikler ve loglar OpenTelemetry üzerinden Azure Monitor&apos;a gönderilir. Boşsa hiçbir şey gönderilmez.
						</td>
					</tr>
				</tbody>
			</Table>

			<H3 id="logging">
				Loglama
			</H3>
			<p>
				ASP.NET Core&apos;un standart <code>Logging</code> bölümü:
			</p>
			<Code language="json" code={samples.logging} />

			<H3 id="hosting">
				Barındırma
			</H3>
			<p>
				ASP.NET Core&apos;un standart ayarları geçerlidir, örneğin:
			</p>
			<Table>
				<thead>
					<tr>
						<th>
							Değişken
						</th>
						<th>
							Açıklama
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<code>ASPNETCORE_ENVIRONMENT</code>
						</td>
						<td>
							<code>Development</code>, OpenAPI dokümanını ve <code>/docs</code> adresindeki Scalar API referansını açar.
						</td>
					</tr>
					<tr>
						<td>
							<code>ASPNETCORE_HTTP_PORTS</code> / <code>ASPNETCORE_URLS</code>
						</td>
						<td>
							Sunucunun dinlediği portlar ya da URL&apos;ler. Docker imajı <code>8080</code> portunda dinler.
						</td>
					</tr>
				</tbody>
			</Table>

			<H2 id="example">
				Örnek
			</H2>
			<Code language="json" code={samples.example} />
			<p>
				Aynısı ortam değişkenleriyle:
			</p>
			<Code language="shell" code={samples.environment} />
			<Callout>
				bağlantı dizelerini ve anahtarları kaynak kontrolünün dışında tutun. Ortam değişkenlerini ya da platformunuzun secret deposunu kullanın.
			</Callout>

			<H2 id="built-in-behaviour">
				Yerleşik davranışlar
			</H2>
			<p>
				Bunlar sunucuda sabittir; ne bekleyeceğinizi bilmeniz için burada listelenmiştir:
			</p>
			<Table>
				<thead>
					<tr>
						<th>
							Davranış
						</th>
						<th>
							Değer
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							CORS
						</td>
						<td>
							Her origin&apos;e, metoda ve header&apos;a izin verilir. Gerekirse gateway&apos;inizde kısıtlayın.
						</td>
					</tr>
					<tr>
						<td>
							Yanıt sıkıştırma
						</td>
						<td>
							Brotli ve Gzip, HTTPS üzerinde de.
						</td>
					</tr>
					<tr>
						<td>
							HTTPS yönlendirmesi
						</td>
						<td>
							Açık. TLS&apos;i ingress&apos;inizde sonlandırın ya da Kestrel için bir sertifika yapılandırın.
						</td>
					</tr>
					<tr>
						<td>
							Kontrollü kapanma
						</td>
						<td>
							Devam eden istekler ile kuyruktaki webhook ve e-postalar için en fazla 30 saniye.
						</td>
					</tr>
					<tr>
						<td>
							Prometheus metrikleri
						</td>
						<td>
							<code>/metrics</code> adresinde (bkz. <DocLink to="operations" hash="metrics">Operasyon</DocLink>).
						</td>
					</tr>
					<tr>
						<td>
							Aktivasyon token&apos;ının süresi
						</td>
						<td>
							72 saat.
						</td>
					</tr>
					<tr>
						<td>
							Şifre sıfırlama token&apos;ının süresi
						</td>
						<td>
							Membership <code>reset_password_token_expires_in</code> ayarlamadıkça 2 saat.
						</td>
					</tr>
					<tr>
						<td>
							Scoped token süresi
						</td>
						<td>
							Membership <code>scoped_token_expires_in</code> ayarlamadıkça 12 saat.
						</td>
					</tr>
					<tr>
						<td>
							En kısa şifre uzunluğu
						</td>
						<td>
							6 karakter.
						</td>
					</tr>
				</tbody>
			</Table>
		</>
	)
}
