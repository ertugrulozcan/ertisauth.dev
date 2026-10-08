import clsx from "clsx"
import type { ReactNode } from "react"
import { Section, SectionHeading } from "@/components/sections/section"
import { Reveal } from "@/components/layout/reveal"
import { DeviceVisual, EventVisual, TokenVisual, ProvidersVisual, HashAlgorithmsVisual } from "./feature-visuals"
import { useTranslations } from "next-intl"

import {
	type LucideIcon,
	Activity,
	Building2,
	KeyRound,
	LockKeyhole,
	MonitorSmartphone,
	ShieldCheck,
	UserCog,
	UserRoundCheck,
	Users,
	Webhook,
} from "lucide-react"

type FeatureKey =
	| "tokens"
	| "memberships"
	| "permissions"
	| "providers"
	| "userTypes"
	| "devices"
	| "lifecycle"
	| "passwords"
	| "events"
	| "operations"

const features: { key: FeatureKey, icon: LucideIcon, wide?: boolean }[] = [
	{ key: "tokens", icon: KeyRound, wide: true },
	{ key: "memberships", icon: Building2 },
	{ key: "permissions", icon: ShieldCheck },
	{ key: "providers", icon: UserRoundCheck },
	{ key: "userTypes", icon: UserCog },
	{ key: "devices", icon: MonitorSmartphone },
	{ key: "lifecycle", icon: Users },
	{ key: "passwords", icon: LockKeyhole },
	{ key: "events", icon: Webhook, wide: true },
	{ key: "operations", icon: Activity },
]

const visuals: Partial<Record<FeatureKey, ReactNode>> = {
	tokens: <TokenVisual />,
	providers: <ProvidersVisual />,
	devices: <DeviceVisual />,
	events: <EventVisual />,
	passwords: <HashAlgorithmsVisual />
}

export function Features() {
	const t = useTranslations("features")

	return (
		<Section id="features">
			<SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

			<div className="grid grid-flow-row-dense gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-14">
				{features.map(({ key, icon: Icon, wide }, index) => (
					<Reveal key={key} className={clsx(wide && "sm:col-span-2")} delay={(index % 3) * 80}>
						<article className="bg-surface rounded-2xl border border-border hover:border-border-strong transition-colors h-full p-6">
							<div className="inline-flex items-center justify-center bg-accent-soft rounded-lg text-accent size-9">
								<Icon className="size-[1.15rem]" aria-hidden="true" />
							</div>
							<h3 className="font-semibold mt-5">
								{t(`items.${key}.title`)}
							</h3>
							<p className="text-sm leading-relaxed text-muted mt-2">
								{t(`items.${key}.text`)}
							</p>
							{visuals[key]}
						</article>
					</Reveal>
				))}
			</div>
		</Section>
	)
}
