"use client"

import clsx from "clsx"
import { useState, type ReactNode } from "react"
import { CopyButton } from "../utils/copy-button"

export type CodeTab = {
	id: string
	label: string
	content: ReactNode
	copy: string
}

export function CodeTabs({ tabs }: { tabs: CodeTab[] }) {
	const [active, setActive] = useState(tabs[0]?.id)
	const current = tabs.find((tab) => tab.id === active) ?? tabs[0]

	return (
		<div className="bg-code-bg rounded-xl border border-code-border text-code-fg overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/60">
			<div className="flex items-center bg-code-bar border-b border-code-border h-10 pr-2">
				<div role="tablist" className="flex overflow-x-auto h-full min-w-0">
					{tabs.map((tab) => {
						const selected = tab.id === current.id

						return (
							<button
								key={tab.id}
								type="button"
								role="tab"
								id={`tab-${tab.id}`}
								aria-selected={selected}
								aria-controls={`panel-${tab.id}`}
								onClick={() => setActive(tab.id)}
								className={clsx(
									"relative shrink-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent font-mono text-xs transition-colors h-full px-4",
									selected ? "text-code-fg" : "text-code-muted hover:text-code-fg",
								)}>
								{tab.label}
								{selected && (
									<span className="absolute inset-x-3 bottom-0 bg-accent h-px" aria-hidden="true" />
								)}
							</button>
						)
					})}
				</div>
				<div className="ml-auto pl-2">
					<CopyButton text={current.copy} />
				</div>
			</div>
			<div role="tabpanel" id={`panel-${current.id}`} aria-labelledby={`tab-${current.id}`}>
				{current.content}
			</div>
		</div>
	)
}
