import { routing } from "@/localization/routing"

// A static host can't redirect by the Accept-Language header, so the root page picks the language in the browser.
const redirectScript = `
(function () {
	var locales = ${JSON.stringify(routing.locales)}
	var preferred = (navigator.languages || [navigator.language || ""]).map(function (l) { return l.toLowerCase().split("-")[0] })
	var locale = preferred.find(function (l) { return locales.indexOf(l) !== -1 }) || "${routing.defaultLocale}"
	window.location.replace("./" + locale + "/" + window.location.hash)
})()
`

export default function RootPage() {
	return (
		<>
			<script dangerouslySetInnerHTML={{ __html: redirectScript }} />
			<noscript>
				<meta httpEquiv="refresh" content={`0; url=./${routing.defaultLocale}/`} />
			</noscript>
			<main className="flex items-center justify-center gap-4 text-sm min-h-screen">
				{routing.locales.map((locale) => (
					<a key={locale} href={`./${locale}/`} className="underline underline-offset-4">
						{locale.toUpperCase()}
					</a>
				))}
			</main>
		</>
	)
}
