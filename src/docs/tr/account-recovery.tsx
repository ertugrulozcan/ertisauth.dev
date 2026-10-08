import * as samples from "../samples/account-recovery"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function AccountRecovery() {
	return (
		<>
			<p>
				Bu sayfa, kullanıcıların e-posta adreslerinin kendilerine ait olduğunu kanıtlamalarını ve hesaplarına geri dönmelerini sağlayan akışları anlatır:
			</p>
			<ul>
				<li>
					<a href="#account-activation">Hesap aktivasyonu</a>: yeni kullanıcılar giriş yapabilmeden önce e-posta adreslerini onaylar.
				</li>
				<li>
					<a href="#password-reset">Şifre sıfırlama</a>: şifresini unutan kullanıcılar e-postayla bir sıfırlama bağlantısı alır.
				</li>
				<li>
					<a href="#one-time-passwords">Tek kullanımlık şifreler</a>: kullanıcılar sizin seçtiğiniz bir kanaldan (SMS, çağrı merkezi…) kısa bir kod alır ve bunu bir şifre sıfırlamayla değiştirir.
				</li>
			</ul>
			<p>
				Üçü de ErtisAuth&apos;u çağıran, <strong>size ait bir sayfa</strong> (bir aktivasyon sayfası, bir şifre sıfırlama sayfası) ve onun <strong>backend&apos;i</strong> ile sona erer. ErtisAuth bu sayfaları barındırmaz.
			</p>

			<H2 id="how-the-links-work">
				Bağlantılar nasıl çalışır
			</H2>
			<p>
				Aktivasyon ve sıfırlama e-postaları sayfanıza bir bağlantı içerir. Sayfanın URL&apos;sini <code>X-Host</code> header&apos;ında verirsiniz; ErtisAuth da buna kod içeren bir query parametresi ekler:
			</p>
			<Table
				head={["Akış", "Bağlantı"]}
				rows={[
					["Aktivasyon", <code>{"{X-Host}?uat=<code>"}</code>],
					["Şifre sıfırlama", <code>{"{X-Host}?rpt=<code>"}</code>],
				]} />
			<p>
				Örneğin <code>X-Host: https://app.example.com/reset-password</code> ile sıfırlama e-postası <code>https://app.example.com/reset-password?rpt=NjZmMWMw…</code> adresine bağlantı verir.
			</p>
			<p>
				Kod, <code>&lt;membership_id&gt;:&lt;token&gt;</code> değerinin base64 halidir. Onu opak bir değer olarak ele alın: sayfanız kodu query string&apos;den okur ve ErtisAuth&apos;a değiştirmeden geri gönderir.
			</p>
			<p>
				Kodlar <strong>tek kullanımlık</strong> ve kısa ömürlüdür; access token olarak kullanılamazlar.
			</p>

			<H2 id="who-calls-these-endpoints">
				Bu endpoint&apos;leri kim çağırır
			</H2>
			<p>
				Sayfanızdaki kişi giriş yapmamış olduğu için bu akışların endpoint&apos;leri diğer endpoint&apos;ler gibi korunur (yetkiler aşağıda). Onları <strong>sayfanızın backend&apos;inden, bir uygulamanın Basic token&apos;ıyla</strong> çağırın ve o uygulamanın rolüne yalnızca akışların ihtiyaç duyduğunu verin:
			</p>
			<Code language="json" code={samples.accountPagesRole} />
			<p>
				Uygulamanın secret&apos;ını asla tarayıcıya koymayın.
			</p>

			<H2 id="account-activation">
				Hesap aktivasyonu
			</H2>
			<p>
				Bir membership&apos;in <code>user_activation</code> değeri <code>active</code> olduğunda yeni kullanıcılar <strong>aktif olmadan</strong> oluşturulur ve aktivasyon e-postalarındaki bağlantıya tıklayana kadar giriş yapamazlar (<code>401 UserInactive</code>).
			</p>

			<H3 id="setup">
				Kurulum
			</H3>
			<ol>
				<li>
					Membership&apos;e bir mail sağlayıcısı ekleyin (<code>mail_providers</code>; bkz. <DocLink to="memberships" hash="mail-providers">Membership&apos;ler</DocLink>).
				</li>
				<li>
					Adı tam olarak <strong><code>User Activation</code></strong> olan, <strong><code>UserCreated</code></strong> olayı için ve <code>active</code> durumunda bir <DocLink to="mail-hooks">mail hook</DocLink> oluşturun. Şablonunda <code>{"{{activationLink}}"}</code> kullanın:
					<Code language="json" code={samples.activationMailHook} />
					Şablon <code>user</code> (yeni kullanıcı) ve <code>activationLink</code> değerlerini alır.
				</li>
				<li>
					Membership&apos;te <code>user_activation</code> değerini <code>active</code> yapın.
				</li>
			</ol>
			<p>
				Mail sağlayıcısı ya da aktivasyon mail hook&apos;u olmadan kullanıcı oluşturma, hiçbir şey oluşturulmadan <code>501 NotDefinedAnyMailProvider</code> ya da <code>501 ActivationMailHookWasNotDefined</code> ile başarısız olur.
			</p>

			<H3 id="flow">
				Akış
			</H3>
			<ol>
				<li>
					<strong>Kullanıcıyı</strong> <code>X-Host</code> header&apos;ı aktivasyon sayfanızı gösterecek şekilde <strong>oluşturun</strong>:
					<Code language="http" code={samples.createUser} />
					Kullanıcı aktif olmadan oluşturulur ve aktivasyon e-postası kuyruğa alınır. <code>X-Host</code> eksikse kullanıcı yine oluşturulur ama e-posta gönderilmez; e-postayı daha sonra <a href="#resend-the-activation-mail">yeniden gönderin</a>.
				</li>
				<li>
					<strong>Kullanıcı bağlantıya tıklar</strong> ve <code>https://app.example.com/activate?uat=&lt;code&gt;</code> adresine gelir.
				</li>
				<li>
					<strong>Backend&apos;iniz hesabı aktifleştirir:</strong>
					<Code language="http" code={samples.activate} />
					Yetki: <code>users.update</code>. <strong>Yanıt <code>200 OK</code></strong>, aktifleştirilen kullanıcıyla birlikte.
				</li>
			</ol>
			<p>
				Aktivasyon kodu <strong>72 saat</strong> geçerlidir ve yalnızca bir kez kullanılabilir. Kullanıcı bu arada değiştirilirse, örneğin <DocLink to="users" hash="freeze-a-user">dondurulursa</DocLink>, kod da çalışmaz hale gelir.
			</p>
			<Table
				head={["Hata", "Ne zaman"]}
				rows={[
					[<code>401 InvalidToken</code>, "Kod hatalı biçimde, süresi dolmuş, zaten kullanılmış ya da başka bir membership'e ait"],
					[<code>400 UserAlreadyActive</code>, "Kullanıcı zaten aktif"],
				]} />

			<H3 id="resend-the-activation-mail">
				Aktivasyon e-postasını yeniden gönderme
			</H3>
			<Code language="http" code={samples.resendActivation} />
			<p>
				Yetki: <code>users.create</code>. <strong>Yanıt <code>200 OK</code></strong>:
			</p>
			<Code language="json" code={samples.resendActivationResponse} />
			<Table
				head={["Hata", "Ne zaman"]}
				rows={[
					[<><code>400 HostRequired</code>, <code>400 EmailAddressRequired</code></>, "Zorunlu bir değer eksik"],
					[<code>400 UserAlreadyActive</code>, "Aktifleştirilecek bir şey yok"],
					[<code>404 UserNotFound</code>, "Bu e-posta adresine sahip kullanıcı yok"],
					[<><code>501 NotDefinedAnyMailProvider</code>, <code>501 ActivationMailHookWasNotDefined</code></>, "E-posta gönderilemiyor"],
				]} />

			<H3 id="activating-without-a-mail">
				E-posta olmadan aktifleştirme
			</H3>
			<p>
				Bir yönetici bir kullanıcıyı <DocLink to="users" hash="activate-a-user"><code>GET /users/{"{id}"}/activate</code></DocLink> ile doğrudan aktifleştirebilir.
			</p>

			<H2 id="password-reset">
				Şifre sıfırlama
			</H2>

			<H3 id="setup-1">
				Kurulum
			</H3>
			<ol>
				<li>
					Membership&apos;e bir mail sağlayıcısı ekleyin.
				</li>
				<li>
					Adı tam olarak <strong><code>Reset Password</code></strong> olan, <strong><code>UserPasswordReset</code></strong> olayı için ve <code>active</code> durumunda bir <DocLink to="mail-hooks">mail hook</DocLink> oluşturun. Şablonunda <code>{"{{resetPasswordLink}}"}</code> kullanın:
					<Code language="json" code={samples.resetMailHook} />
					Şablon <code>user</code> ve <code>resetPasswordLink</code> değerlerini alır.
				</li>
				<li>
					İsterseniz membership&apos;te <code>reset_password_token_expires_in</code> değerini ayarlayın (varsayılan olarak 2 saat).
				</li>
			</ol>

			<H3 id="1-request-the-reset">
				1. Sıfırlamayı isteyin
			</H3>
			<p>
				&quot;Şifremi unuttum&quot; sayfanızın backend&apos;i şunu çağırır:
			</p>
			<Code language="http" code={samples.requestReset} />
			<p>
				Yetki: <code>users.update</code>. <strong>Yanıt <code>200 OK</code></strong>:
			</p>
			<Code language="json" code={samples.requestResetResponse} />
			<p>
				E-posta kuyruğa alınır ve bir <code>UserPasswordReset</code> olayı kaydedilir.
			</p>
			<Table
				head={["Hata", "Ne zaman"]}
				rows={[
					[<><code>400 HostRequired</code>, <code>400 EmailAddressRequired</code></>, "Zorunlu bir değer eksik"],
					[<code>401 UserInactive</code>, "Hesap aktif değil ya da dondurulmuş: bu yolla kurtarılamaz"],
					[<code>404 UserNotFound</code>, "Bu e-posta adresine sahip kullanıcı yok"],
					[<><code>501 NotDefinedAnyMailProvider</code>, <code>501 ResetPasswordMailHookWasNotDefined</code></>, "E-posta gönderilemiyor"],
				]} />
			<Callout>
				bilinmeyen bir e-posta adresi <code>404</code> döner. Hangi adreslerin hesabı olduğunu açığa vurmamak için iki durumda da kişiye aynı mesajı gösterin (&quot;Böyle bir hesap varsa size bir e-posta gönderdik&quot;).
			</Callout>

			<H3 id="2-verify-the-link">
				2. Bağlantıyı doğrulayın
			</H3>
			<p>
				Kullanıcı <code>https://app.example.com/reset-password?rpt=&lt;code&gt;</code> adresini açtığında, formu göstermeden önce kodu kontrol edin:
			</p>
			<Code language="http" code={samples.verifyResetToken} />
			<p>
				Yetki: <code>users.read</code>. <strong>Yanıt <code>200 OK</code></strong>:
			</p>
			<Code language="json" code={samples.verifyResetTokenResponse} />
			<p>
				Geçersiz, süresi dolmuş ya da kullanılmış bir kod <code>401 InvalidToken</code> döner.
			</p>

			<H3 id="3-set-the-new-password">
				3. Yeni şifreyi belirleyin
			</H3>
			<Code language="http" code={samples.setPassword} />
			<p>
				<code>email_address</code> yerine <code>username</code> da gönderilebilir. Yetki: <code>users.update</code>. <strong>Yanıt <code>200 OK</code></strong>.
			</p>
			<ul>
				<li>
					Kod o kullanıcıya ait olmalıdır.
				</li>
				<li>
					Kod <strong>bir kez</strong> çalışır: şifreyi belirlemek onu geçersiz kılar.
				</li>
				<li>
					Kullanıcının <strong>tüm cihazlardaki oturumları kapanır</strong>.
				</li>
				<li>
					Bir <code>UserPasswordChanged</code> olayı kaydedilir.
				</li>
			</ul>
			<Table
				head={["Hata", "Ne zaman"]}
				rows={[
					[<><code>400 ResetTokenRequired</code>, <code>400 EmailAddressRequired</code>, <code>400 PasswordRequired</code></>, "Zorunlu bir değer eksik"],
					[<code>400 PasswordMinLengthRuleError</code>, "Şifre 6 karakterden kısa"],
					[<code>401 InvalidToken</code>, "Kod geçersiz, süresi dolmuş, kullanılmış ya da başka bir kullanıcıya ait"],
				]} />

			<H2 id="one-time-passwords">
				Tek kullanımlık şifreler
			</H2>
			<p>
				Tek kullanımlık şifreler (OTP), kullanıcıların hesaplarını e-posta olmadan kurtarmalarını sağlar: kısa bir kodu onlara kendiniz iletirsiniz, örneğin SMS ile ya da bir destek temsilcisi aracılığıyla; onlar da bu kodu bir şifre sıfırlamayla değiştirir.
			</p>

			<H3 id="setup-2">
				Kurulum
			</H3>
			<p>
				Membership&apos;te <code>otp_settings</code> değerini ayarlayın:
			</p>
			<Code language="json" code={samples.otpSettings} />
			<Table
				head={["Alan", "Açıklama"]}
				rows={[
					[<code>host</code>, <>Zorunlu. Kullanıcıların kodlarını girdiği sayfanın adresi; doğrulama isteği aynı değeri <code>X-Host</code> header&apos;ında göndermelidir.</>],
					[<code>policy.length</code>, "Kodun karakter sayısı."],
					[<><code>policy.contains_letters</code>, <code>policy.contains_digits</code></>, "Kodun karakter kümesi."],
					[<code>policy.expires_in</code>, "Kodun ve kodun karşılığında verilen sıfırlama token'ının (doğrulamadan itibaren sayılan) geçerlilik süresi, saniye cinsinden. Verilmezse 2 saat."],
					[<code>policy.max_attempts</code>, "Kod silinmeden önce izin verilen yanlış deneme sayısı. Varsayılan 5, en az 1."],
				]} />

			<H3 id="1-generate-a-code">
				1. Bir kod üretin
			</H3>
			<p>
				Backend&apos;iniz (bir SMS servisi, bir destek aracı) bir kullanıcı için kod üretir:
			</p>
			<Code language="http" code={samples.generateOtp} />
			<p>
				Yetki: <code>otp.create.{"{userId}"}</code> (<code>users</code> değil, <code>otp</code> kaynağı). <strong>Yanıt <code>200 OK</code></strong>:
			</p>
			<Code language="json" code={samples.generateOtpResponse} />
			<p>
				<code>password</code> alanı koddur. Kodu kullanıcıya iletin. Yalnızca bu yanıtta döner: ErtisAuth yalnızca anahtarlı bir hash&apos;ini saklar. Yeni bir kod üretmek, kullanıcının önceki kodlarını siler.
			</p>
			<p>
				Bu noktada henüz bir sıfırlama token&apos;ı yoktur: token yalnızca kullanıcı <a href="#2-verify-the-code">kodu doğruladığında</a> üretilir. Böylece kodları üreten servis kimsenin şifresini kendisi değiştiremez; veritabanını okuyabilen biri de değiştiremez.
			</p>
			<Table
				head={["Hata", "Ne zaman"]}
				rows={[
					[<><code>400 OtpNotConfiguredYet</code>, <code>400 OtpHostNotConfiguredYet</code></>, "Membership'in OTP ayarları yok"],
					[<code>401 UserInactive</code>, "Hesap aktif değil ya da dondurulmuş"],
					[<code>404 UserNotFound</code>, "Bilinmeyen kullanıcı"],
				]} />

			<H3 id="2-verify-the-code">
				2. Kodu doğrulayın
			</H3>
			<p>
				Kullanıcı sayfanızda username&apos;ini (ya da e-posta adresini) ve kodu girer; sayfanız şunu çağırır:
			</p>
			<Code language="http" code={samples.verifyOtp} />
			<p>
				Token gerekmez. <code>X-Host</code>, membership&apos;in <code>otp_settings.host</code> değerine eşit olmalıdır. Kodlar büyük/küçük harf ayrımı yapılmadan karşılaştırılır.
			</p>
			<p>
				<strong>Yanıt <code>200 OK</code></strong>: şu anda üretilen bir sıfırlama token&apos;ı. Geçerlilik süresi (<code>expires_in</code>) bu andan itibaren başlar.
			</p>
			<Code language="json" code={samples.verifyOtpResponse} />
			<Callout>
				bu bir access token değildir. Yalnızca <a href="#3-set-the-new-password">yeni bir şifre belirlemek</a> için kullanılabilir.
			</Callout>
			<Table
				head={["Hata", "Ne zaman"]}
				rows={[
					[<code>400 OtpHostRequired</code>, <><code>X-Host</code> eksik</>],
					[<code>401 OtpHostMismatch</code>, <><code>X-Host</code>, membership&apos;in OTP host&apos;u değil</>],
					[<code>401 InvalidCredentials</code>, "Yanlış kod ya da bilinmeyen kullanıcı"],
					[<code>401 OtpExpired</code>, "Kod doğruydu ama süresi dolmuş"],
					[<code>401 UserInactive</code>, "Hesap, kod üretildikten sonra devre dışı bırakılmış ya da dondurulmuş"],
				]} />
			<p>
				Bir kod <strong>bir kez</strong> kullanılabilir: başarılı bir doğrulama onu siler; bu yüzden aynı kodu tekrar doğrulamak <code>401 InvalidCredentials</code> döner. Sıfırlama token&apos;ı süresi dolana ya da kullanılana kadar geçerli kalır; yeniden doğrulamaya gerek yoktur.
			</p>
			<p>
				Her yanlış kod başarısız bir deneme sayılır; <code>max_attempts</code> kadar başarısız denemeden sonra kod silinir ve yenisinin üretilmesi gerekir.
			</p>

			<H3 id="3-set-the-new-password-1">
				3. Yeni şifreyi belirleyin
			</H3>
			<p>
				Önceki adımdaki <code>reset_token</code> ile <a href="#3-set-the-new-password"><code>POST /users/set-password</code></a> endpoint&apos;ini çağırın.
			</p>
		</>
	)
}
