import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { Locale } from "@/localization/routing"
import { docHref } from "@/docs/paths"
import { docGroups, type DocSlug } from "@/docs/registry"
import { useTranslations } from "next-intl"

type Props = {
	locale: Locale
	slug?: DocSlug
	title: string
	description: string
	children: ReactNode
}

// The order of the pages for the previous/next links: the overview, then the pages in sidebar order
function sequence(): (DocSlug | undefined)[] {
	return [undefined, ...docGroups.flatMap((group) => group.pages)]
}

export function DocArticle({ locale, slug, title, description, children }: Props) {
	const t = useTranslations("docs")
	const pages = sequence()
	const position = pages.indexOf(slug)
	const previous = position > 0 ? pages[position - 1] : null
	const next = position >= 0 && position < pages.length - 1 ? pages[position + 1] : null
	const pageTitle = (page: DocSlug | undefined) => (page ? t(`pages.${page}.title`) : t("home"))

	return (
		<article className="min-w-0">
			<header className="border-b border-border pb-8">
				<h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
					{title}
				</h1>
				<p className="text-base leading-relaxed text-pretty text-muted sm:text-base mt-2.5">
					{description}
				</p>
			</header>

			<div id="doc-content" className="docs-prose">
				{children}
			</div>

			<nav className="grid gap-4 sm:grid-cols-2 border-t border-border mt-16 pt-8" aria-label={`${t("previous")} / ${t("next")}`}>
				{previous !== null ? (
					<Link href={docHref(locale, previous)} className="group rounded-xl border border-border hover:border-border-strong group transition-colors p-4">
						<span className="flex items-center gap-1.5 text-xs text-faint group-hover:text-sky-600">
							<ArrowLeft className="size-3.5" aria-hidden="true" />
							{t("previous")}
						</span>
						<span className="block font-medium mt-1">
							{pageTitle(previous)}
						</span>
					</Link>
				) : (
					<span />
				)}
				{next !== null && (
					<Link href={docHref(locale, next)} className="group rounded-xl border border-border hover:border-border-strong text-right group transition-colors p-4">
						<span className="flex items-center justify-end gap-1.5 text-xs text-faint group-hover:text-sky-600">
							{t("next")}
							<ArrowRight className="size-3.5" aria-hidden="true" />
						</span>
						<span className="block font-medium mt-1">
							{pageTitle(next)}
						</span>
					</Link>
				)}
			</nav>

			<p className="text-sm text-faint mt-10">
				{t("mistake")}{" "}
				<a href="https://github.com/ertugrulozcan/ErtisAuth/issues" className="text-accent hover:underline hover:underline-offset-4">
					{t("openIssue")}
				</a>
			</p>
		</article>
	)
}
