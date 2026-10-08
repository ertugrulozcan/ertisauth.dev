import * as samples from "../samples/roles"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function Roles() {
	return (
		<>
			<p>
				Rol, kullanıcıların ve uygulamaların paylaştığı, adı olan bir yetki kümesidir. Her kullanıcının ve her uygulamanın, slug&apos;ıyla başvurulan tam olarak bir rolü vardır. Rollerin kullanıcıya özel yetkilerle birlikte nasıl değerlendirildiği <DocLink to="authorization">Yetkilendirme</DocLink> sayfasında anlatılır.
			</p>

			<H2 id="the-role-object">
				Rol nesnesi
			</H2>
			<Code language="json" code={samples.role} />
			<Table
				head={["Alan", "Zorunlu", "Açıklama"]}
				rows={[
					[<code>name</code>, "evet", "Görünen ad."],
					[<code>slug</code>, "hayır", "Membership içinde benzersiz; verilmezse addan türetilir. Kullanıcılar ve uygulamalar role slug'ıyla başvurur."],
					[<code>description</code>, "hayır", ""],
					[<code>permissions</code>, "hayır", <>Rolün izin verdikleri, <DocLink to="authorization" hash="permission-expressions">yetki ifadeleri</DocLink> olarak.</>],
					[<code>forbidden</code>, "hayır", "Rolün yasakladıkları. Yasak bir girdi, aynı rolün yetkisine karşı her zaman kazanır."],
				]} />
			<p>
				Aynı ifade iki listede birden bulunamaz.
			</p>

			<H2 id="the-admin-role">
				<code>admin</code> rolü
			</H2>
			<p>
				Kurulum, ErtisAuth API&apos;sinin her kaynağı üzerinde <code>create</code>, <code>read</code>, <code>update</code> ve <code>delete</code> yetkisine sahip <code>admin</code> rolünü oluşturur. Slug&apos;ı ayrılmıştır: bu slug&apos;la başka rol oluşturulamaz ve rol silinemez.
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
					[<code>GET</code>, <code>{"/roles/{id}"}</code>, "Rol getirme (id ya da slug)", <code>{"roles.read.{id}"}</code>],
					[<code>GET</code>, <code>/roles</code>, "Rolleri listeleme", <code>roles.read</code>],
					[<code>POST</code>, <code>/roles/_query</code>, "Rolleri sorgulama", <code>roles.read</code>],
					[<code>GET</code>, <code>/roles/search?keyword=</code>, "Rol arama", <code>roles.read</code>],
					[<code>POST</code>, <code>/roles</code>, "Rol oluşturma", <code>roles.create</code>],
					[<code>PUT</code>, <code>{"/roles/{id}"}</code>, "Rol güncelleme", <code>{"roles.update.{id}"}</code>],
					[<code>DELETE</code>, <code>{"/roles/{id}"}</code>, "Rol silme", <code>{"roles.delete.{id}"}</code>],
					[<code>DELETE</code>, <code>/roles</code>, "Birden fazla rol silme", <code>roles.delete</code>],
					[<code>GET</code>, <code>{"/roles/{id}/check-permission?permission="}</code>, "Bir rolün yetkisini kontrol etme", <code>roles.read</code>],
					[<code>GET</code>, <code>/roles/check-permission?permission=</code>, "Çağıranın yetkisini kontrol etme", "geçerli herhangi bir token"],
				]} />

			<H3 id="create-a-role">
				Rol oluşturma
			</H3>
			<Code language="shell" code={samples.create} />
			<p>
				<strong>Yanıt <code>201 Created</code></strong>: rol.
			</p>
			<Table
				head={["Hata", "Ne zaman"]}
				rows={[
					[<code>400 ModelValidationError</code>, "Ad eksik, slug geçersiz ya da aynı ifade iki listede birden var"],
					[<code>400 InvalidRbac</code>, "Bir ifade geçerli değil"],
					[<code>404 MembershipNotFound</code>, "Membership yok"],
					[<code>409 RoleAlreadyExists</code>, "Slug kullanımda"],
					[<code>409 ReservedRole</code>, <>Slug <code>admin</code></>],
				]} />

			<H3 id="update-a-role">
				Rol güncelleme
			</H3>
			<Code language="http" code={samples.update} />
			<p>
				Gövde, oluşturma isteğiyle aynı alanlara sahiptir ve rolün <code>permissions</code> ve <code>forbidden</code> listelerini değiştirir. Değişiklik, token&apos;ları yeniden verilmeden, rolü taşıyan her kullanıcıya ve uygulamaya uygulanır. Birden fazla ErtisAuth instance&apos;ı çalıştırıyorsanız her instance rolleri en fazla 5 dakika önbellekte tuttuğundan, değişikliğin hepsine ulaşması bu kadar sürebilir (bkz. <DocLink to="operations" hash="caching">Operasyon</DocLink>).
			</p>
			<p>
				Hiçbir değişiklik içermeyen bir güncelleme <code>409 IdenticalDocumentError</code> döner.
			</p>

			<H3 id="delete-a-role">
				Rol silme
			</H3>
			<Code language="http" code={samples.remove} />
			<p>
				<strong>Yanıt <code>204 No Content</code></strong>. <code>admin</code> rolü silinemez (<code>409 SystemRolesCannotBeDeleted</code>). Birden fazla rol <DocLink to="api-conventions" hash="bulk-delete">toplu silme</DocLink> ile tek seferde silinebilir.
			</p>
			<Callout>
				bir rolü silmeden önce hiçbir kullanıcının ya da uygulamanın onu hâlâ kullanmadığından emin olun: aksi halde istekleri <code>403 AccessDenied</code> (&quot;role is not found&quot;) ile reddedilir.
			</Callout>

			<H3 id="check-permissions">
				Yetki kontrolü
			</H3>
			<p>
				Bkz. <DocLink to="authorization" hash="checking-a-permission">Yetkilendirme</DocLink>.
			</p>

			<H2 id="events">
				Olaylar
			</H2>
			<p>
				<code>RoleCreated</code>, <code>RoleUpdated</code> ve <code>RoleDeleted</code>. Bkz. <DocLink to="events">Olaylar</DocLink>.
			</p>
		</>
	)
}
