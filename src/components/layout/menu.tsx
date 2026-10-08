"use client"

import React, { useEffect, useState } from "react"
import clsx from "clsx"
import { usePathname } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Menu as MenuIcon, X } from "lucide-react"
import { Logo } from "@/components/icons/logo"
import { GitHubIcon } from "@/components/icons/github-icon"
import { LocaleSwitcher } from "@/components/localization/locale-switcher"
import { ThemeSwitcher } from "@/components/utils/theme-switcher"
import { links } from "@/lib/site"

const sections = ["features", "permissions", "security", "developers", "compare"] as const;

type MenuProps = object

export interface MenuRef {
	open: () => void;
	close: () => void;
}

/* eslint-disable-next-line react/display-name */
const Menu = React.forwardRef<MenuRef, MenuProps>((props: MenuProps, ref) => {
	React.useImperativeHandle(ref, () => ({ open, close }), []);

	const pathname = usePathname()
	const locale = useLocale()

	const t = useTranslations("nav")
	
	const home = `/${locale}/`
	const docs = `${home}docs/`
	const onHome = pathname === home
	const onDocs = pathname.startsWith(docs)

	const sectionHref = (section: string) => (onHome ? `#${section}` : `${home}#${section}`)

	const [isOpen, setIsOpen] = useState(false)

	const open = () => {
		setIsOpen(true)
	}

	const close = () => {
		setIsOpen(false)
	}

	useEffect(() => {
		if (!isOpen) {
			return
		}

		const root = document.documentElement
		const overflow = root.style.overflow
		root.style.overflow = "hidden"

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				close()
			}
		}

		// The lg breakpoint of Tailwind, where the desktop navigation replaces the menu
		const desktop = window.matchMedia("(min-width: 64rem)")
		const onViewportChange = () => {
			if (desktop.matches) {
				close()
			}
		}

		window.addEventListener("keydown", onKeyDown)
		desktop.addEventListener("change", onViewportChange)

		return () => {
			root.style.overflow = overflow
			window.removeEventListener("keydown", onKeyDown)
			desktop.removeEventListener("change", onViewportChange)
		}
	}, [isOpen])

	return (
		<>
		<nav className="hidden items-center gap-1 lg:flex">
			{sections.map((section) => (
				<a
					key={section}
					href={sectionHref(section)}
					className="rounded-md text-sm text-muted hover:text-fg hover:underline transition-colors px-2.5 py-2 xl:px-3">
					{t(section)}
				</a>
			))}
			<a
				href={docs}
				aria-current={onDocs ? "page" : undefined}
				className={clsx("rounded-md text-sm hover:underline transition-colors px-2.5 py-2 xl:px-3", onDocs ? "text-fg" : "text-muted hover:text-fg")}>
				{t("docs")}
			</a>
		</nav>

		<button
			type="button"
			className="inline-flex items-center justify-center lg:hidden rounded-md text-muted hover:text-fg hover:cursor-pointer size-9 ml-auto"
			aria-expanded={isOpen}
			aria-controls="mobile-menu"
			aria-label={isOpen ? t("close") : t("menu")}
			onClick={() => isOpen ? close() : open()}>
			{isOpen ? <X className="size-5" /> : <MenuIcon className="size-5" />}
		</button>

		<div
			id="mobile-menu"
			inert={!isOpen}
			className={clsx(
				"absolute flex flex-col bg-gray-200/35 dark:bg-black/50 top-0 inset-x-0 lg:hidden transition-[opacity,translate,visibility] duration-300 ease-out motion-reduce:transition-none h-svh",
				isOpen ? "opacity-100 translate-y-0" : "invisible opacity-0 -translate-y-2 pointer-events-none",
			)}>
			<div className="bg-bg border-b border-border shadow-2xl dark:shadow-2xl shadow-gray-300 dark:shadow-black px-4 pb-6">
				<div className="flex items-center justify-between border-b border-border h-16 px-1 pt-0.5">
					<Logo />
					<div className="flex items-center gap-2">
						<div
							className={clsx(
								"lg:hidden transition-[opacity,visibility] duration-200 ease-out motion-reduce:transition-none hover:cursor-pointer ml-2",
								isOpen ? "opacity-100" : "invisible opacity-0 pointer-events-none",
							)}
							aria-hidden="true"
							onClick={() => close()}>
							<X className="size-5" />
						</div>
					</div>
				</div>
				<nav className="flex flex-col px-3 py-2">
					{sections.map((section) => (
						<a
							key={section}
							href={sectionHref(section)}
							onClick={() => close()}
							className="text-lg text-fg hover:text-hover hover:underline py-3">
							{t(section)}
						</a>
					))}
					<a
						href={docs}
						aria-current={onDocs ? "page" : undefined}
						className={clsx("text-lg py-3", onDocs ? "text-fg" : "text-fg hover:text-hover hover:underline")}>
						{t("docs")}
					</a>
					<a href={links.github} className="inline-flex items-center gap-2 text-lg text-fg hover:text-hover py-3">
						<GitHubIcon className="size-4" />
						{t("github")}
					</a>
				</nav>
				<div className="flex items-center justify-end gap-2 mt-2">
					<LocaleSwitcher />
					<ThemeSwitcher />
				</div>
			</div>
			<div onClick={() => close()} className={`bg-transparent w-full h-full ${isOpen ? "opacity-100" : "invisible opacity-0 pointer-events-none"}`}></div>
		</div>
		</>
	)
});

export default Menu;