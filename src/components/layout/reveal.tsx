"use client"

import type { CSSProperties, ReactNode } from "react"

import clsx from "clsx"
import { useInView } from "@/lib/use-in-view"

type Props = {
	children: ReactNode
	className?: string
	// Milliseconds; staggers the items of a list
	delay?: number
}

// Fades and slides its content in when it scrolls into view (styles in globals.css, under .reveal).
// min-w-0: as a grid cell it must be able to shrink below the width of content that doesn't wrap.
export function Reveal({ children, className, delay = 0 }: Props) {
	const [ref, visible] = useInView<HTMLDivElement>({ once: true, rootMargin: "0px 0px -10% 0px" })

	return (
		<div
			ref={ref}
			className={clsx("reveal min-w-0", className)}
			data-visible={visible || undefined}
			style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
			{children}
		</div>
	)
}
