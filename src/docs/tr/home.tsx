import { DocLink, H2, Table } from "@/components/docs/prose"

export default function Home() {
	return (
		<>
			<p>
				ErtisAuth, ASP.NET Core ve MongoDB üzerine kurulu, kendi sunucunuzda çalışan bir kimlik ve erişim yönetimi (IAM) sunucusudur. Kullanıcıları ve uygulamaları giriş yaptırır, kullanıcılar ve uygulamalar arası iletişimi ve makineler arası iletişimi güvenli hale getirir, token üretir ve aynı kullanıcıları ve yetkileri paylaşan istediğiniz sayıda uygulama için her çağıranın, her kaynak ve işlemde tanımlı yetkilerine bağlı olarak ne yapıp ne yapamayacağına karar verir.
			</p>
			<p>
				Bu dokümantasyon ErtisAuth&apos;un eksiksiz rehberidir: nasıl çalıştığını, nasıl çalıştırılacağını ve REST API&apos;sinin tüm endpoint&apos;lerini istek ve yanıt örnekleriyle anlatır. Etkileşimli OpenAPI referansı (geliştirme ortamındaki bir sunucuda <code>/docs</code>) aynı endpoint&apos;leri listeler; bu dokümantasyon bunlara kavramları, birden fazla endpoint&apos;i birleştiren akışları ve yalnızca bir şemanın gösteremeyeceği kuralları ekler.
			</p>

			<H2 id="where-to-start">
				Nereden başlamalı
			</H2>
			<Table>
				<thead>
					<tr>
						<th>
							Şunu yapmak istiyorsanız...
						</th>
						<th>
							Okuyun
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							ErtisAuth&apos;u ilk kez çalıştırmak
						</td>
						<td>
							<DocLink to="getting-started">Başlangıç</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Yapı taşlarını anlamak
						</td>
						<td>
							<DocLink to="core-concepts">Temel Kavramlar</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Tüm endpoint&apos;lerin ortak kurallarını öğrenmek
						</td>
						<td>
							<DocLink to="api-conventions">API Kuralları</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Kullanıcıları giriş yaptırmak ve token&apos;larla çalışmak
						</td>
						<td>
							<DocLink to="authentication">Kimlik Doğrulama</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Kimin neyi yapabileceğini belirlemek
						</td>
						<td>
							<DocLink to="authorization">Yetkilendirme</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Kendi .NET API&apos;lerinizi ErtisAuth ile korumak
						</td>
						<td>
							<DocLink to="sdk">.NET SDK</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							ErtisAuth&apos;u production&apos;da çalıştırmak
						</td>
						<td>
							<DocLink to="operations">Operasyon</DocLink>
						</td>
					</tr>
				</tbody>
			</Table>

			<H2 id="guides">
				Rehberler
			</H2>
			<ul>
				<li>
					<DocLink to="getting-started">Başlangıç</DocLink>: kurulum, yapılandırma, ilk kurulum ve ilk token&apos;ınız.
				</li>
				<li>
					<DocLink to="configuration">Yapılandırma</DocLink>: sunucunun tüm ayarları.
				</li>
				<li>
					<DocLink to="core-concepts">Temel Kavramlar</DocLink>: membership&apos;ler, kullanıcılar, kullanıcı tipleri, roller, uygulamalar ve dahası.
				</li>
				<li>
					<DocLink to="api-conventions">API Kuralları</DocLink>: route&apos;lar, header&apos;lar, sayfalama, sorgular ve hatalar.
				</li>
				<li>
					<DocLink to="authentication">Kimlik Doğrulama</DocLink>: token&apos;lar, giriş, yenileme, doğrulama ve çıkış.
				</li>
				<li>
					<DocLink to="authorization">Yetkilendirme</DocLink>: RBAC ve UBAC yetki modeli.
				</li>
				<li>
					<DocLink to="account-recovery">Hesap Kurtarma ve Aktivasyon</DocLink>: aktivasyon e-postaları, şifre sıfırlama ve tek kullanımlık şifreler.
				</li>
				<li>
					<DocLink to="device-code-flow">Cihaz Kodu Akışı</DocLink>: klavyesi olmayan cihazlarda giriş.
				</li>
				<li>
					<DocLink to="external-providers">Harici Kimlik Sağlayıcılar</DocLink>: Google, Apple, Facebook ve Microsoft ile giriş.
				</li>
				<li>
					<DocLink to="events">Olaylar</DocLink>, <DocLink to="webhooks">Webhook&apos;lar</DocLink> ve <DocLink to="mail-hooks">Mail Hook&apos;lar</DocLink>: bir membership&apos;te olup bitenlere tepki verin.
				</li>
				<li>
					<DocLink to="sdk">.NET SDK</DocLink>: istemci SDK&apos;sı ve ASP.NET Core entegrasyonu.
				</li>
				<li>
					<DocLink to="operations">Operasyon</DocLink>: health check&apos;ler, metrikler, loglama, index&apos;ler ve production kontrol listesi.
				</li>
			</ul>

			<H2 id="api-reference">
				API referansı
			</H2>
			<Table>
				<thead>
					<tr>
						<th>
							Kaynak
						</th>
						<th>
							Sayfa
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							İlk kurulum, health check
						</td>
						<td>
							<DocLink to="getting-started">Başlangıç</DocLink>, <DocLink to="operations">Operasyon</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Token&apos;lar
						</td>
						<td>
							<DocLink to="authentication">Kimlik Doğrulama</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Aktif token&apos;lar, iptal edilmiş token&apos;lar
						</td>
						<td>
							<DocLink to="sessions">Oturumlar</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Membership&apos;ler
						</td>
						<td>
							<DocLink to="memberships">Membership&apos;ler</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Kullanıcılar
						</td>
						<td>
							<DocLink to="users">Kullanıcılar</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Kullanıcı tipleri
						</td>
						<td>
							<DocLink to="user-types">Kullanıcı Tipleri</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Roller
						</td>
						<td>
							<DocLink to="roles">Roller</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Uygulamalar
						</td>
						<td>
							<DocLink to="applications">Uygulamalar</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Sağlayıcılar
						</td>
						<td>
							<DocLink to="external-providers">Harici Kimlik Sağlayıcılar</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Kod politikaları, token kodları
						</td>
						<td>
							<DocLink to="device-code-flow">Cihaz Kodu Akışı</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Olaylar
						</td>
						<td>
							<DocLink to="events">Olaylar</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Webhook&apos;lar
						</td>
						<td>
							<DocLink to="webhooks">Webhook&apos;lar</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Mail hook&apos;lar
						</td>
						<td>
							<DocLink to="mail-hooks">Mail Hook&apos;lar</DocLink>
						</td>
					</tr>
					<tr>
						<td>
							Hata kodları
						</td>
						<td>
							<DocLink to="error-codes">Hata Kodları</DocLink>
						</td>
					</tr>
				</tbody>
			</Table>

			<H2 id="license">
				Lisans
			</H2>
			<p>
				ErtisAuth, <a href="https://github.com/ertugrulozcan/ErtisAuth/blob/master/LICENSE">MIT Lisansı</a> ile açık kaynaktır.
			</p>
		</>
	)
}
