"use client"

import clsx from "clsx"
import { useEffect, useState, type ReactNode } from "react"
import { Check, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useInView, usePrefersReducedMotion } from "@/lib/use-in-view"

type Effect = "allow" | "deny"
type Step = "ubac" | "role" | "self" | "scopes"

type Scenario = {
	method: string
	path: string
	segments: [string, string, string, string]
	// The step that decides the request, and the rule that matches there
	decidedBy: "ubac" | "role"
	rule: string
	effect: Effect
}

// The same editor role as on the rest of the page; the user has one permission of its own (UBAC)
const user = { id: "u-7", role: "editor", permissions: ["*.orders.read.*"] }
const role = { permissions: ["*.users.read.*", "*.roles.read.*", "*.users.update.*"], forbidden: ["*.users.delete.*"] }

const scenarios: Scenario[] = [
	{ method: "GET", path: "users/42", segments: ["u-7", "users", "read", "42"], decidedBy: "role", rule: "*.users.read.*", effect: "allow" },
	{ method: "DELETE", path: "users/42", segments: ["u-7", "users", "delete", "42"], decidedBy: "role", rule: "*.users.delete.*", effect: "deny" },
	{ method: "GET", path: "orders/9", segments: ["u-7", "orders", "read", "9"], decidedBy: "ubac", rule: "*.orders.read.*", effect: "allow" },
]

const steps: Step[] = ["ubac", "role", "self", "scopes"]

// The timeline of a scenario, in ticks: the four segments appear one by one, then the steps are checked, then the verdict
const tickMs = 450
const firstSegment = 1
const ubacTick = 5
const roleTick = 6
const lastTick = 14

const verdictTick = (scenario: Scenario) => (scenario.decidedBy === "ubac" ? roleTick : roleTick + 1)

type StepResult = "allows" | "denies" | "noMatch" | "notReached" | undefined

function stepResult(scenario: Scenario, step: Step, tick: number): StepResult {
	const decided = tick >= verdictTick(scenario)
	const effect = scenario.effect === "allow" ? "allows" : "denies"

	if (step === "ubac") {
		if (tick < ubacTick) {
			return undefined
		}
		return scenario.decidedBy === "ubac" ? effect : "noMatch"
	}

	if (step === "role" && scenario.decidedBy === "role") {
		return tick >= roleTick ? effect : undefined
	}

	return decided ? "notReached" : undefined
}

