"use client"

import Image from "next/image"
import { Fragment, useEffect, useState } from "react"
import { Check, Smartphone, Tv } from "lucide-react"
import { useTranslations } from "next-intl"
import { useInView, usePrefersReducedMotion } from "@/lib/use-in-view"

const tokens = [
	["bearer", "JWT"],
	["basic", "app_id:secret"],
	["refresh", "single-use"],
	["scoped", "users.read"],
]

// The token endpoints of ErtisAuth, in the order of a session's life
const lifecycle = ["generate-token", "refresh-token", "revoke-token"]

export function TokenVisual() {
	const [ref, inView] = useInView<HTMLDivElement>()

	return (
		<div ref={ref} data-paused={!inView || undefined}>
			<div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mt-6">
				{tokens.map(([name, detail]) => (
					<div key={name} className="bg-bg-subtle rounded-lg border border-border px-3 py-2.5">
						<div className="font-mono text-xs font-medium text-fg">
							{name}
						</div>
						<div className="truncate font-mono text-[0.7rem] text-faint mt-0.5">
							{detail}
						</div>
					</div>
				))}
			</div>
			<div className="flex items-center gap-2 mt-3">
				{lifecycle.map((endpoint, index) => (
					<Fragment key={endpoint}>
						{index > 0 && (
							<span className="text-faint" aria-hidden="true">
								→
							</span>
						)}
						<span
							className="flex-1 rounded-md border border-border truncate text-center font-mono text-[0.7rem] text-faint lifecycle-step min-w-0 px-2 py-1.5"
							style={{ animationDelay: `${index * 1.5}s` }}>
							{endpoint}
						</span>
					</Fragment>
				))}
			</div>
		</div>
	)
}

const providers = [
	{
		name: "Google", 
		slug: "google", 
		icon: "google"
	}, 
	{
		name: "Facebook", 
		slug: "facebook", 
		icon: "facebook"
	}, 
	{
		name: "Facebook (limited)", 
		slug: "facebook-limited", 
		icon: "facebook"
	}, 
	{
		name: "Apple", 
		slug: "apple", 
		icon: "apple"
	}, 
	{
		name: "Apple (native)", 
		slug: "apple-native", 
		icon: "apple"
	}, 
	{
		name: "Microsoft", 
		slug: "microsoft", 
		icon: "microsoft"
	}
]

export function ProvidersVisual() {
	const [ref, inView] = useInView<HTMLDivElement>()

	return (
		<div ref={ref} data-paused={!inView || undefined}>
			<div className="flex flex-wrap gap-2 mt-4">
				{providers.map((provider) => (
					<div key={provider.slug} className="flex items-center gap-x-2 bg-bg-subtle rounded-lg border border-border overflow-hidden pl-2 pr-2.5 py-1.5">
						{/* Decorative: the name of the provider follows as text */}
						<Image src={`/providers/${provider.icon}.svg`} alt={provider.name} width={14} height={14} className="size-3.5 object-contain" loading="lazy" />
						<div className="font-mono text-xs font-medium text-fg">
							{provider.name}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

const events = [
	["UserCreated", "webhook", "200"],
	["UserCreated", "mail hook", "sent"],
	["TokenGenerated", "webhook", "200"],
	["UserUpdated", "webhook", "200"],
	["UserPasswordChanged", "mail hook", "sent"],
	["TokenRevoked", "webhook", "200"],
]

const visibleEvents = 3

export function EventVisual() {
	const [ref, inView] = useInView<HTMLDivElement>()
	const reducedMotion = usePrefersReducedMotion()
	// The number of events received so far; the newest ones are shown, the newest on top
	const [count, setCount] = useState(visibleEvents)

	useEffect(() => {
		if (!inView || reducedMotion) {
			return
		}

		const timer = setInterval(() => setCount((value) => value + 1), 1600)
		return () => clearInterval(timer)
	}, [inView, reducedMotion])

	const rows = Array.from({ length: visibleEvents }, (_, offset) => count - 1 - offset)

	return (
		<div ref={ref} className="bg-bg-subtle divide-y divide-border rounded-lg border border-border font-mono text-xs overflow-hidden mt-6">
			{rows.map((sequence) => {
				const [event, target, status] = events[sequence % events.length]

				return (
					// The key is the sequence number: a new event mounts a new row, which plays the row-in animation
					<div key={sequence} className="row-in flex items-center gap-3 px-3 py-2.5">
						<span className="shrink-0 bg-accent-2 rounded-full size-1.5" aria-hidden="true" />
						<span className="truncate text-fg">
							{event}
						</span>
						<span className="text-faint">
							→
						</span>
						<span className="truncate text-muted">
							{target}
						</span>
						<span className="text-faint ml-auto">
							{status}
						</span>
					</div>
				)
			})}
		</div>
	)
}

// A user code as ErtisAuth generates it: letters and digits without 0, O, 1 and I
const userCode = "K7QF-X2MP"

export function DeviceVisual() {
	const t = useTranslations("features.device")
	const [ref, inView] = useInView<HTMLDivElement>()

	return (
		<div ref={ref} className="flex items-stretch gap-3 font-mono text-[0.7rem] mt-6" data-paused={!inView || undefined}>
			<div className="relative flex flex-[1.6] flex-col items-center justify-center bg-bg-subtle rounded-lg border border-border h-24">
				<Tv className="absolute top-2 left-2 text-faint size-3.5" aria-hidden="true" />
				<div className="absolute inset-0 flex items-center justify-center text-sm font-semibold tracking-widest device-before">
					{userCode}
				</div>
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-allow device-after">
					<Check className="size-5" aria-hidden="true" />
					{t("signedIn")}
				</div>
			</div>
			<div className="relative flex flex-1 flex-col items-center justify-center bg-bg-subtle rounded-lg border border-border h-24">
				<Smartphone className="absolute top-2 left-2 text-faint size-3.5" aria-hidden="true" />
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 device-before">
					<span className="text-muted">
						{userCode}
					</span>
					<span className="bg-accent rounded-md text-accent-fg device-tap px-2.5 py-1">
						{t("approve")}
					</span>
				</div>
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-allow device-after">
					<Check className="size-5" aria-hidden="true" />
					{t("approved")}
				</div>
			</div>
		</div>
	)
}

const hashAlgorithms = [
	"MD5", 
	"SHA1", 
	"SHA2_224", 
	"SHA2_256", 
	"SHA2_384", 
	"SHA2_512", 
	"SHA2_512_224", 
	"SHA2_512_256", 
	"SHA3_224", 
	"SHA3_256", 
	"SHA3_384", 
	"SHA3_512", 
	"ARGON2ID", 
	"PBKDF2_SHA256", 
	"PBKDF2_SHA512"
]

export function HashAlgorithmsVisual() {
	const t = useTranslations("features.passwords")
	const [ref, inView] = useInView<HTMLDivElement>()

	return (
		<div ref={ref} data-paused={!inView || undefined} className="mt-3">
			<span className="text-muted text-xs">
				{`${t("supported-algorithms")};`}
			</span>
			<div className="flex flex-wrap gap-x-1.5 gap-y-1 mt-2">
				{hashAlgorithms.map((algorithm) => (
					<div key={algorithm} className="flex items-center gap-x-2 bg-bg-subtle rounded-lg border border-border overflow-hidden px-2 py-1 -ml-1">
						<div className="font-mono text-xs font-medium text-fg">
							{algorithm}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}