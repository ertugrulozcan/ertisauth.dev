import { GitHubIcon } from "@/components/icons/github-icon"
import { LogoMark } from "@/components/icons/logo"
import { useLocale, useTranslations } from "next-intl"
import { links } from "@/lib/site"

export function Footer() {
	const t = useTranslations("footer")
	const locale = useLocale()
	const nav = useTranslations("nav")

	return (
		<footer className="border-t border-border px-4 py-10 sm:px-6">
			<div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between max-w-7xl mx-auto">
				<div className="flex flex-col sm:flex-row sm:items-center gap-x-5 gap-y-2">
					<span className="inline-flex items-center gap-2 font-semibold tracking-tight">
						<LogoMark className="size-6" />
						<span className="text-base pt-0.5">
							ErtisAuth
						</span>
					</span>
					<p className="text-xs text-faint pt-0.5">
						{t("tagline")}
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
					<a href={`/${locale}/docs/`} className="hover:text-fg">
						{nav("docs")}
					</a>
					<a href={links.license} className="hover:text-fg">
						{t("license")}
					</a>
					<a href={links.github} className="inline-flex items-center gap-1.5 hover:text-fg">
						<GitHubIcon className="size-4" />
						{nav("github")}
					</a>
					<span className="text-faint">
						{t("copyright")}
					</span>
				</div>
			</div>
		</footer>
	)
}
