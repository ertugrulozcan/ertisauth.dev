import type { MetadataRoute } from "next"
import type { DocSlug } from "@/docs/registry"
import { contents } from "@/docs/content"
import { docHref } from "@/docs/paths"
import { routing, type Locale } from "@/localization/routing"
import { siteUrl } from "@/lib/site"

// Required with output: "export"; the file is written once at build time
export const dynamic = "force-static"

// Every page in every language; each entry lists the page's other languages as alternates
export default function sitemap(): MetadataRoute.Sitemap {
	// The pages change only with a new build, so the build time is their modification time
	const lastModified = new Date()

	const paths: ((locale: Locale) => string)[] = [
		(locale) => `/${locale}/`,
		(locale) => docHref(locale),
		...(Object.keys(contents) as DocSlug[]).map((slug) => (locale: Locale) => docHref(locale, slug)),
	]

	return paths.flatMap((path) => {
		const languages = {
			...Object.fromEntries(routing.locales.map((locale) => [locale, `${siteUrl}${path(locale)}`])),
			"x-default": `${siteUrl}${path(routing.defaultLocale)}`,
		}

		return routing.locales.map((locale) => ({
			url: `${siteUrl}${path(locale)}`,
			lastModified,
			alternates: { languages },
		}))
	})
}
