import * as samples from "../samples/user-types"
import { Callout, Code, DocLink, H2, H3, Table } from "@/components/docs/prose"

export default function UserTypes() {
	return (
		<>
			<p>
				Kullanıcı tipi, bir kullanıcı türünün <strong>şemasıdır</strong>. O tipteki kullanıcıların standart alanların ötesinde sahip olduğu alanları, tipleri ve doğrulama kurallarıyla birlikte tanımlar. Her kullanıcı oluşturma ve güncelleme, kullanıcının tipinin şemasına göre doğrulanır.
			</p>
			<p>
				Kullanıcı tipleriyle, hiç kod değiştirmeden:
			</p>
			<ul>
				<li>
					özel alanlar ekleyebilir (telefon numarası, doğum tarihi, adres listesi, sadakat seviyesi…),
				</li>
				<li>
					alanları zorunlu, benzersiz ya da bir değer kümesiyle sınırlı yapabilir,
				</li>
				<li>
					bir tip hiyerarşisi kurabilir (<em>Customer</em> ve <em>Employee</em>&apos;nin ikisi de <em>Person</em>&apos;dan türer),
				</li>
				<li>
					bir back office&apos;in şemadan form üretmesini sağlayabilirsiniz.
				</li>
			</ul>

			<H2 id="inheritance">
				Kalıtım
			</H2>
			<p>
				Kullanıcı tipleri <code>baseType</code> üzerinden birbirinden türer. Her zincir, tüm kullanıcıların standart alanlarını tanımlayan yerleşik <strong><code>base-user</code></strong> tipinde biter:
			</p>
			<Table
				head={["Alan", "Tip", "Kurallar"]}
				rows={[
					[<code>firstname</code>, <code>string</code>, "zorunlu"],
					[<code>lastname</code>, <code>string</code>, ""],
					[<code>username</code>, <code>string</code>, "zorunlu, membership başına benzersiz"],
					[<code>email_address</code>, <code>email</code>, "zorunlu, membership başına benzersiz"],
					[<code>role</code>, <code>string</code>, "zorunlu"],
					[<code>permissions</code>, <><code>string</code> <code>array</code>&apos;i</>, "benzersiz öğeler"],
					[<code>forbidden</code>, <><code>string</code> <code>array</code>&apos;i</>, "benzersiz öğeler"],
					[<code>user_type</code>, <code>string</code>, "zorunlu"],
					[<code>source_provider</code>, <code>string</code>, "salt okunur"],
					[<code>connected_accounts</code>, <>nesne <code>array</code>&apos;i</>, "salt okunur"],
					[<code>is_active</code>, <code>boolean</code>, "salt okunur"],
					[<code>membership_id</code>, <code>string</code>, "salt okunur"],
					[<code>sys</code>, <code>object</code>, "sunucu tarafından yönetilir"],
				]} />
			<p>
				<code>base-user</code> <strong>abstract</strong>&apos;tır: hiçbir kullanıcının tipi olamaz, her zaman kendi tiplerinizi oluşturursunuz. Veritabanında saklanmaz ve liste endpoint&apos;i onu döndürmez, ama <code>GET /user-types/all</code> ve <code>GET /user-types/base-user</code> onu içerir.
			</p>
			<Code language="text" title="hierarchy" code={samples.hierarchy} />
			<p>
				Bir tip, atalarının tüm alanlarına ek olarak kendi alanlarına sahiptir.
			</p>
			<Table
				head={["Bayrak", "Anlamı"]}
				rows={[
					[<code>isAbstract</code>, "Hiçbir kullanıcı bu tipte olamaz; yalnızca diğer tiplere temel olur."],
					[<code>isSealed</code>, "Başka hiçbir tip bu tipten türeyemez."],
				]} />
			<p>
				Bir tip hem abstract hem sealed olamaz ve bir zincir kendi üzerine dönemez.
			</p>

			<H2 id="the-user-type-object">
				Kullanıcı tipi nesnesi
			</H2>
			<Code language="json" code={samples.userType} />
			<Table
				head={["Alan", "Zorunlu", "Açıklama"]}
				rows={[
					[<code>name</code>, "evet", <>Görünen ad. <code>Base User</code> ayrılmıştır.</>],
					[<code>slug</code>, "hayır", <>Verilmezse addan türetilir. <code>base-user</code> ayrılmıştır. Kullanıcılar tiplerine bu slug ile başvurur.</>],
					[<code>description</code>, "hayır", ""],
					[<code>baseType</code>, "hayır", <>Temel tipin slug&apos;ı ya da adı; slug olarak saklanır. Verilmezse <code>base-user</code>.</>],
					[<><code>isAbstract</code>, <code>isSealed</code></>, "hayır", <>Bkz. <a href="#inheritance">Kalıtım</a>. Varsayılan <code>false</code>.</>],
					[<code>allowAdditionalProperties</code>, "hayır", <><code>true</code> olduğunda kullanıcılar şemanın tanımlamadığı alanlara sahip olabilir. Varsayılan <code>false</code>: tanımlanmamış alanlar reddedilir.</>],
					[<code>properties</code>, "evet", "Bu tipin tanımladığı alanlar; alan adlarını anahtar olarak kullanan bir nesne. Miras alınan alanlar tekrarlanmaz."],
				]} />

			<H2 id="fields">
				Alanlar
			</H2>
			<p>
				<code>properties</code>&apos;in her girdisi bir alanı tanımlar. Anahtar, alanın kullanıcılarda görünen adıdır.
			</p>

			<H3 id="common-options">
				Ortak seçenekler
			</H3>
			<Table
				head={["Seçenek", "Tip", "Açıklama"]}
				rows={[
					[<code>type</code>, "string", "Alan tipi (aşağıya bakın). Zorunlu."],
					[<code>displayName</code>, "string", "Formlar için okunabilir ad."],
					[<code>description</code>, "string", "Formlar için yardım metni."],
					[<code>isRequired</code>, "boolean", "Alanın bir değeri olmalıdır. String'lerde yalnızca boşluktan oluşan değerler boş sayılır."],
					[<code>defaultValue</code>, "any", "Oluşturmada alan verilmediğinde kullanılan değer."],
					[<code>isUnique</code>, "boolean", <>İki kullanıcı aynı değeri paylaşamaz (bkz. <a href="#unique-fields">Benzersiz alanlar</a>). <code>string</code>, <code>integer</code>, <code>float</code>, <code>boolean</code>, <code>enum</code> ve string tabanlı tiplerde kullanılabilir.</>],
					[<code>isVirtual</code>, "boolean", <>Türetilmiş bir tipin alanı yeniden tanımlamasına izin verir (bkz. <a href="#redeclaring-inherited-fields">Miras alınan alanları yeniden tanımlama</a>).</>],
					[<><code>isHidden</code>, <code>isReadonly</code></>, "boolean", <>Kullanıcı arayüzleri için ipuçları. Zorunlu olan gizli bir alanın bir <code>defaultValue</code>&apos;su olmalıdır.</>],
					[<code>appearance</code>, "string", "Kullanıcı arayüzleri için ipucu (alanın nasıl gösterileceği)."],
					[<><code>isSearchable</code>, <code>searchWeight</code></>, "boolean, number", "Arama arayüzleri için ipuçları."],
				]} />
			<Callout>
				<code>isHidden</code>, <code>isReadonly</code>, <code>appearance</code>, <code>isSearchable</code> ve <code>searchWeight</code>, back office gibi kullanıcı arayüzleri için saklanır ve döndürülür; API bunları kendi alanlarınızda uygulamaz.
			</Callout>

			<H3 id="field-types">
				Alan tipleri
			</H3>
			<p>
				<strong>Temel tipler</strong>
			</p>
			<Table
				head={["Tip", "Değer", "Seçenekler"]}
				rows={[
					[<code>string</code>, "metin", <><code>minLength</code>, <code>maxLength</code>, <code>regexPattern</code> (değer eşleşmelidir), <code>restrictRegexPattern</code> (değer eşleşmemelidir), <code>formatPattern</code>, <code>caseInsensitive</code></>],
					[<code>integer</code>, "tam sayı", <><code>minimum</code>, <code>maximum</code> (dahil), <code>exclusiveMinimum</code>, <code>exclusiveMaximum</code>, <code>multipleOf</code></>],
					[<code>float</code>, "sayı", <><code>minimum</code>, <code>maximum</code>, <code>exclusiveMinimum</code>, <code>exclusiveMaximum</code></>],
					[<code>boolean</code>, <><code>true</code> / <code>false</code></>, ""],
					[<code>enum</code>, <><code>items</code>&apos;tan biri</>, <><code>items</code> (zorunlu, benzersiz, <code>{"{ \"displayName\", \"value\" }"}</code>), <code>isMultiple</code> (değer, öğe değerlerinden oluşan bir array&apos;dir)</>],
					[<code>const</code>, "sabit bir değer", <><code>value</code>, <code>valueType</code></>],
					[<code>object</code>, "iç içe nesne", <><code>properties</code> (tipin properties&apos;iyle aynı biçimde), <code>allowAdditionalProperties</code></>],
					[<code>array</code>, "liste", <><code>itemSchema</code> (öğeler için bir alan tanımı), <code>minCount</code>, <code>maxCount</code>, <code>uniqueItems</code>, <code>uniqueBy</code> (nesne öğeleri arasında benzersiz olması gereken alan adları)</>],
				]} />
			<p>
				<strong>Biçimli tipler</strong>
			</p>
			<Table
				head={["Tip", "Değer", "Seçenekler"]}
				rows={[
					[<code>email</code>, "bir e-posta adresi", "string seçenekleri"],
					[<code>uri</code>, "mutlak bir URI", "string seçenekleri"],
					[<code>hostname</code>, "bir host adı", "string seçenekleri"],
					[<code>color</code>, <>bir renk kodu, ör. <code>#1E90FF</code></>, "string seçenekleri"],
					[<code>date</code>, <code>yyyy-MM-dd</code>, <><code>minValue</code>, <code>maxValue</code></>],
					[<code>datetime</code>, <>ISO 8601 tarih ve saat, ör. <code>2026-01-01T12:00:00Z</code></>, <><code>minValue</code>, <code>maxValue</code></>],
					[<code>longtext</code>, "çok satırlı metin", "string seçenekleri"],
					[<code>richtext</code>, "HTML metin", <><code>minWordCount</code>, <code>maxWordCount</code></>],
					[<code>code</code>, "kaynak kod", "string seçenekleri"],
					[<code>json</code>, "herhangi bir JSON değeri", ""],
					[<code>tags</code>, "string array'i", <><code>minCount</code>, <code>maxCount</code>, <code>minLength</code>, <code>maxLength</code> (her etiketin)</>],
					[<code>location</code>, <code>{"{ \"latitude\": 41.01, \"longitude\": 28.97 }"}</code>, ""],
					[<><code>image</code>, <code>video</code></>, "medya tanımlayıcıları", <>boyut ve ölçü kuralları (<code>maxSize</code>, <code>minWidth</code>, <code>maxWidth</code>…)</>],
					[<code>reference</code>, "başka kullanıcılara bir referans", <><code>referenceType</code> (<code>single</code>, <code>multiple</code> ya da <code>collection</code>), <code>contentType</code> (referans verilen kullanıcıların ait olması ya da türemesi gereken kullanıcı tipinin slug&apos;ı; <code>base-user</code> her kullanıcıyı kabul eder)</>],
				]} />
			<p>
				Tarih ve saat değerleri UTC olarak saklanır. Offset içermeyen bir <code>datetime</code> UTC olarak okunur.
			</p>

			<H3 id="examples">
				Örnekler
			</H3>
			<p>
				Bir telefon numarası:
			</p>
			<Code language="json" code={samples.phone} />
			<p>
				Son yüzyıl içinde olması gereken bir doğum tarihi:
			</p>
			<Code language="json" code={samples.birthDate} />
			<p>
				Bir kümeden seçilen ilgi alanları listesi:
			</p>
			<Code language="json" code={samples.interests} />
			<p>
				Bir çalışanın yöneticisi; o da bir çalışan olmalıdır:
			</p>
			<Code language="json" code={samples.manager} />

			<H3 id="unique-fields">
				Benzersiz alanlar
			</H3>
			<p>
				Bir alan <code>isUnique</code> olarak işaretlendiğinde ErtisAuth onun için bir MongoDB unique index&apos;i oluşturur:
			</p>
			<ul>
				<li>
					Benzersizlik, alanı benzersiz tanımlayan tipin ve ondan türeyen tiplerin kullanıcıları arasında, <strong>membership içinde</strong> kontrol edilir.
				</li>
				<li>
					Boş değerler sayılmaz: birçok kullanıcı benzersiz bir alanı boş bırakabilir.
				</li>
				<li>
					<code>username</code> ve <code>email_address</code> membership içinde benzersizdir.
				</li>
			</ul>
			<p>
				Bir alanı benzersiz olarak işaretlediğinizde bazı kullanıcılar zaten aynı değeri paylaşıyorsa, kullanıcı tipi değişikliği tekrarlanan değeri belirten <code>409 UniqueFieldHasDuplicates</code> hatasıyla reddedilir. Önce tekrarları temizleyin.
			</p>
			<p>
				Tekrarlanan bir değerle yapılan kullanıcı yazma isteği, bir alan hatasıyla <code>400 ValidationException</code> döner (bkz. <DocLink to="users" hash="create-a-user">Kullanıcılar</DocLink>).
			</p>
			<p>
				Array öğelerinin içindeki benzersiz alanlar bir index&apos;le değil, uygulama tarafından kontrol edilir.
			</p>

			<H3 id="redeclaring-inherited-fields">
				Miras alınan alanları yeniden tanımlama
			</H3>
			<p>
				Bir tip, temel tiplerinden birinin zaten tanımladığı bir alanı tanımlayamaz (<code>400 SchemaValidationException</code>, &quot;field is already exist in base type&quot;). İstisnası, türetilmiş tipte <code>isVirtual: true</code> ile tanımlanan bir alandır: <code>type</code>&apos;ı miras alınanla aynı olduğu sürece kabul edilir (aksi halde <code>400 SchemaValidationException</code>, &quot;The field type cannot be overwritten on virtual fields&quot;).
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
					[<code>GET</code>, <code>{"/user-types/{id}"}</code>, "Kullanıcı tipi getirme (id ya da slug)", <code>{"user-types.read.{id}"}</code>],
					[<code>GET</code>, <code>/user-types</code>, "Saklanan kullanıcı tiplerini listeleme", <code>user-types.read</code>],
					[<code>GET</code>, <code>/user-types/all</code>, <><code>base-user</code> dahil tüm kullanıcı tipleri, sayfalamasız</>, <code>user-types.read</code>],
					[<code>GET</code>, <code>{"/user-types/relations/{id}"}</code>, "Her alanı tanımlayan tip", <code>{"user-types.read.{id}"}</code>],
					[<code>POST</code>, <code>/user-types/_query</code>, "Kullanıcı tiplerini sorgulama", <code>user-types.read</code>],
					[<code>POST</code>, <code>/user-types</code>, "Kullanıcı tipi oluşturma", <code>user-types.create</code>],
					[<code>PUT</code>, <code>{"/user-types/{id}"}</code>, "Kullanıcı tipi güncelleme", <code>{"user-types.update.{id}"}</code>],
					[<code>DELETE</code>, <code>{"/user-types/{id}"}</code>, "Kullanıcı tipi silme", <code>{"user-types.delete.{id}"}</code>],
				]} />

			<H3 id="get-a-user-type">
				Kullanıcı tipi getirme
			</H3>
			<Code language="http" code={samples.get} />
			<p>
				Tipi, <strong>temel tiplerinden miras aldığı alanlarla birlikte</strong> döner.
			</p>

			<H3 id="field-relations">
				Alan ilişkileri
			</H3>
			<Code language="http" code={samples.relations} />
			<p>
				Bir tipin alanlarını, <code>base-user</code>&apos;a kadar, onları tanımlayan tipe göre gruplar. Her seviye için bir bölüm içeren formlar oluşturmak için kullanışlıdır:
			</p>
			<Code language="json" code={samples.relationsResponse} />

			<H3 id="create-a-user-type">
				Kullanıcı tipi oluşturma
			</H3>
			<Code language="shell" code={samples.create} />
			<p>
				<strong>Yanıt <code>201 Created</code></strong>: kullanıcı tipi.
			</p>
			<Table
				head={["Hata", "Ne zaman"]}
				rows={[
					[<code>400 UserTypeNameRequired</code>, <><code>name</code> eksik</>],
					[<code>400 InheritedTypeNotFound</code>, <><code>baseType</code> yok</>],
					[<code>400 InheritedTypeIsSealed</code>, <><code>baseType</code> sealed</>],
					[<code>400 UserTypeCannotBeBothAbstractAndSealed</code>, "İki bayrak da işaretli"],
					[<code>400 UserTypeInheritanceCycle</code>, "Zincir bu tipe geri dönüyor"],
					[<><code>400 SchemaValidationException</code>, <code>400 FieldValidationException</code></>, "Bir alan tanımı geçersiz ya da bir alan zaten bir temel tip tarafından tanımlanmış"],
					[<><code>409 ReservedUserTypeName</code>, <code>409 ReservedUserTypeSlug</code></>, <><code>Base User</code> / <code>base-user</code></>],
					[<code>409 UserTypeAlreadyExists</code>, "Slug kullanımda"],
					[<code>409 UniqueFieldHasDuplicates</code>, "Benzersiz bir alanın mevcut kullanıcılar arasında tekrarlanan değerleri var"],
				]} />

			<H3 id="update-a-user-type">
				Kullanıcı tipi güncelleme
			</H3>
			<Code language="http" code={samples.update} />
			<p>
				Gövde, oluşturma isteğiyle aynı alanlara sahiptir ve tipi <strong>tamamen değiştirir</strong>: yalnızca değişenleri değil, tipin kendi <code>properties</code>&apos;inin tamamını gönderin.
			</p>
			<ul>
				<li>
					Mevcut kullanıcılar yeniden yazılmaz. Varsayılan değeri olmayan yeni bir zorunlu alan, mevcut kullanıcılar bir değer alana kadar onların sonraki güncellemelerinin başarısız olmasına yol açar; bu yüzden yeni zorunlu alanlara bir <code>defaultValue</code> verin ya da önce onları doldurun.
				</li>
				<li>
					<strong>Kullanımdaki bir tipin slug&apos;ı</strong> (kullanıcılar ya da türetilmiş tipler tarafından) değişemez: kullanıcılar tiplerine slug ile başvurduğu için yeni slug yok sayılır.
				</li>
				<li>
					Hiçbir değişiklik içermeyen bir güncelleme <code>409 IdenticalDocumentError</code> döner.
				</li>
			</ul>

			<H3 id="delete-a-user-type">
				Kullanıcı tipi silme
			</H3>
			<Code language="http" code={samples.remove} />
			<p>
				<strong>Yanıt <code>204 No Content</code></strong>. Hâlâ kullanıcıları ya da türetilmiş tipleri olan bir tip silinemez: <code>400 UserTypeCanNotBeDelete</code>.
			</p>

			<H2 id="events">
				Olaylar
			</H2>
			<p>
				<code>UserTypeCreated</code>, <code>UserTypeUpdated</code> ve <code>UserTypeDeleted</code>. Bkz. <DocLink to="events">Olaylar</DocLink>.
			</p>
		</>
	)
}
