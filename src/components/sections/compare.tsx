import { Section, SectionHeading } from "@/components/sections/section"
import { Reveal } from "@/components/layout/reveal"
import { useTranslations } from "next-intl"

const items = ["keycloak", "hosted", "duende", "identity"] as const

export function Compare() {
	const t = useTranslations("compare")

	return (
		<Section id="compare" className="border-t border-border">
			<SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

			<div className="grid gap-4 md:grid-cols-2 mt-14">
				{items.map((key, index) => (
					<Reveal key={key} delay={(index % 2) * 100}>
						<article className="bg-surface rounded-2xl border border-border h-full p-6 sm:p-7">
							<h3 className="font-semibold">
								<span className="text-accent mr-0.5">
									VS{" "}
								</span>
								{t(`items.${key}.name`)}
							</h3>
							<p className="text-sm leading-relaxed text-muted mt-3">
								{t(`items.${key}.text`)}
							</p>
						</article>
					</Reveal>
				))}
			</div>
		</Section>
	)
}
