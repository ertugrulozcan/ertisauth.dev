import clsx from "clsx"
import { BookOpen } from "lucide-react"
import { GitHubIcon } from "@/components/icons/github-icon"
import { LogoMark } from "@/components/icons/logo"
import { Reveal } from "@/components/layout/reveal"
import { useLocale, useTranslations } from "next-intl"
import { links } from "@/lib/site"

export function Cta() {
	const t = useTranslations("cta")
	const locale = useLocale()

	return (
		<section className="px-4 py-24 sm:px-6">
			<Reveal className="relative bg-surface rounded-3xl border border-border text-center overflow-hidden max-w-6xl 2xl:max-w-7xl mx-auto px-6 py-16 sm:px-12 sm:py-20">
				<div className="absolute inset-0 hero-glow pointer-events-none" aria-hidden="true" />
				<div className="relative">
					<LogoMark className="size-12 mx-auto" />
					<h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl mt-6">
						{t("title")}
					</h2>
					<p className="text-base leading-relaxed text-pretty text-muted max-w-xl mx-auto mt-4">
						{t("description")}
					</p>
					<div className="flex flex-col items-center justify-center gap-3 sm:flex-row mt-9">
						<a
							href={links.github}
							className={clsx(
								"inline-flex items-center gap-2",
								"bg-fg",
								"rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
								"text-sm font-medium text-bg",
								"transition-opacity hover:opacity-90",
								"h-11 px-6",
							)}>
							<GitHubIcon className="size-4" />
							{t("primary")}
						</a>
						<a
							href={`/${locale}/docs/`}
							className={clsx(
								"inline-flex items-center gap-2",
								"bg-bg",
								"rounded-full border border-border hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
								"text-sm font-medium",
								"transition-colors",
								"h-11 px-6",
							)}>
							<BookOpen className="size-4" />
							{t("secondary")}
						</a>
					</div>
				</div>
			</Reveal>
		</section>
	)
}
