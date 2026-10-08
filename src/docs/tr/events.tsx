import * as samples from "../samples/events"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Events() {
	return (
		<>
			<p>
				ErtisAuth, bir membership&apos;te olan çoğu şey için bir <strong>olay</strong> kaydeder: girişler, token yenilemeleri, kullanıcı değişiklikleri, rol değişiklikleri, gönderilen webhook&apos;lar ve mail&apos;ler… Olayların üç amacı vardır:
			</p>
			<ul>
				<li>
					API üzerinden okuyup sorgulayabileceğiniz bir <strong>denetim kaydı</strong>,
				</li>
				<li>
					<DocLink to="webhooks">webhook&apos;ların</DocLink> tetikleyicisi,
				</li>
				<li>
					<DocLink to="mail-hooks">mail hook&apos;ların</DocLink> tetikleyicisi.
				</li>
			</ul>

			<H2 id="the-event-object">
				Olay nesnesi
			</H2>
			<Code language="json" code={samples.event} />
			<Table
				head={["Alan", "Açıklama"]}
				rows={[
					[<code>event_type</code>, "Ne olduğu (aşağıdaki listeye bakın)."],
					[<code>utilizer_id</code>, <>Olaya yol açan kullanıcının ya da uygulamanın id&apos;si ya da <code>system</code>.</>],
					[<code>document</code>, "Kaynağın değişiklikten sonraki hali. Silmelerde boştur."],
					[<code>prior</code>, "Kaynağın değişiklikten önceki hali; güncellemeler ve silmeler için."],
					[<code>event_time</code>, "Ne zaman olduğu, UTC olarak."],
				]} />
			<p>
				Parola hash&apos;leri ve uygulama secret&apos;ları hiçbir zaman olayların parçası değildir.
			</p>

			<H2 id="event-types">
				Olay tipleri
			</H2>

			<H3 id="tokens">
				Token&apos;lar
			</H3>
			<Table
				head={["Olay", <code>document</code>]}
				rows={[
					[<code>TokenGenerated</code>, <><code>user</code> ve yeni token&apos;ın meta verileriyle <code>token</code>: <code>token_type</code>, <code>expires_in</code>, <code>refresh_token_expires_in</code>, <code>created_at</code></>],
					[<code>TokenRefreshed</code>, <><code>user</code> ve yukarıdaki gibi yeni token&apos;ın meta verileriyle <code>token</code>. Yenileme ayrıca bir <code>TokenGenerated</code> olayı da kaydeder.</>],
					[<code>TokenVerified</code>, <><code>token_type</code> ve Bearer token&apos;lar için <code>is_refresh_token</code> ve <code>expires_at</code> (Basic token&apos;lar için <code>application_id</code>) içeren <code>token</code></>],
					[<code>TokenRevoked</code>, <>İptal edilen access token&apos;ın <code>token_type</code> ve <code>expire_time</code> alanlarını içeren <code>token</code>. İptal edilen her token çifti için bir olay.</>],
				]} />
			<p>
				Token olayları hiçbir zaman token&apos;ların kendisini içermez; bu yüzden olay kaydı ve webhook alıcıları bir kullanıcı adına işlem yapmak için kullanılamaz.
			</p>

			<H3 id="users-and-user-types">
				Kullanıcılar ve kullanıcı tipleri
			</H3>
			<Table
				head={["Olay", "Ne zaman"]}
				rows={[
					[<code>UserCreated</code>, "Bir kullanıcı oluşturuldu (sağlayıcıyla kayıt dahil)"],
					[<code>UserUpdated</code>, "Bir kullanıcı güncellendi, etkinleştirildi ya da donduruldu"],
					[<code>UserDeleted</code>, "Bir kullanıcı silindi"],
					[<code>UserPasswordChanged</code>, "Bir parola değiştirildi ya da sıfırlama token'ıyla belirlendi"],
					[<code>UserPasswordReset</code>, "Bir parola sıfırlama istendi"],
					[<><code>UserTypeCreated</code>, <code>UserTypeUpdated</code>, <code>UserTypeDeleted</code></>, "Bir kullanıcı tipi değişti"],
				]} />

			<H3 id="other-resources">
				Diğer kaynaklar
			</H3>
			<Table
				head={["Olaylar"]}
				rows={[
					[<><code>ApplicationCreated</code>, <code>ApplicationUpdated</code>, <code>ApplicationDeleted</code></>],
					[<><code>RoleCreated</code>, <code>RoleUpdated</code>, <code>RoleDeleted</code></>],
					[<><code>ProviderCreated</code>, <code>ProviderUpdated</code>, <code>ProviderDeleted</code></>],
					[<><code>WebhookCreated</code>, <code>WebhookUpdated</code>, <code>WebhookDeleted</code></>],
					[<><code>MailhookCreated</code>, <code>MailhookUpdated</code>, <code>MailhookDeleted</code></>],
					[<><code>TokenCodePolicyCreated</code>, <code>TokenCodePolicyUpdated</code>, <code>TokenCodePolicyDeleted</code></>],
				]} />

			<H3 id="device-code-flow">
				Cihaz kodu akışı
			</H3>
			<Table
				head={["Olay", <code>document</code>]}
				rows={[
					[<code>TokenCodeApproved</code>, <><code>user</code> (onaylayan) ve <code>user_code</code>, <code>client_info</code> (cihaz) ve <code>created_at</code> içeren <code>code</code></>],
					[<code>TokenCodeDenied</code>, "reddedilen bir kod için aynısı"],
				]} />
			<p>
				Cihaz kodu hiçbir zaman bu olayların parçası değildir. Bkz. <DocLink to="device-code-flow">Cihaz Kodu Akışı</DocLink>.
			</p>

			<H3 id="hook-results">
				Hook sonuçları
			</H3>
			<Table
				head={["Olay", <code>document</code>]}
				rows={[
					[<code>WebhookRequestSent</code>, "Başarılı bir webhook çağrısının sonucu: istek, yanıt durumu ve gövdesi, deneme numarası"],
					[<code>WebhookRequestFailed</code>, "Başarısız bir deneme için aynısı, hatayla birlikte"],
					[<code>MailhookMailSent</code>, "Alıcılar"],
					[<code>MailhookMailFailed</code>, "Alıcılar ve hata"],
				]} />
			<Callout>
				bir webhook ya da mail hook&apos;u kendi sonuç olayları (<code>WebhookRequestSent</code>, <code>WebhookRequestFailed</code>, <code>MailhookMailSent</code>, <code>MailhookMailFailed</code>) üzerine kurmayın: her çağrı bir sonrakini tetikler.
			</Callout>

			<H2 id="endpoints">
				Endpoint&apos;ler
			</H2>
			<p>
				Tüm route&apos;lar <code>{"/memberships/{membershipId}"}</code> altındadır.
			</p>
			<Table
				head={["Metot", "Route", "Açıklama", "Yetki"]}
				rows={[
					[<code>GET</code>, <code>{"/events/{id}"}</code>, "Olay getirme", <code>{"events.read.{id}"}</code>],
					[<code>GET</code>, <code>/events</code>, "Olayları listeleme", <code>events.read</code>],
					[<code>POST</code>, <code>/events/_query</code>, "Olayları sorgulama", <code>events.read</code>],
				]} />
			<p>
				Olaylar salt okunurdur.
			</p>

			<H3 id="examples">
				Örnekler
			</H3>
			<p>
				Bir kullanıcının son girişleri:
			</p>
			<Code language="shell" code={samples.userSignIns} />
			<p>
				Bu ay rolleri kimin değiştirdiği:
			</p>
			<Code language="json" code={samples.roleChanges} />
			<p>
				Başarısız webhook çağrıları:
			</p>
			<Code language="json" code={samples.failedWebhooks} />
			<Callout>
				olaylar kişisel veri (kullanıcı dokümanları) içerir. <code>events.read</code> yetkisini yalnızca denetim kaydına ihtiyacı olanlara verin ve <code>events</code> koleksiyonu için bir saklama politikası planlayın.
			</Callout>
		</>
	)
}
