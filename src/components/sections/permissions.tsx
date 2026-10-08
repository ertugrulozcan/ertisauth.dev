import { Section, SectionHeading } from "@/components/sections/section"
import { Reveal } from "@/components/layout/reveal"
import { PermissionDemo } from "./permission-demo"
import { useTranslations } from "next-intl"

const segments = [
	{ key: "subject", value: "*" },
	{ key: "resource", value: "orders" },
	{ key: "action", value: "read" },
	{ key: "object", value: "{id}" },
] as const

export function Permissions() {
	const t = useTranslations("permissions")

	return (
		<Section id="permissions" className="bg-bg-subtle border-t border-border">
			<SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

			<Reveal className="max-w-4xl mx-auto mt-11">
				<div className="flex flex-wrap items-center justify-center gap-y-2 font-mono text-2xl sm:text-4xl">
					{/* The boxes below are visual only; screen readers read the expression in one piece */}
					<span className="sr-only">
						*.orders.read.{"{id}"}
					</span>
					{segments.map(({ key, value }, index) => (
						<span key={key} className="flex items-center" aria-hidden="true">
							{index > 0 && (
								<span className="text-faint px-1 sm:px-2">
									.
								</span>
							)}
							<span className="bg-surface rounded-lg border border-border text-fg text-base sm:text-xl px-3 py-1.5 sm:px-4 sm:py-2">
								{value}
							</span>
						</span>
					))}
				</div>

				<dl className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 bg-border rounded-2xl border border-border overflow-hidden mt-14">
					{segments.map(({ key }) => (
						<div key={key} className="bg-surface p-5">
							<dt className="font-mono text-xs font-medium text-accent">
								{key}
							</dt>
							<dd className="text-sm leading-relaxed text-muted mt-2">
								{t(`segments.${key}`)}
							</dd>
						</div>
					))}
				</dl>
			</Reveal>

			<Reveal>
				<PermissionDemo />
			</Reveal>
		</Section>
	)
}
