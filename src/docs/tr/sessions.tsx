import * as samples from "../samples/sessions"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Sessions() {
	return (
		<>
			<p>
				ErtisAuth, verdiği her token çiftini takip eder. Kullanıcılara nerelerde oturum açık olduğunu göstermek için bir membership&apos;in <strong>aktif token&apos;larını</strong>, denetim için de <strong>iptal edilmiş token&apos;larını</strong> listeleyebilirsiniz.
			</p>

			<H2 id="active-tokens">
				Aktif token&apos;lar
			</H2>
			<p>
				Aktif token, süresi dolmamış ve iptal edilmemiş bir token çiftidir.
			</p>
			<Code language="json" code={samples.activeToken} />
			<Table
				head={["Alan", "Açıklama"]}
				rows={[
					[<code>expire_time</code>, "Access token'ın süresinin dolduğu an"],
					[<code>retain_until</code>, "Access ve refresh token bitiş zamanlarından geç olanı. MongoDB kaydı bu zamandan birkaç dakika sonra siler."],
					[<code>client_info</code>, <>Girişin IP adresi ve user agent&apos;ı; istekten ya da <code>X-IpAddress</code> ve <code>X-UserAgent</code> header&apos;larından alınır</>],
				]} />
			<Callout type="warning">
				aktif token kayıtları token&apos;ların kendisini içerir. Onları okuyabilen herkes o kullanıcılar adına işlem yapabilir. <code>tokens.read</code> yetkisini yalnızca güvenilir operatörlere verin ve oturumları bir kullanıcı arayüzünde gösterirken token&apos;ları dışarıda bırakmak için <code>select</code> kullanın.
			</Callout>

			<H3 id="endpoints">
				Endpoint&apos;ler
			</H3>
			<p>
				Tüm route&apos;lar <code>{"/memberships/{membershipId}"}</code> altındadır.
			</p>
			<Table
				head={["Metot", "Route", "Açıklama", "Yetki"]}
				rows={[
					[<code>GET</code>, <code>{"/active-tokens/{id}"}</code>, "Aktif token getirme", <code>{"tokens.read.{id}"}</code>],
					[<code>GET</code>, <code>/active-tokens</code>, "Aktif token'ları listeleme", <code>tokens.read</code>],
					[<code>POST</code>, <code>/active-tokens/_query</code>, "Aktif token'ları sorgulama", <code>tokens.read</code>],
					[<code>POST</code>, <code>/active-tokens/_aggregate</code>, "Aggregation pipeline çalıştırma", <code>tokens.read</code>],
				]} />

			<H3 id="examples">
				Örnekler
			</H3>
			<p>
				Bir kullanıcının oturumları, token değerleri olmadan:
			</p>
			<Code language="shell" code={samples.userSessions} />
			<p>
				Günlük giriş yapmış kullanıcı sayısı:
			</p>
			<Code language="json" code={samples.dailyUsers} />
			<p>
				Bir oturumu sonlandırmak için token&apos;ını <DocLink to="authentication" hash="sign-out">iptal edin</DocLink>. Bir kullanıcının her yerdeki oturumunu kapatmak için <code>logout-all=true</code> ile iptal edin, <DocLink to="users" hash="change-a-password">parolasını değiştirin</DocLink> ya da kullanıcıyı <DocLink to="users" hash="freeze-a-user">dondurun</DocLink>.
			</p>

			<H2 id="revoked-tokens">
				İptal edilmiş token&apos;lar
			</H2>
			<p>
				İptal edilmiş token&apos;lar, zaten süreleri dolacağı ana kadar saklanır; böylece o zamana kadar reddedilirler.
			</p>
			<Code language="json" code={samples.revokedToken} />

			<H3 id="endpoints-1">
				Endpoint&apos;ler
			</H3>
			<Table
				head={["Metot", "Route", "Açıklama", "Yetki"]}
				rows={[
					[<code>GET</code>, <code>{"/memberships/{membershipId}/revoked-tokens"}</code>, "İptal edilmiş token'ları listeleme", <code>tokens.read</code>],
					[<code>POST</code>, <code>{"/memberships/{membershipId}/revoked-tokens/_query"}</code>, "İptal edilmiş token'ları sorgulama", <code>tokens.read</code>],
				]} />
		</>
	)
}
