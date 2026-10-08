import { ArrowUpRight, Check, Database, KeyRound, Layers, LockKeyhole, type LucideIcon, ShieldAlert } from "lucide-react"
import { Reveal } from "@/components/layout/reveal"
import { Section, SectionHeading } from "@/components/sections/section"
import { useLocale, useMessages, useTranslations } from "next-intl"
import { docHref } from "@/docs/paths"
import { links } from "@/lib/site"

const groups: { key: "authentication" | "isolation" | "data" | "codes", icon: LucideIcon }[] = [
	{ key: "authentication", icon: LockKeyhole },
	{ key: "isolation", icon: Layers },
	{ key: "data", icon: Database },
	{ key: "codes", icon: KeyRound },
]

export function Security() {
	const t = useTranslations("security")
	const messages = useMessages()
	const locale = useLocale()

	return (
		<Section id="security" className="border-t border-border">
			<SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

			<div className="grid gap-4 md:grid-cols-2 mt-14">
				{groups.map(({ key, icon: Icon }, index) => (
					<Reveal key={key} delay={(index % 2) * 100}>
						<article className="bg-surface rounded-2xl border border-border h-full p-6 sm:p-7">
							<div className="flex items-center gap-3">
								<div className="inline-flex items-center justify-center bg-accent-soft rounded-lg text-accent size-9">
									<Icon className="size-[1.15rem]" aria-hidden="true" />
								</div>
								<h3 className="font-semibold">
									{t(`groups.${key}.title`)}
								</h3>
							</div>
							<ul className="mt-5 space-y-3">
								{/* The items of a group in the order of the message file; they are plain text without placeholders */}
								{Object.entries(messages.security.groups[key].items).map(([item, text]) => (
									<li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
										<Check className="shrink-0 text-allow size-4 mt-0.5" aria-hidden="true" />
										{text}
									</li>
								))}
							</ul>
						</article>
					</Reveal>
				))}
			</div>

			<Reveal>
				<div className="flex flex-col gap-4 rounded-2xl border border-dashed border-border-strong mt-4 p-6 sm:p-7">
					<div>
						<h3 className="font-semibold">
							{t("yourPart.title")}
						</h3>
						<p className="text-sm leading-relaxed text-muted mt-1.5">
							{t("yourPart.text")}
						</p>
					</div>
					<div className="flex flex-wrap items-center gap-x-6 gap-y-2 shrink-0 text-sm font-medium">
						<a href={docHref(locale, "operations", "security-checklist")} className="inline-flex items-center gap-1.5 text-accent hover:underline hover:underline-offset-4">
							{t("yourPart.guide")}
							<ArrowUpRight className="size-4" />
						</a>
						<a href={links.securityPolicy} className="inline-flex items-center gap-1.5 text-accent hover:underline hover:underline-offset-4">
							<ShieldAlert className="size-4" />
							{t("report")}
						</a>
					</div>
				</div>
			</Reveal>
		</Section>
	)
}
