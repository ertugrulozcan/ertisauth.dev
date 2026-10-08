import * as samples from "../samples/applications"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Applications() {
	return (
		<>
			<p>
				Uygulama, ErtisAuth&apos;un bir <strong>makine istemcisidir</strong>: bir backend servisi, bir worker, sunucu taraflı bir web uygulaması. Uygulamalar giriş yapmaz; her istekte bir Basic token gönderir:
			</p>
			<Code language="http" code={samples.basicHeader} />
			<p>
				Kullanıcılar gibi uygulamaların da bir <DocLink to="roles">rolü</DocLink> vardır ve kendilerine ait yetkileri (<code>permissions</code>, <code>forbidden</code>) olabilir; bunlar <DocLink to="authorization">Yetkilendirme</DocLink> sayfasında anlatıldığı gibi değerlendirilir.
			</p>
			<p>
				Tipik kullanımlar:
			</p>
			<ul>
				<li>
					ürününüz adına kullanıcıları yöneten bir backend (kayıt, profil sayfaları, yönetim ekranları),
				</li>
				<li>
					parola sıfırlama ve aktivasyon sayfalarınızın, ErtisAuth&apos;u uygulamanın token&apos;ıyla çağıran sunucu tarafı,
				</li>
				<li>
					<DocLink to="sdk">SDK</DocLink> ile korunan ve birbirini çağıran servisler.
				</li>
			</ul>

			<H2 id="the-application-object">
				Uygulama nesnesi
			</H2>
			<Code language="json" code={samples.application} />
			<Table
				head={["Alan", "Zorunlu", "Açıklama"]}
				rows={[
					[<code>name</code>, "evet", "Görünen ad."],
					[<code>slug</code>, "hayır", "Membership içinde benzersiz; verilmezse addan türetilir."],
					[<code>role</code>, "evet", "Var olan bir rolün slug'ı."],
					[<><code>permissions</code>, <code>forbidden</code></>, "hayır", <>Uygulamanın UBAC girdileri (<code>resource.action.object</code>).</>],
				]} />
			<p>
				Secret hiçbir zaman uygulama nesnesinin parçası değildir.
			</p>

			<H2 id="the-secret">
				Secret
			</H2>
			<ul>
				<li>
					Secret, uygulama oluşturulurken <strong>üretilir</strong> ve <strong>yalnızca o yanıtta</strong> döndürülür.
				</li>
				<li>
					ErtisAuth yalnızca hash&apos;ini saklar. Yöneticiler dahil hiç kimse onu geri okuyamaz.
				</li>
				<li>
					Süresi dolmaz. Sızmış olabileceğinde ya da rutin olarak <a href="#rotate-the-secret">secret yenileme</a> ile değiştirin.
				</li>
			</ul>
			<p>
				Secret&apos;ı bir parola gibi saklayın: bir secret store&apos;da ya da bir ortam değişkeninde; asla kaynak kontrolünde ya da tarayıcıda değil.
			</p>

			<H2 id="endpoints">
				Endpoint&apos;ler
			</H2>
			<p>
				Tüm route&apos;lar <code>{"/memberships/{membershipId}"}</code> altındadır.
			</p>
			<Table
				head={["Metot", "Route", "Açıklama", "Yetki"]}
				rows={[
					[<code>GET</code>, <code>{"/applications/{id}"}</code>, "Uygulama getirme (id ya da slug)", <code>{"applications.read.{id}"}</code>],
					[<code>GET</code>, <code>/applications</code>, "Uygulamaları listeleme", <code>applications.read</code>],
					[<code>POST</code>, <code>/applications/_query</code>, "Uygulamaları sorgulama", <code>applications.read</code>],
					[<code>GET</code>, <code>/applications/search?keyword=</code>, "Uygulama arama", <code>applications.read</code>],
					[<code>POST</code>, <code>/applications</code>, "Uygulama oluşturma", <code>applications.create</code>],
					[<code>PUT</code>, <code>{"/applications/{id}"}</code>, "Uygulama güncelleme", <code>{"applications.update.{id}"}</code>],
					[<code>POST</code>, <code>{"/applications/{id}/secret"}</code>, "Secret yenileme", <code>{"applications.update.{id}"}</code>],
					[<code>DELETE</code>, <code>{"/applications/{id}"}</code>, "Uygulama silme", <code>{"applications.delete.{id}"}</code>],
					[<code>DELETE</code>, <code>/applications</code>, "Birden fazla uygulama silme", <code>applications.delete</code>],
				]} />
			<p>
				Bir uygulama, rolü yasaklamadıkça kendi kaydını her zaman okuyabilir ve güncelleyebilir.
			</p>

			<H3 id="create-an-application">
				Uygulama oluşturma
			</H3>
			<Code language="shell" code={samples.create} />
			<p>
				<strong>Yanıt <code>201 Created</code></strong>
			</p>
			<Code language="json" code={samples.createResponse} />
			<p>
				<code>secret</code>&apos;ı şimdi kaydedin: bir daha okunamaz.
			</p>
			<Table
				head={["Hata", "Ne zaman"]}
				rows={[
					[<code>400 ModelValidationError</code>, "Ad ya da rol eksik, bilinmeyen rol, geçersiz slug ya da aynı ifade iki listede birden var"],
					[<code>404 MembershipNotFound</code>, "Membership yok"],
					[<code>409 ApplicationAlreadyExists</code>, "Slug kullanımda"],
				]} />

			<H3 id="update-an-application">
				Uygulama güncelleme
			</H3>
			<Code language="http" code={samples.update} />
			<p>
				<code>name</code>, <code>slug</code>, <code>role</code>, <code>permissions</code> ve <code>forbidden</code> alanlarını günceller. Secret burada değiştirilmez. Hiçbir değişiklik içermeyen bir güncelleme <code>409 IdenticalDocumentError</code> döner.
			</p>

			<H3 id="rotate-the-secret">
				Secret yenileme
			</H3>
			<Code language="http" code={samples.rotateSecret} />
			<p>
				<strong>Yanıt <code>200 OK</code></strong>: yeni <code>secret</code>&apos;ıyla birlikte uygulama.
			</p>
			<Callout type="warning">
				eski secret <strong>hemen</strong> çalışmaz hale gelir. Yeni secret&apos;ı uygulamaya hemen dağıtın; Basic token&apos;ları SDK üzerinden önbelleğe alan servisler eskisini <code>BasicTokenCacheTTL</code> süreleri boyunca kabul etmeye devam edebilir.
			</Callout>

			<H3 id="delete-an-application">
				Uygulama silme
			</H3>
			<Code language="http" code={samples.remove} />
			<p>
				<strong>Yanıt <code>204 No Content</code></strong>. Uygulamanın Basic token&apos;ı çalışmaz hale gelir.
			</p>

			<H2 id="using-the-basic-token">
				Basic token&apos;ı kullanma
			</H2>
			<Code language="shell" code={samples.useBasicToken} />
			<ul>
				<li>
					Token, düz metin olarak <code>id:secret</code> biçimindedir; base64 ile <strong>kodlanmaz</strong>.
				</li>
				<li>
					Basic token&apos;la <code>GET /me</code> uygulamayı döner.
				</li>
				<li>
					Bilinmeyen bir uygulama, yanlış bir secret ve bilinmeyen bir membership&apos;in hepsi <code>401 InvalidToken</code> ile yanıtlanır.
				</li>
			</ul>

			<H2 id="migrating-legacy-applications">
				Eski uygulamaları taşıma
			</H2>
			<p>
				Uygulamaya özel secret&apos;lardan önce oluşturulan uygulamalar, secret olarak <strong>membership&apos;in secret key&apos;iyle</strong> kimlik doğruluyordu. Bir geçiş sırasında çalışmaya devam etmeleri için membership, <strong>henüz kendi secret&apos;ı olmayan</strong> uygulamalar için membership secret&apos;ını geçici olarak kabul edebilir:
			</p>
			<Code language="json" code={samples.legacySwitch} />
			<p>
				Bu alan <DocLink to="memberships" hash="update-a-membership">membership güncelleme</DocLink> isteğinin parçasıdır. Her uygulamayı <a href="#rotate-the-secret">secret&apos;ını yenileyip</a> yenisini dağıtarak taşıyın; o andan itibaren yalnızca kendi secret&apos;ı çalışır. Tüm uygulamalar taşındığında anahtarı <code>false</code> yapın.
			</p>
			<Callout>
				bu anahtar geçicidir ve gelecekteki bir sürümde kaldırılacaktır. Yeni membership&apos;lerde kapalıdır.
			</Callout>

			<H2 id="events">
				Olaylar
			</H2>
			<p>
				<code>ApplicationCreated</code>, <code>ApplicationUpdated</code> ve <code>ApplicationDeleted</code>. Bkz. <DocLink to="events">Olaylar</DocLink>.
			</p>
		</>
	)
}
