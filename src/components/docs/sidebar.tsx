"use client"

import Link from "next/link"
import clsx from "clsx"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"

export type SidebarGroup = {
	title: string
	items: { href: string, title: string }[]
}

type Props = {
	groups: SidebarGroup[]
	menuLabel: string
}

export function DocsSidebar({ groups, menuLabel }: Props) {
	const pathname = usePathname()
	const [open, setOpen] = useState(false)
	const current = groups.flatMap((group) => group.items).find((item) => item.href === pathname)

	return (
		<nav aria-label={menuLabel}>
			{/* Below lg the list is a disclosure, opened from a bar showing the current page */}
			<button
				type="button"
				className="flex items-center justify-between lg:hidden bg-surface rounded-lg border border-border text-sm font-medium w-full px-4 py-2.5"
				aria-expanded={open}
				aria-controls="docs-sidebar"
				onClick={() => setOpen((value) => !value)}>
				{current?.title ?? menuLabel}
				<ChevronDown className={clsx("text-faint transition-transform size-4", open && "rotate-180")} aria-hidden="true" />
			</button>

			<div id="docs-sidebar" className={clsx(open ? "block" : "hidden", "lg:block mt-4 lg:mt-0")}>
				{groups.map((group) => (
					<div key={group.title} className="mb-6">
						<p className="font-mono text-[0.7rem] font-medium uppercase tracking-wider text-faint mb-2 px-3">
							{group.title}
						</p>
						<ul className="space-y-0.5">
							{group.items.map((item) => {
								const active = item.href === pathname

								return (
									<li key={item.href}>
										<Link
											href={item.href}
											aria-current={active ? "page" : undefined}
											onClick={() => setOpen(false)}
											className={clsx(
												"block rounded-md text-sm transition-colors px-3 py-1.5",
												active ? "bg-accent-soft font-medium text-fg" : "text-muted hover:text-fg",
											)}>
											{item.title}
										</Link>
									</li>
								)
							})}
						</ul>
					</div>
				))}
			</div>
		</nav>
	)
}
