"use client"

import clsx from "clsx"
import { ArrowRight, BookOpen } from "lucide-react"
import { GitHubIcon } from "@/components/icons/github-icon"
import { Reveal } from "@/components/layout/reveal"
import { FlowDiagram } from "./flow-diagram"
import { useLocale, useTranslations } from "next-intl"
import { links } from "@/lib/site"

export function Hero() {
	const t = useTranslations("hero")
	const locale = useLocale()

	return (
		<section id="top" className="relative overflow-hidden px-5 pt-24 pb-20 sm:px-6 sm:pt-32 sm:pb-28">
			<div className="absolute inset-0 hero-grid pointer-events-none -z-10" aria-hidden="true" />
			<div className="absolute inset-0 hero-glow pointer-events-none -z-10" aria-hidden="true" />

			<div className="max-w-6xl 2xl:max-w-7xl mx-auto">
				<div className="text-center max-w-3xl mx-auto">
					<a
						href={links.github}
						className="inline-flex items-center gap-2 bg-surface/70 rounded-full border border-border-strong hover:border-neutral-300 dark:hover:border-neutral-600 font-mono text-xs text-muted hover:text-fg backdrop-blur transition-colors px-3 py-1">
						<span className="bg-accent rounded-full size-1.5" aria-hidden="true" />
						{t("badge")}
					</a>
					
					<h1 className="text-4xl font-semibold tracking-tight text-center text-balance sm:text-6xl sm:leading-[1.1] mt-7">
						{t("title")}{" "}
					</h1>

					<div className="font-semibold tracking-tight text-center mt-6 px-4 sm:px-0">
						<span className="text-gradient text-2xl sm:text-3xl">
							{t("subtitle")}
						</span>
						<span className="caret text-accent-2 text-3xl ml-1">{"_"}</span>
					</div>

					<p className="text-base leading-relaxed text-pretty text-muted sm:text-lg max-w-2xl mx-auto mt-7">
						{t("description")}
					</p>

					<div className="flex flex-col items-center justify-center gap-x-3 gap-y-5 sm:flex-row mt-9 sm:mt-12">
						<a
							href="#get-started"
							className={clsx(
								"inline-flex items-center gap-2",
								"bg-fg",
								"rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
								"text-base sm:text-sm font-medium text-bg",
								"group transition-opacity hover:opacity-90",
								"h-12 sm:h-11 px-7 sm:px-6",
							)}>
							{t("primary")}
							<ArrowRight className="transition-transform group-hover:translate-x-0.5 size-4" />
						</a>
						<a
							href={links.github}
							className={clsx(
								"inline-flex items-center gap-2",
								"bg-surface",
								"rounded-full border border-border hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
								"text-base sm:text-sm font-medium",
								"transition-colors",
								"h-12 sm:h-11 px-7 sm:px-6",
							)}>
							<GitHubIcon className="size-4" />
							{t("secondary")}
						</a>
						<a
							href={`/${locale}/docs/`}
							className={clsx(
								"inline-flex items-center gap-2",
								"bg-bg",
								"rounded-full border border-border hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
								"text-base sm:text-sm font-medium",
								"transition-colors",
								"h-12 sm:h-11 px-7 sm:px-6",
							)}>
							<BookOpen className="size-4" />
							{t("documentation")}
						</a>
					</div>
				</div>

				<div className="relative max-w-3xl mx-auto mt-16">
					<div
						className="absolute -inset-px bg-linear-to-b from-accent/40 via-accent-2/10 to-transparent rounded-2xl blur-2xl -z-10"
						aria-hidden="true" 
					/>

					<Reveal className="bg-surface/80 rounded-2xl border border-border backdrop-blur shadow-2xl shadow-black/5 dark:shadow-black/60 py-5 sm:px-8 sm:py-8" delay={100}>
						<FlowDiagram />
					</Reveal>
				</div>
			</div>
		</section>
	)
}
