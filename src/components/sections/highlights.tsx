import { Feather, Globe, Layers, Scale } from "lucide-react"
import { Reveal } from "@/components/layout/reveal"
import { useTranslations } from "next-intl"

const items = [
	{ key: "lightweight", icon: Feather },
	{ key: "apiFirst", icon: Globe },
	{ key: "multiTenant", icon: Layers },
	{ key: "open", icon: Scale },
] as const

export function Highlights() {
	const t = useTranslations("highlights")

	return (
		<section className="bg-bg-subtle border-y border-border">
			{/* The 1px gaps over the border-colored background draw the dividers between the cells */}
			<div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
				{items.map(({ key, icon: Icon }, index) => (
					<Reveal key={key} className="px-8 py-8 sm:px-6" delay={index * 80}>
						<Icon className="text-accent size-5" aria-hidden="true" />
						<h2 className="text-sm font-semibold mt-4">
							{t(`${key}.title`)}
						</h2>
						<p className="text-sm leading-relaxed text-muted mt-1.5">
							{t(`${key}.text`)}
						</p>
					</Reveal>
				))}
			</div>
		</section>
	)
}
