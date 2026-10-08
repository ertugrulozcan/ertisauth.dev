import { use } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Compare } from "@/components/sections/compare"
import { Cta } from "@/components/sections/cta"
import { Developers } from "@/components/sections/developers"
import { Features } from "@/components/sections/features"
import { GetStarted } from "@/components/sections/get-started"
import { Hero } from "@/components/sections/hero"
import { Highlights } from "@/components/sections/highlights"
import { Permissions } from "@/components/sections/permissions"
import { Security } from "@/components/sections/security"
import { setRequestLocale } from "next-intl/server"
import { useTranslations } from "next-intl"
import { links, siteUrl } from "@/lib/site"

import type { Locale } from "@/localization/routing"

export default function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
	const { locale } = use(params)
	setRequestLocale(locale)

	const t = useTranslations("meta")

	// Structured data for search engines; "<" is escaped so that no text can close the script element
	const structuredData = JSON.stringify({
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "ErtisAuth",
		description: t("description"),
		url: `${siteUrl}/${locale}/`,
		inLanguage: locale,
		applicationCategory: "DeveloperApplication",
		applicationSubCategory: "Identity and access management",
		operatingSystem: "Linux, macOS, Windows",
		softwareRequirements: ".NET 10, MongoDB 7.0 or later",
		license: "https://opensource.org/licenses/MIT",
		isAccessibleForFree: true,
		offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
		author: { "@type": "Person", name: "Ertuğrul Özcan" },
		sameAs: [links.github],
	}).replace(/</g, "\\u003c")

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
			<Header />
			<main className="-mt-16">
				<Hero />
				<Highlights />
				<Features />
				<Permissions />
				<Security />
				<Developers />
				<Compare />
				<GetStarted />
				<Cta />
			</main>
			<Footer />
		</>
	)
}
