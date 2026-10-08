import type { Metadata } from "next"
import { DocArticle } from "@/components/docs/article"
import type { DocSlug } from "@/docs/registry"
import { contents } from "@/docs/content"
import { docHref } from "@/docs/paths"
import { routing, type Locale } from "@/localization/routing"
import { ogImage } from "@/lib/og-image"
import { getTranslations, setRequestLocale } from "next-intl/server"

type Props = {
	params: Promise<{ locale: Locale, slug: DocSlug }>
}

// Every page of the registry is generated; the locale comes from the parent segment
export const dynamicParams = false

export function generateStaticParams() {
	return Object.keys(contents).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale, slug } = await params
	const t = await getTranslations({ locale, namespace: "docs" })
	const title = `${t(`pages.${slug}.title`)} · ${t("title")} · ErtisAuth`
	const description = t(`pages.${slug}.description`)

	return {
		title,
		description,
		alternates: {
			canonical: docHref(locale, slug),
			languages: {
				...Object.fromEntries(routing.locales.map((l) => [l, docHref(l, slug)])),
				"x-default": docHref(routing.defaultLocale, slug),
			},
		},
		// Replaces the openGraph and twitter of the parent layout as a whole (they aren't merged)
		openGraph: {
			type: "article",
			siteName: "ErtisAuth",
			locale: locale === "tr" ? "tr_TR" : "en_US",
			title,
			description,
			url: docHref(locale, slug),
			images: [ogImage(locale)],
		},
		twitter: { card: "summary_large_image", title, description, images: [ogImage(locale)] },
	}
}

export default async function DocPage({ params }: Props) {
	const { locale, slug } = await params
	setRequestLocale(locale)
	const t = await getTranslations({ locale, namespace: "docs" })
	const Content = contents[slug][locale]

	return (
		<DocArticle locale={locale} slug={slug} title={t(`pages.${slug}.title`)} description={t(`pages.${slug}.description`)}>
			<Content />
		</DocArticle>
	)
}
