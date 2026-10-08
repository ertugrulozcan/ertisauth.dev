"use client"

import clsx from "clsx"
import { useSyncExternalStore } from "react"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"

const options = [
	{ value: "light", icon: Sun },
	{ value: "dark", icon: Moon },
	{ value: "system", icon: Monitor },
] as const

// The selected theme is only known in the browser; before hydration no option is shown as selected
function useMounted() {
	return useSyncExternalStore(
		() => () => {},
		() => true,
		() => false,
	)
}

export function ThemeSwitcher() {
	const t = useTranslations("theme")
	const { theme, setTheme } = useTheme()
	const mounted = useMounted()

	return (
		<div
			role="radiogroup"
			aria-label={t("label")}
			className="inline-flex items-center gap-0.5 bg-surface rounded-full border border-border p-0.5">
			{options.map(({ value, icon: Icon }) => {
				const selected = mounted && theme === value

				return (
					<button
						key={value}
						type="button"
						role="radio"
						aria-checked={selected}
						aria-label={t(value)}
						title={t(value)}
						onClick={() => setTheme(value)}
						className={clsx(
							"inline-flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-accent transition-colors size-7 p-1",
							selected ? "bg-surface-2 text-fg" : "text-faint hover:text-fg",
						)}>
						<Icon className="size-3.5" />
					</button>
				)
			})}
		</div>
	)
}
