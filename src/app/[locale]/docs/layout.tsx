import type { ReactNode } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DocsSidebar, type SidebarGroup } from "@/components/docs/sidebar"
import { DocsToc } from "@/components/docs/toc"
import { docHref } from "@/docs/paths"
import { docGroups } from "@/docs/registry"
import { routing } from "@/localization/routing"
import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"

type Props = {
	children: ReactNode
	params: Promise<{ locale: string }>
}

export default async function DocsLayout({ children, params }: Props) {
	const { locale } = await params
	if (!hasLocale(routing.locales, locale)) {
		return null
	}

	setRequestLocale(locale)
	const t = await getTranslations({ locale, namespace: "docs" })

	const groups: SidebarGroup[] = [
		{ title: t("title"), items: [{ href: docHref(locale), title: t("home") }] },
		...docGroups.map((group) => ({
			title: t(`groups.${group.key}`),
			items: group.pages.map((page) => ({ href: docHref(locale, page), title: t(`pages.${page}.title`) })),
		})),
	]

	return (
		<>
			<Header />
			<div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[14rem_minmax(0,1fr)_12rem] max-w-7xl mx-auto px-4 pt-8 pb-24 sm:px-6 lg:pt-12">
				<aside className="lg:sticky lg:top-24 lg:self-start lg:overflow-y-auto lg:max-h-[calc(100dvh-7rem)]">
					<DocsSidebar groups={groups} menuLabel={t("menu")} />
				</aside>
				<main className="min-w-0">
					{children}
				</main>
				<aside className="xl:sticky xl:top-24 hidden xl:block xl:self-start">
					<DocsToc title={t("onThisPage")} />
				</aside>
			</div>
			<Footer />
		</>
	)
}
