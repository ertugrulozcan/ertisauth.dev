"use client"

import clsx from "clsx"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

type Entry = {
	id: string
	text: string
	level: number
}

// "On this page": the h2/h3 headings of the article, with the section being read highlighted
export function DocsToc({ title }: { title: string }) {
	const pathname = usePathname()
	const [entries, setEntries] = useState<Entry[]>([])
	const [active, setActive] = useState<string>()

	useEffect(() => {
		const headings = [...document.querySelectorAll<HTMLElement>("#doc-content > h2[id], #doc-content > h3[id]")]

		// Read in the next frame rather than synchronously in the effect, which would render twice in a row
		const frame = requestAnimationFrame(() =>
			setEntries(headings.map((heading) => ({
				id: heading.id,
				// The text without the trailing "#" of the anchor link
				text: heading.firstChild?.textContent ?? heading.textContent ?? "",
				level: heading.tagName === "H2" ? 2 : 3,
			}))))

		// The active heading is the last one that has scrolled past the top of the viewport (below the header)
		const observer = new IntersectionObserver(
			(observed) => {
				const visible = observed.filter((entry) => entry.isIntersecting)
				if (visible.length > 0) {
					setActive(visible[0].target.id)
				}
			},
			{ rootMargin: "-80px 0px -70% 0px" },
		)

		headings.forEach((heading) => observer.observe(heading))
		return () => {
			cancelAnimationFrame(frame)
			observer.disconnect()
		}
	}, [pathname])

	if (entries.length === 0) {
		return null
	}

	return (
		<nav aria-label={title}>
			<p className="font-mono text-[0.7rem] font-medium uppercase tracking-wider text-faint mb-3">
				{title}
			</p>
			<ul className="border-l border-border text-sm space-y-1">
				{entries.map((entry) => (
					<li key={entry.id}>
						<a
							href={`#${entry.id}`}
							className={clsx(
								"block border-l transition-colors -ml-px py-1",
								entry.level === 3 ? "pl-6" : "pl-3",
								entry.id === active ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg",
							)}>
							{entry.text}
						</a>
					</li>
				))}
			</ul>
		</nav>
	)
}
