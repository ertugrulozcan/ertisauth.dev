import * as samples from "../samples/mail-hooks"
import { Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function MailHooks() {
	return (
		<>
			<p>
				Mail hook, membership&apos;te belirli bir <DocLink to="events">olay</DocLink> gerçekleştiğinde şablonlu bir e-posta gönderir: <code>UserCreated</code>&apos;da bir hoş geldin maili, <code>UserPasswordChanged</code>&apos;da bir güvenlik bildirimi, <code>RoleUpdated</code>&apos;da yöneticilere bir uyarı.
			</p>
			<p>
				Ayrılmış adlara sahip iki mail hook, <DocLink to="account-recovery">aktivasyon ve parola sıfırlama akışlarını</DocLink> da çalıştırır.
			</p>

			<H2 id="before-you-start">
				Başlamadan önce
			</H2>
			<p>
				Mail&apos;ler, membership&apos;in <code>mail_providers</code> alanında tanımlı <strong>mail sağlayıcılarından</strong> biri (SMTP, SendGrid ya da Mailchimp Transactional) üzerinden gönderilir. Bkz. <DocLink to="memberships" hash="mail-providers">Membership&apos;ler</DocLink>.
			</p>

			<H2 id="the-mail-hook-object">
				Mail hook nesnesi
			</H2>
			<Code language="json" code={samples.mailHook} />
			<Table
				head={["Alan", "Zorunlu", "Açıklama"]}
				rows={[
					[<code>name</code>, "evet", <>Görünen ad. <code>User Activation</code> ve <code>Reset Password</code> <a href="#activation-and-reset-password-mails">özeldir</a>.</>],
					[<code>slug</code>, "hayır", "Verilmezse addan türetilir."],
					[<code>description</code>, "hayır", ""],
					[<code>event</code>, "evet", <>Mail&apos;i tetikleyen <DocLink to="events" hash="event-types">olay tipi</DocLink>.</>],
					[<code>status</code>, "evet", <><code>active</code> ya da <code>passive</code>.</>],
					[<code>mailProvider</code>, "evet", <>Membership&apos;in mail sağlayıcılarından birinin <code>slug</code>&apos;ı.</>],
					[<><code>fromName</code>, <code>fromAddress</code></>, "", "Gönderen. Mail sağlayıcınızın gönderim yapmasına izin verilen bir adres kullanın."],
					[<code>sendToUtilizer</code>, "", <><code>true</code>, mail&apos;i olaya yol açan kullanıcıya da gönderir (örneğin parolasını değiştiren kullanıcıya).</>],
					[<code>recipients</code>, "", <>Sabit ya da şablonlu alıcılar; her biri <code>{"{ \"displayName\", \"emailAddress\" }"}</code>.</>],
					[<code>mailSubject</code>, "", "Konu. Placeholder içerebilir."],
					[<code>mailTemplate</code>, "", <>Placeholder&apos;lı HTML gövde ya da Mailchimp şablon adı (bkz. <a href="#mailchimp-templates">aşağısı</a>).</>],
					[<code>variables</code>, "", <>Mailchimp merge değişkenleri, bkz. <a href="#mailchimp-templates">aşağısı</a>.</>],
				]} />
			<p>
				Alıcılar e-posta adresine göre tekilleştirilir.
			</p>

			<H2 id="templates">
				Şablonlar
			</H2>
			<p>
				Konular, gövdeler ve alıcılar, olaydan doldurulan çift süslü parantezli placeholder&apos;lar kullanır:
			</p>
			<Table
				head={["Placeholder", "Değer"]}
				rows={[
					[<><code>{"{{event_type}}"}</code>, <code>{"{{utilizer_id}}"}</code>, <code>{"{{event_time}}"}</code>, <code>{"{{membership_id}}"}</code></>, "Olayın alanları"],
					[<code>{"{{document.<field>}}"}</code>, "Kaynağın değişiklikten sonraki halinin bir alanı"],
					[<code>{"{{prior.<field>}}"}</code>, "Kaynağın değişiklikten önceki halinin bir alanı"],
				]} />
			<p>
				Örneğin <code>UserPasswordChanged</code>&apos;da kullanıcıya gönderilen bir bildirim:
			</p>
			<Code language="json" code={samples.passwordChangedNotice} />
			<p>
				Değerler güvenli şekilde yerleştirilir:
			</p>
			<ul>
				<li>
					HTML gövdede her değer <strong>HTML-encode</strong> edilir; böylece adına işaretleme koyan bir kullanıcı bunu mail&apos;lerinize enjekte edemez; şablonunuzun kendi işaretlemesi korunur;
				</li>
				<li>
					konuda, değerlerdeki satır sonları boşlukla değiştirilir;
				</li>
				<li>
					çözülemeyen placeholder&apos;lar olduğu gibi bırakılır.
				</li>
			</ul>

			<H3 id="mailchimp-templates">
				Mailchimp şablonları
			</H3>
			<p>
				<code>MailChimp</code> sağlayıcısıyla ErtisAuth gövdeyi kendisi oluşturmaz: Mailchimp Transactional&apos;dan, saklanan şablonlarınızdan birini göndermesini ister.
			</p>
			<ul>
				<li>
					<code>mailTemplate</code>, Mailchimp&apos;teki <strong>şablonun adıdır</strong>.
				</li>
				<li>
					<code>variables</code>, şablona aktarılan merge değişkenleridir; değerleri placeholder içerebilir:
				</li>
			</ul>
			<Code language="json" code={samples.variables} />

			<H2 id="activation-and-reset-password-mails">
				Aktivasyon ve parola sıfırlama mail&apos;leri
			</H2>
			<p>
				İki mail hook <strong>adlarıyla</strong> bulunur ve hesap akışları tarafından, kendi verileriyle kullanılır:
			</p>
			<Table
				head={["Ad", "Olay", "Kullanan", "Placeholder'lar"]}
				rows={[
					[<code>User Activation</code>, <code>UserCreated</code>, <DocLink to="account-recovery" hash="account-activation">Hesap aktivasyonu</DocLink>, <><code>{"{{user.<field>}}"}</code>, <code>{"{{activationLink}}"}</code></>],
					[<code>Reset Password</code>, <code>UserPasswordReset</code>, <DocLink to="account-recovery" hash="password-reset">Parola sıfırlama</DocLink>, <><code>{"{{user.<field>}}"}</code>, <code>{"{{resetPasswordLink}}"}</code></>],
				]} />
			<p>
				Tam olarak bu ada, yukarıdaki olaya ve <code>active</code> durumuna sahip olmalıdırlar. Olaylarının sıradan mail hook&apos;ları olarak değil, yalnızca kendi akışları tarafından gönderilirler.
			</p>

			<H2 id="delivery">
				Gönderim
			</H2>
			<ul>
				<li>
					Mail&apos;ler bir arka plan kuyruğundan <strong>asenkron</strong> olarak gönderilir; olaya yol açan istek onları beklemez.
				</li>
				<li>
					Her mail, alıcılarıyla (ve hatayla) bir <code>MailhookMailSent</code> ya da <code>MailhookMailFailed</code> <DocLink to="events">olayı</DocLink> kaydeder; bir mail ulaşmadığında bakılacak yer burasıdır.
				</li>
				<li>
					Mail&apos;ler yeniden denenmez.
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
					[<code>GET</code>, <code>{"/mailhooks/{id}"}</code>, "Mail hook getirme", <code>{"mailhooks.read.{id}"}</code>],
					[<code>GET</code>, <code>/mailhooks</code>, "Mail hook'ları listeleme", <code>mailhooks.read</code>],
					[<code>POST</code>, <code>/mailhooks/_query</code>, "Mail hook'ları sorgulama", <code>mailhooks.read</code>],
					[<code>POST</code>, <code>/mailhooks</code>, "Mail hook oluşturma", <code>mailhooks.create</code>],
					[<code>PUT</code>, <code>{"/mailhooks/{id}"}</code>, "Mail hook güncelleme", <code>{"mailhooks.update.{id}"}</code>],
					[<code>DELETE</code>, <code>{"/mailhooks/{id}"}</code>, "Mail hook silme", <code>{"mailhooks.delete.{id}"}</code>],
					[<code>DELETE</code>, <code>/mailhooks</code>, "Birden fazla mail hook silme", <code>mailhooks.delete</code>],
				]} />
			<p>
				<strong>Oluşturma</strong> <code>201 Created</code> döner; ad, mail sağlayıcısı, durum (<code>active</code> / <code>passive</code>) ya da olay tipi eksik veya geçersizse <code>400 ModelValidationError</code>, slug kullanımdaysa <code>409 MailHookAlreadyExists</code>. <strong>Güncelleme</strong> mail hook&apos;u tamamen değiştirir; hiçbir değişiklik içermeyen bir güncelleme <code>409 IdenticalDocumentError</code> döner. <strong>Silme</strong> <code>204 No Content</code> döner.
			</p>

			<H2 id="events">
				Olaylar
			</H2>
			<p>
				<code>MailhookCreated</code>, <code>MailhookUpdated</code>, <code>MailhookDeleted</code> ve gönderim olayları <code>MailhookMailSent</code> ile <code>MailhookMailFailed</code>. Bkz. <DocLink to="events">Olaylar</DocLink>.
			</p>
		</>
	)
}
