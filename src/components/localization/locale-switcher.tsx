"use client"

import clsx from "clsx"
import { Languages } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { usePathname } from "@/localization/navigation"
import { routing } from "@/localization/routing"

export function LocaleSwitcher() {
	const t = useTranslations("language")
	const current = useLocale()
	// The path without the locale prefix: every page exists in every language under the same path
	const pathname = usePathname()
	const path = pathname.endsWith("/") ? pathname : `${pathname}/`

	return (
		<nav
			aria-label={t("label")}
			className="inline-flex items-center gap-1 bg-surface rounded-full border border-border py-0.5 pr-0.5 pl-3">
			<Languages className="text-faint size-3.5" aria-hidden="true" />
			{routing.locales.map((locale) => (
				// A plain link on purpose: switching the language loads the same page in the other language from the top,
				// like any page load
				<a
					key={locale}
					href={`/${locale}${path}`}
					aria-current={locale === current ? "page" : undefined}
					hrefLang={locale}
					className={clsx(
						"inline-flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-accent font-mono text-[0.7rem] font-medium uppercase transition-colors size-7 p-1",
						locale === current ? "bg-surface-2 text-fg" : "text-faint hover:text-fg",
					)}>
					{locale}
				</a>
			))}
		</nav>
	)
}
