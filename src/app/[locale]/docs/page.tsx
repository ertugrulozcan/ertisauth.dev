import type { Metadata } from "next"
import { DocArticle } from "@/components/docs/article"
import { homeContents } from "@/docs/content"
import { docHref } from "@/docs/paths"
import { routing, type Locale } from "@/localization/routing"
import { ogImage } from "@/lib/og-image"
import { getTranslations, setRequestLocale } from "next-intl/server"

type Props = {
	params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: "docs" })

	return {
		title: `${t("title")} · ErtisAuth`,
		description: t("description"),
		alternates: {
			canonical: docHref(locale),
			languages: {
				...Object.fromEntries(routing.locales.map((l) => [l, docHref(l)])),
				"x-default": docHref(routing.defaultLocale),
			},
		},
		// Replaces the openGraph and twitter of the parent layout as a whole (they aren't merged)
		openGraph: {
			type: "website",
			siteName: "ErtisAuth",
			locale: locale === "tr" ? "tr_TR" : "en_US",
			title: `${t("title")} · ErtisAuth`,
			description: t("description"),
			url: docHref(locale),
			images: [ogImage(locale)],
		},
		twitter: { card: "summary_large_image", title: `${t("title")} · ErtisAuth`, description: t("description"), images: [ogImage(locale)] },
	}
}

export default async function DocsHomePage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)
	const t = await getTranslations({ locale, namespace: "docs" })
	const Content = homeContents[locale]

	return (
		<DocArticle locale={locale} title={t("title")} description={t("description")}>
			<Content />
		</DocArticle>
	)
}
