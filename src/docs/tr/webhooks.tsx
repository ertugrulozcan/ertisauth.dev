import * as samples from "../samples/webhooks"
import { Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Webhooks() {
	return (
		<>
			<p>
				Webhook, membership&apos;te belirli bir <DocLink to="events">olay</DocLink> gerçekleştiğinde seçtiğiniz bir URL&apos;ye HTTP isteği gönderir. Diğer sistemleri ErtisAuth ile senkron tutmak için webhook&apos;ları kullanın: bir kullanıcı kaydolduğunda bir müşteri kaydı oluşturun, bir kullanıcı silindiğinde verilerini temizleyin, bir rol değiştiğinde bir sohbet kanalına mesaj gönderin.
			</p>

			<H2 id="the-webhook-object">
				Webhook nesnesi
			</H2>
			<Code language="json" code={samples.webhook} />
			<Table
				head={["Alan", "Zorunlu", "Açıklama"]}
				rows={[
					[<code>name</code>, "evet", "Görünen ad."],
					[<code>description</code>, "hayır", ""],
					[<code>event</code>, "evet", <>Webhook&apos;u tetikleyen <DocLink to="events" hash="event-types">olay tipi</DocLink>, ör. <code>UserCreated</code>.</>],
					[<code>status</code>, "evet", <><code>active</code> ya da <code>passive</code>. Pasif webhook&apos;lar saklanır ama çağrılmaz.</>],
					[<code>try_count</code>, "evet", "Başarısız bir isteğin kaç kez deneneceği, 1 ile 5 arası."],
					[<code>request.method</code>, "evet", <>HTTP metodu: <code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>PATCH</code>, <code>DELETE</code>…</>],
					[<code>request.url</code>, "evet", "Çağrılacak URL. Placeholder içerebilir."],
					[<code>request.headers</code>, "hayır", "Gönderilecek header'lar. Değerler placeholder içerebilir."],
					[<code>request.body</code>, "hayır", "Bir JSON nesnesi. String değerler placeholder içerebilir."],
					[<code>request.uncoveredBody</code>, "hayır", <>Bkz. <a href="#the-request-body">İstek gövdesi</a>. Varsayılan <code>false</code>.</>],
				]} />

			<H2 id="placeholders">
				Placeholder&apos;lar
			</H2>
			<p>
				URL, header değerleri ve gövdenin string değerleri, olaydan doldurulan çift süslü parantezli placeholder&apos;lar içerebilir:
			</p>
			<Table
				head={["Placeholder", "Değer"]}
				rows={[
					[<code>{"{{event_type}}"}</code>, "Olay tipi"],
					[<code>{"{{utilizer_id}}"}</code>, "Olaya kimin yol açtığı"],
					[<code>{"{{event_time}}"}</code>, "Ne zaman olduğu"],
					[<code>{"{{membership_id}}"}</code>, "Membership id'si"],
					[<code>{"{{document.<field>}}"}</code>, <>Kaynağın değişiklikten sonraki halinin bir alanı, ör. <code>{"{{document.email_address}}"}</code></>],
					[<code>{"{{prior.<field>}}"}</code>, "Kaynağın değişiklikten önceki halinin bir alanı"],
				]} />
			<p>
				İç içe alanlar nokta kullanır: <code>{"{{document.sys.created_by}}"}</code>.
			</p>
			<p>
				Değerler kullanıldıkları yere göre escape edilir; böylece bir olayın verisi (örneğin bir kullanıcının adı) isteği değiştiremez:
			</p>
			<ul>
				<li>
					<strong>URL</strong>&apos;de değerler URL-encode edilir (<code>../admin</code>, <code>..%2Fadmin</code> olur);
				</li>
				<li>
					<strong>header</strong>&apos;larda satır sonu içerecek bir değer gönderilmez;
				</li>
				<li>
					<strong>gövde</strong>&apos;de her placeholder kendi JSON string&apos;inin içinde kalır: alan ekleyemez ya da yapıyı değiştiremez.
				</li>
			</ul>

			<H2 id="the-request-body">
				İstek gövdesi
			</H2>
			<p>
				Varsayılan olarak (<code>uncoveredBody: false</code>) istek gövdesi, <code>body</code>&apos;nizi olayın dokümanlarıyla birlikte sarmalar:
			</p>
			<Code language="json" code={samples.coveredBody} />
			<p>
				<code>uncoveredBody: true</code> ile istek gövdesi, placeholder&apos;lar doldurulduktan sonra yalnızca sizin <code>body</code>&apos;nizdir:
			</p>
			<Code language="json" code={samples.uncoveredBody} />
			<p>
				Alıcı API belirli bir biçim bekliyorsa <code>uncoveredBody: true</code> kullanın.
			</p>

			<H2 id="delivery">
				Gönderim
			</H2>
			<ul>
				<li>
					Webhook&apos;lar bir arka plan kuyruğundan <strong>asenkron</strong> olarak çağrılır: olaya yol açan istek onları beklemez ve yavaş ya da hata veren bir alıcı ErtisAuth&apos;u yavaşlatamaz ya da bozamaz.
				</li>
				<li>
					Alıcı 2xx durum koduyla yanıt verdiğinde çağrı başarılı sayılır. Aksi halde, toplamda <code>try_count</code> kadar olmak üzere, art arda yeniden denenir.
				</li>
				<li>
					Her deneme, ne olduğunu görebilmeniz için istek, durum kodu ve yanıt gövdesiyle bir <code>WebhookRequestSent</code> ya da <code>WebhookRequestFailed</code> <DocLink to="events">olayı</DocLink> kaydeder.
				</li>
				<li>
					Webhook&apos;lar tam olarak bir kez değil, <strong>deneme başına en fazla bir kez</strong> gönderilir: alıcınızı idempotent yapın (örneğin <code>document._id</code> kullanarak) ve çağrı kuyruktayken ErtisAuth yeniden başlarsa kaçırılabileceğini göz önünde bulundurun.
				</li>
			</ul>

			<H2 id="securing-your-receiver">
				Alıcınızı güvenli hale getirme
			</H2>
			<ul>
				<li>
					HTTPS kullanın.
				</li>
				<li>
					Çağrıları doğrulayın: bir header&apos;a (<code>&quot;Authorization&quot;: &quot;Bearer &lt;secret&gt;&quot;</code>) ya da URL&apos;ye bir secret koyun ve alıcınızda kontrol edin.
				</li>
				<li>
					Gövdeye körü körüne güvenmeyin: şüphe duyduğunuzda kaynağı bir uygulama token&apos;ıyla ErtisAuth&apos;tan okuyun.
				</li>
			</ul>

			<H2 id="endpoints">
				Endpoint&apos;ler
			</H2>
			<p>
				Tüm route&apos;lar <code>{"/memberships/{membershipId}"}</code> altındadır.
			</p>
			<Table
				head={["Metot", "Route", "Açıklama", "Yetki"]}
				rows={[
					[<code>GET</code>, <code>{"/webhooks/{id}"}</code>, "Webhook getirme", <code>{"webhooks.read.{id}"}</code>],
					[<code>GET</code>, <code>/webhooks</code>, "Webhook'ları listeleme", <code>webhooks.read</code>],
					[<code>POST</code>, <code>/webhooks/_query</code>, "Webhook'ları sorgulama", <code>webhooks.read</code>],
					[<code>POST</code>, <code>/webhooks</code>, "Webhook oluşturma", <code>webhooks.create</code>],
					[<code>PUT</code>, <code>{"/webhooks/{id}"}</code>, "Webhook güncelleme", <code>{"webhooks.update.{id}"}</code>],
					[<code>DELETE</code>, <code>{"/webhooks/{id}"}</code>, "Webhook silme", <code>{"webhooks.delete.{id}"}</code>],
					[<code>DELETE</code>, <code>/webhooks</code>, "Birden fazla webhook silme", <code>webhooks.delete</code>],
				]} />

			<H3 id="create-a-webhook">
				Webhook oluşturma
			</H3>
			<Code language="shell" code={samples.create} />
			<p>
				<strong>Yanıt <code>201 Created</code></strong>: webhook.
			</p>
			<Table
				head={["Hata", "Ne zaman"]}
				rows={[
					[<code>400 ModelValidationError</code>, <>Zorunlu bir alan eksik, olay tipi ya da HTTP metodu bilinmiyor veya <code>try_count</code> 1 ile 5 arasında değil</>],
					[<code>404 MembershipNotFound</code>, "Membership yok"],
					[<code>409 WebhookAlreadyExists</code>, "Slug kullanımda"],
				]} />

			<H3 id="update-and-delete">
				Güncelleme ve silme
			</H3>
			<p>
				<code>{"PUT /webhooks/{id}"}</code> webhook&apos;u gövdeyle (oluşturmayla aynı alanlar) tamamen değiştirir. Hiçbir değişiklik içermeyen bir güncelleme <code>409 IdenticalDocumentError</code> döner. <code>{"DELETE /webhooks/{id}"}</code> <code>204 No Content</code> döner.
			</p>

			<H2 id="events">
				Olaylar
			</H2>
			<p>
				<code>WebhookCreated</code>, <code>WebhookUpdated</code>, <code>WebhookDeleted</code> ve gönderim olayları <code>WebhookRequestSent</code> ile <code>WebhookRequestFailed</code>. Bkz. <DocLink to="events">Olaylar</DocLink>.
			</p>
		</>
	)
}
