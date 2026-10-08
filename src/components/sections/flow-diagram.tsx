"use client"

import clsx from "clsx"
import { useEffect, useRef } from "react"
import { Database, Globe, type LucideIcon, Server, Smartphone, Tv } from "lucide-react"
import { LogoMark } from "@/components/icons/logo"
import { useTranslations } from "next-intl"
import { useInView, usePrefersReducedMotion } from "@/lib/use-in-view"

// Coordinates in the viewBox (800 x 360); the HTML nodes are placed over the SVG with the same proportions
const width = 800
const height = 360
const clientEdge = 170
const centerLeft = 320
const centerRight = 480
const databaseEdge = 620
const middle = 180

const clients: { key: "backend" | "web" | "mobile" | "tv", icon: LucideIcon, y: number }[] = [
	{ key: "backend", icon: Server, y: 70 },
	{ key: "web", icon: Globe, y: 145 },
	{ key: "mobile", icon: Smartphone, y: 225 },
	{ key: "tv", icon: Tv, y: 305 },
]

const clientPath = (y: number) => `M${clientEdge},${y} C${clientEdge + 70},${y} ${centerLeft - 70},${middle} ${centerLeft},${middle}`
const databasePath = `M${centerRight},${middle} L${databaseEdge},${middle}`

const percent = (value: number, total: number) => `${(value / total) * 100}%`

// A dot that travels along a path; reverse makes it travel from the end to the start
function Pulse({ path, color, begin, duration, reverse = false }: { path: string, color: string, begin: number, duration: number, reverse?: boolean }) {
	return (
		<circle r="4" fill={color} opacity="0">
			<animateMotion
				path={path}
				dur={`${duration}s`}
				begin={`${begin}s`}
				repeatCount="indefinite"
				keyPoints={reverse ? "1;0" : "0;1"}
				keyTimes="0;1"
				calcMode="linear" />
			<animate
				attributeName="opacity"
				values="0;1;1;0"
				keyTimes="0;0.15;0.85;1"
				dur={`${duration}s`}
				begin={`${begin}s`}
				repeatCount="indefinite" />
		</circle>
	)
}

export function FlowDiagram() {
	const t = useTranslations("hero.diagram")
	const [ref, inView] = useInView<HTMLDivElement>()
	const svgRef = useRef<SVGSVGElement>(null)
	const reducedMotion = usePrefersReducedMotion()

	// The SVG animations run only while the diagram is on screen
	useEffect(() => {
		const svg = svgRef.current
		if (!svg) {
			return
		}

		if (inView && !reducedMotion) {
			svg.unpauseAnimations()
		} else {
			svg.pauseAnimations()
		}
	}, [inView, reducedMotion])

	return (
		<div ref={ref} data-paused={!inView || undefined}>
			<div className="relative aspect-800/360" role="img" aria-label={t("label")}>
				<svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 w-full h-full" aria-hidden="true">
					{clients.map(({ key, y }) => (
						<path key={key} d={clientPath(y)} fill="none" stroke="var(--border-strong)" strokeWidth="1.5" className="flow-line" />
					))}
					<path d={databasePath} fill="none" stroke="var(--border-strong)" strokeWidth="1.5" className="flow-line" />

					{!reducedMotion && clients.map(({ key, y }, index) => (
						<g key={key}>
							<Pulse path={clientPath(y)} color="var(--accent)" begin={index * 0.8} duration={1.6} />
							<Pulse path={clientPath(y)} color="var(--accent-2)" begin={index * 0.8 + 1.6} duration={1.6} reverse />
						</g>
					))}
					{!reducedMotion && (
						<>
							<Pulse path={databasePath} color="var(--faint)" begin={0.4} duration={1.2} />
							<Pulse path={databasePath} color="var(--faint)" begin={1.6} duration={1.2} reverse />
						</>
					)}
				</svg>

				{clients.map(({ key, icon: Icon, y }) => (
					<div
						key={key}
						className="absolute flex items-center gap-2 bg-surface rounded-lg border border-border sm:rounded-xl text-[0.7rem] text-muted sm:text-xs shadow-sm -translate-y-1/2 px-2 py-1.5 sm:px-3 sm:py-2"
						style={{ right: percent(width - clientEdge, width), top: percent(y, height) }}>
						<Icon className="text-accent size-3.5 sm:size-4" aria-hidden="true" />
						<span className="hidden sm:inline">
							{t(key)}
						</span>
					</div>
				))}

				<div
					className={clsx(
						"absolute flex flex-col items-center justify-center gap-1.5",
						"bg-surface",
						"border border-accent/40",
						"text-xs font-semibold sm:text-sm",
						"rounded-xl sm:rounded-3xl shadow-lg shadow-accent/10 -translate-y-1/2",
						"py-2.5 sm:py-5 md:py-6 w-36 h-36",
					)}
					style={{ left: percent(centerLeft, width), right: percent(width - centerRight, width), top: percent(middle, height) }}>
					<span className="absolute inset-0 rounded-[inherit] ring-1 ring-accent/40 node-pulse" aria-hidden="true" />
					<LogoMark className="size-6 sm:size-9" />
					<span>
						{"ErtisAuth"}
					</span>
				</div>

				<div
					className="absolute flex items-center gap-2 bg-surface rounded-lg border border-border sm:rounded-xl text-[0.7rem] text-muted sm:text-xs shadow-sm -translate-y-1/2 px-2 py-1.5 sm:px-3 sm:py-2"
					style={{ left: percent(databaseEdge, width), top: percent(middle, height) }}>
					<Database className="text-accent-2 size-3.5 sm:size-4" aria-hidden="true" />
					<span className="hidden sm:inline">
						{t("database")}
					</span>
				</div>
			</div>

			<div className="flex items-center justify-center gap-5 font-mono text-[0.7rem] text-faint mt-6" aria-hidden="true">
				<span className="inline-flex items-center gap-2">
					<span className="bg-accent rounded-full size-2" />
					{t("request")}
				</span>
				<span className="inline-flex items-center gap-2">
					<span className="bg-accent-2 rounded-full size-2" />
					{t("token")}
				</span>
			</div>
		</div>
	)
}
