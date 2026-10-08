import clsx from "clsx"
import type { ReactNode } from "react"
import { Reveal } from "@/components/layout/reveal"

type HeadingProps = {
	eyebrow: string
	title: string
	description?: string
	align?: "center" | "left"
}

export function SectionHeading({ eyebrow, title, description, align = "center" }: HeadingProps) {
	const centered = align === "center"

	return (
		<Reveal className={centered ? "text-center max-w-2xl mx-auto" : "max-w-xl"}>
			<p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
				{eyebrow}
			</p>
			<h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl sm:leading-relaxed mt-3">
				{title}
			</h2>
			{description && (
				<p className="text-base leading-relaxed text-pretty text-muted sm:text-lg mt-4">
					{description}
				</p>
			)}
		</Reveal>
	)
}

type SectionProps = {
	id?: string
	children: ReactNode
	className?: string
}

export function Section({ id, children, className }: SectionProps) {
	return (
		<section id={id} className={clsx("px-4 py-20 sm:px-6 sm:py-28", className)}>
			<div className="max-w-6xl mx-auto">
				{children}
			</div>
		</section>
	)
}