export function PermissionDemo() {
	const t = useTranslations("permissions")
	const [ref, inView] = useInView<HTMLDivElement>()
	const reducedMotion = usePrefersReducedMotion()
	const [state, setState] = useState({ index: 0, tick: 0 })
	const { index } = state

	// Without motion every scenario shows its final state
	const tick = reducedMotion ? lastTick : state.tick
	const scenario = scenarios[index]
	const decided = tick >= verdictTick(scenario)

	// Plays the scenarios one after the other while the demo is on screen
	useEffect(() => {
		if (!inView || reducedMotion) {
			return
		}

		const timer = setInterval(() => {
			setState((current) =>
				current.tick < lastTick
					? { index: current.index, tick: current.tick + 1 }
					: { index: (current.index + 1) % scenarios.length, tick: 0 })
		}, tickMs)

		return () => clearInterval(timer)
	}, [inView, reducedMotion])

	const select = (next: number) => setState({ index: next, tick: 0 })

	const isMatch = (rule: string, list: "user" | "role") =>
		decided && rule === scenario.rule && (list === "user") === (scenario.decidedBy === "ubac")

	return (
		<div ref={ref} className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14 mt-16">
			<div>
				<h3 className="text-lg font-semibold">
					{t("orderTitle")}
				</h3>
				<ol className="mt-6 space-y-3">
					{steps.map((step, position) => {
						const result = stepResult(scenario, step, tick)
						const checking = !reducedMotion && ((step === "ubac" && tick === ubacTick) || (step === "role" && tick === roleTick))

						return (
							<li
								key={step}
								className={clsx(
									"flex gap-4 rounded-xl border transition-colors duration-300 p-3",
									checking ? "border-accent/50 bg-accent-soft" : "border-transparent",
								)}>
								<span
									className={clsx(
										"flex shrink-0 items-center justify-center rounded-full border font-mono text-xs transition-colors duration-300 size-7",
										result === "allows" && "bg-allow-soft border-allow text-allow",
										result === "denies" && "bg-deny-soft border-deny text-deny",
										(result === undefined || result === "noMatch" || result === "notReached") && "bg-surface border-border text-muted",
									)}>
									{position + 1}
								</span>
								<div className="flex-1 min-w-0">
									<p className="text-sm leading-relaxed text-muted pt-0.5">
										{t(`order.${step}`)}
									</p>
									{result && (
										<p
											className={clsx(
												"row-in font-mono text-xs mt-1.5",
												result === "allows" && "text-allow",
												result === "denies" && "text-deny",
												(result === "noMatch" || result === "notReached") && "text-faint",
											)}>
											{t(`demo.${result}`)}
										</p>
									)}
								</div>
							</li>
						)
					})}
				</ol>
			</div>

			<div className="bg-surface rounded-2xl border border-border shadow-xl shadow-black/5 overflow-hidden dark:shadow-black/40">
				<div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
					<span className="font-mono text-[0.7rem] uppercase tracking-wider text-faint mr-1">
						{t("demo.scenarios")}
					</span>
					{scenarios.map((item, position) => (
						<button
							key={item.method + item.path}
							type="button"
							onClick={() => select(position)}
							aria-pressed={position === index}
							className={clsx(
								"rounded-full border focus-visible:outline-2 focus-visible:outline-accent font-mono text-[0.7rem] transition-colors px-2.5 py-1",
								position === index ? "bg-accent-soft border-accent/50 text-fg" : "border-border text-muted hover:text-fg",
							)}>
							{item.method} {item.path}
						</button>
					))}
				</div>

				<div className="space-y-6 p-5 sm:p-6">
					<div>
						<p className="font-mono text-[0.7rem] uppercase tracking-wider text-faint">
							{t("demo.request")}
						</p>
						<p className="font-mono text-sm mt-2">
							<span className="font-semibold text-accent">
								{scenario.method}
							</span>{" "}
							{scenario.path}
						</p>
						<p className="font-mono text-xs text-muted mt-1">
							{t("demo.user")}: {user.id} · {t("demo.role")}: {user.role}
						</p>
					</div>

					<div>
						<p className="font-mono text-[0.7rem] uppercase tracking-wider text-faint">
							{t("demo.required")}
						</p>
						<div className="flex flex-wrap items-center gap-y-2 font-mono text-sm mt-2">
							{scenario.segments.map((segment, position) => (
								<span key={position} className="flex items-center">
									{position > 0 && (
										<span className="text-faint px-1">
											.
										</span>
									)}
									<span
										className={clsx(
											"rounded-md border transition duration-300 px-2 py-1",
											tick >= firstSegment + position ? "opacity-100" : "opacity-0",
											tick === firstSegment + position ? "bg-accent-soft border-accent/50" : "bg-bg-subtle border-border",
										)}>
										{segment}
									</span>
								</span>
							))}
						</div>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<RuleList title={`${t("demo.userRules")} (${user.id})`}>
							{user.permissions.map((rule) => (
								<Rule key={rule} rule={rule} sign="+" match={isMatch(rule, "user") ? scenario.effect : undefined} />
							))}
						</RuleList>
						<RuleList title={`${t("demo.roleRules")} (${user.role})`}>
							{role.permissions.map((rule) => (
								<Rule key={rule} rule={rule} sign="+" match={isMatch(rule, "role") ? scenario.effect : undefined} />
							))}
							{role.forbidden.map((rule) => (
								<Rule key={rule} rule={rule} sign="−" match={isMatch(rule, "role") ? scenario.effect : undefined} />
							))}
						</RuleList>
					</div>
				</div>

				<div
					className={clsx(
						"flex items-center gap-2 border-t text-sm font-semibold transition-colors duration-300 px-5 py-3 sm:px-6",
						!decided && "border-border text-faint",
						decided && scenario.effect === "allow" && "bg-allow-soft border-allow/30 text-allow",
						decided && scenario.effect === "deny" && "bg-deny-soft border-deny/30 text-deny",
					)}
					aria-live="polite">
					{decided ? (
						<>
							{scenario.effect === "allow" ? <Check className="size-4" /> : <X className="size-4" />}
							{t(scenario.effect === "allow" ? "demo.allowed" : "demo.denied")}
						</>
					) : (
						<span className="font-mono text-xs font-normal">
							…
						</span>
					)}
				</div>
			</div>
		</div>
	)
}

function RuleList({ title, children }: { title: string, children: ReactNode }) {
	return (
		<div>
			<p className="font-mono text-[0.7rem] uppercase tracking-wider text-faint">
				{title}
			</p>
			<ul className="font-mono text-xs mt-2 space-y-1.5">
				{children}
			</ul>
		</div>
	)
}

function Rule({ rule, sign, match }: { rule: string, sign: "+" | "−", match?: Effect }) {
	return (
		<li
			className={clsx(
				"flex items-center gap-2 rounded-md border transition-colors duration-300 px-2 py-1",
				!match && "border-transparent text-muted",
				match === "allow" && "bg-allow-soft border-allow/40 text-allow",
				match === "deny" && "bg-deny-soft border-deny/40 text-deny",
			)}>
			<span className={sign === "+" ? "text-allow" : "text-deny"}>
				{sign}
			</span>
			{rule}
		</li>
	)
}
