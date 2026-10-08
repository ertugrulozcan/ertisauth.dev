import clsx from "clsx"

type Props = {
	className?: string
}

export function LogoMark({ className }: Props) {
	return (
		<svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
			<defs>
				<linearGradient id="ertisauth-mark" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
					<stop stopColor="var(--accent)" />
					<stop offset="1" stopColor="var(--accent-2)" />
				</linearGradient>
			</defs>
			<path d="M16 2.5 27 6.6v8.3c0 7-4.6 12.6-11 14.6C9.6 27.5 5 21.9 5 14.9V6.6L16 2.5Z" fill="url(#ertisauth-mark)" />
			<circle cx="16" cy="13.2" r="3.4" fill="var(--bg)" />
			<path d="M14.6 15.6h2.8l.9 6.2h-4.6l.9-6.2Z" fill="var(--bg)" />
		</svg>
	)
}

export function Logo({ className }: Props) {
	return (
		<span className={clsx("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
			<LogoMark className="size-7" />
			<span className="text-[1.1rem]">
				ErtisAuth
			</span>
		</span>
	)
}
