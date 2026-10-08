import clsx from "clsx"
import en from "@/localization/locales/en.json"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { routing } from "@/localization/routing"
import { geistSans } from "@/lib/fonts"
import { ogImage } from "@/lib/og-image"
import { icons, siteUrl } from "@/lib/site"

import "../globals.css"

// The root URL only redirects to a language, so it isn't indexed; but it is the URL most often shared,
// so it carries the description and the shared image of the default language
export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: en.meta.title,
	description: en.meta.description,
	robots: { index: false },
	icons,
	openGraph: {
		type: "website",
		siteName: "ErtisAuth",
		title: en.meta.title,
		description: en.meta.description,
		url: "/",
		locale: "en_US",
		images: [ogImage(routing.defaultLocale)],
	},
	twitter: {
		card: "summary_large_image",
		title: en.meta.title,
		description: en.meta.description,
		images: [ogImage(routing.defaultLocale)],
	},
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html
			lang="en"
			className={clsx(geistSans.variable, "antialiased")}
			data-scroll-behavior="smooth">
			<body className="font-sans">
				{children}
			</body>
		</html>
	)
}
