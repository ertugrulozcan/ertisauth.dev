"use client"

import React from "react"
import clsx from "clsx"
import Menu, { MenuRef } from "./menu"
import { usePathname } from "next/navigation"
import { LocaleSwitcher } from "@/components/localization/locale-switcher"
import { ThemeSwitcher } from "@/components/utils/theme-switcher"
import { Logo } from "@/components/icons/logo"
import { GitHubIcon } from "@/components/icons/github-icon"
import { useTranslations, useLocale } from "next-intl"
import { links } from "@/lib/site"

export function Header() {
	const menu = React.createRef<MenuRef>()

	const t = useTranslations("nav")

	const pathname = usePathname()
	const locale = useLocale()

	const home = `/${locale}/`
	const docs = `${home}docs/`
	const onDocs = pathname.startsWith(docs)
	
	return (
		<header
			className={clsx(
				"sticky top-0 border-b transition-colors z-50",
				"bg-bg/60 border-border backdrop-blur-xl"
			)}>
			<div className={`flex items-center gap-4 xl:gap-6 h-16 ${onDocs ? "max-w-full 2xl:max-w-384" : "max-w-6xl 2xl:max-w-7xl"} mx-auto pl-5 pr-3 sm:px-6`}>
				<a
					href={home}
					className="flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-accent"
					onClick={() => menu.current?.close()}>
					<Logo />
				</a>

				<Menu ref={menu} />

				<div className="hidden items-center gap-2 lg:flex ml-auto">
					<LocaleSwitcher />
					<ThemeSwitcher />
					<a
						href={links.github}
						aria-label={t("github")}
						className="inline-flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-accent text-muted hover:text-fg transition-colors size-9">
						<GitHubIcon className="size-[1.15rem]" />
					</a>
				</div>
			</div>
		</header>
	)
}
