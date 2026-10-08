import Link from "next/link"
import clsx from "clsx"
import en from "@/localization/locales/en.json"
import tr from "@/localization/locales/tr.json"
import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import { Providers } from "@/components/layout/providers"
import { LogoMark } from "@/components/icons/logo"
import { routing, type Locale } from "@/localization/routing"
import { geistMono, geistSans } from "@/lib/fonts"
import { icons } from "@/lib/site"
import "./globals.css"

// The static host serves this single page for every unknown URL, so the language can't be known at build time:
// the page contains every language, and a script shows the one of the URL (/tr/...) or of the browser.
const messages: Record<Locale, typeof en.notFound> = {
	en: en.notFound,
	tr: tr.notFound,
}

const languageScript = `
(function () {
	var locales = ${JSON.stringify(routing.locales)}
	var fromPath = window.location.pathname.split("/")[1]
	var fromBrowser = (navigator.language || "").toLowerCase().split("-")[0]
	var locale = locales.indexOf(fromPath) !== -1 ? fromPath : locales.indexOf(fromBrowser) !== -1 ? fromBrowser : "${routing.defaultLocale}"
	document.documentElement.lang = locale
})()
`

// Every language block is hidden unless <html lang> selects it; without JavaScript the default language stays visible
const languageStyle = routing.locales
	.map((locale) => `html:not([lang="${locale}"]) [data-locale="${locale}"] { display: none; }`)
	.join("\n")

export const metadata: Metadata = {
	title: "404 · ErtisAuth",
	icons,
}

export default function GlobalNotFound() {
	return (
		// The script changes lang, and next-themes the class, before hydration
		<html
			lang={routing.defaultLocale}
			className={clsx(geistSans.variable, geistMono.variable, "antialiased")}
			data-scroll-behavior="smooth"
			suppressHydrationWarning>
			<body className="bg-bg font-sans text-fg min-h-screen">
				<script dangerouslySetInnerHTML={{ __html: languageScript }} />
				<style dangerouslySetInnerHTML={{ __html: languageStyle }} />
				<Providers>
					<main className="relative flex flex-col items-center justify-center text-center overflow-hidden min-h-screen px-4 pb-16 sm:px-6">
						<div className="absolute inset-0 hero-grid pointer-events-none -z-10" aria-hidden="true" />
						<div className="absolute inset-0 hero-glow pointer-events-none -z-10" aria-hidden="true" />

						<div className="flex items-center gap-x-1.5 pr-3">
							<Link
								href="/"
								className="rounded-md focus-visible:outline-2 focus-visible:outline-accent"
								aria-label="ErtisAuth">
								<LogoMark className="size-16" />
							</Link>

							<p className="text-gradient font-mono text-7xl font-semibold tracking-tight sm:text-7xl" aria-hidden="true">
								404
							</p>
						</div>

						{routing.locales.map((locale) => {
							const t = messages[locale]

							return (
								<div key={locale} data-locale={locale} lang={locale}>
									<h1 className="text-2xl font-semibold tracking-tight sm:text-2xl mt-8">
										{`${t.title}!`}
									</h1>
									<p className="text-sm leading-relaxed text-pretty text-muted max-w-md mx-auto mt-3">
										{t.description}
									</p>

									<div className="flex flex-col items-center justify-center gap-3 sm:flex-row mt-9">
										<a
											href={`/${locale}/`}
											className={clsx(
												"inline-flex items-center gap-2",
												"bg-fg",
												"rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
												"text-sm font-medium text-bg",
												"transition-opacity hover:opacity-90",
												"h-11 px-6",
											)}>
											<ArrowLeft className="size-4" />
											{t.home}
										</a>
									</div>
								</div>
							)
						})}
					</main>
				</Providers>
			</body>
		</html>
	)
}
