import type { Locale } from "@/localization/routing"
import type { DocSlug } from "./registry"

// The URL of a page of the documentation (the overview without a slug)
export function docHref(locale: Locale, slug?: DocSlug, hash?: string) {
	const fragment = hash ? `#${hash}` : ""

	if (!slug) {
		return `/${locale}/docs/${fragment}`
	}

	return `/${locale}/docs/${slug}/${fragment}`
}
