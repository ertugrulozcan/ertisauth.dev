import clsx from "clsx"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"
import { IntlProvider } from "@/components/localization/intl-provider"
import { Providers } from "@/components/layout/providers"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { routing } from "@/localization/routing"
import { geistMono, geistSans } from "@/lib/fonts"
import { ogImage } from "@/lib/og-image"
import { icons, siteUrl } from "@/lib/site"
import "../globals.css"

type Props = {
	children: ReactNode
	params: Promise<{ locale: string }>
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}

// Only the generated languages exist; any other first path segment (e.g. /sw.js, /manifest.json) is a 404
export const dynamicParams = false

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
	const { locale } = await params
	if (!hasLocale(routing.locales, locale)) {
		return {}
	}

	const t = await getTranslations({ locale, namespace: "meta" })

	return {
		metadataBase: new URL(siteUrl),
		icons,
		title: t("title"),
		description: t("description"),
		alternates: {
			canonical: `/${locale}/`,
			languages: {
				...Object.fromEntries(routing.locales.map((l) => [l, `/${l}/`])),
				// Visitors whose language isn't one of the site's get the default language
				"x-default": `/${routing.defaultLocale}/`,
			},
		},
		openGraph: {
			type: "website",
			siteName: "ErtisAuth",
			title: t("title"),
			description: t("description"),
			url: `/${locale}/`,
			locale: locale === "tr" ? "tr_TR" : "en_US",
			images: [ogImage(locale)],
		},
		twitter: {
			card: "summary_large_image",
			title: t("title"),
			description: t("description"),
			images: [ogImage(locale)],
		},
	}
}

export default async function LocaleLayout({ children, params }: Props) {
	const { locale } = await params
	if (!hasLocale(routing.locales, locale)) {
		notFound()
	}

	setRequestLocale(locale)

	return (
		// next-themes changes the class of <html> before hydration
		<html
			lang={locale}
			className={clsx(geistSans.variable, geistMono.variable, "antialiased")}
			data-scroll-behavior="smooth"
			suppressHydrationWarning>
			<head>
				{/* Marks that JavaScript runs, before the first paint: reveal effects hide their content only then */}
				<script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js = \"\"" }} />
			</head>
			<body className="bg-bg font-sans text-fg min-h-screen">
				<NextIntlClientProvider>
					<IntlProvider>
						<Providers>
							{children}
						</Providers>
					</IntlProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
