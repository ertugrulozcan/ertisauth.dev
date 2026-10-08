import { Fragment } from "react"
import { ArrowUpRight, Package } from "lucide-react"
import { CopyButton } from "@/components/utils/copy-button"
import { Reveal } from "@/components/layout/reveal"
import { useTranslations } from "next-intl"
import { packages } from "@/lib/site"

export function NugetPackages() {
	const t = useTranslations("developers.packages")

	return (
		<div className="mt-16">
			<h3 className="text-lg font-semibold">
				{t("title")}
			</h3>
			<div className="grid gap-4 md:grid-cols-2 mt-6">
				{packages.map(({ name, version, url, description }, index) => {
					const command = `dotnet add package ${name}`

					return (
						<Reveal key={name} delay={index * 100}>
							<article className="flex flex-col bg-surface rounded-2xl border border-border h-full p-5 sm:p-6">
								<div className="flex items-center gap-3">
									<div className="inline-flex shrink-0 items-center justify-center bg-accent-soft rounded-lg text-accent size-9">
										<Package className="size-[1.15rem]" aria-hidden="true" />
									</div>
									<div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
										<span className="font-mono text-sm font-semibold">
											{/* A long name may wrap after a dot, never inside a word */}
											{name.split(".").map((part, position) => (
												<Fragment key={position}>
													{position > 0 && (
														<>
															.
															<wbr />
														</>
													)}
													{part}
												</Fragment>
											))}
										</span>
										<span className="rounded-full border border-border font-mono text-[0.7rem] text-muted px-2 py-0.5">
											<span className="sr-only">
												{t("version")}{" "}
											</span>
											v{version}
										</span>
									</div>
									<a
										href={url}
										className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent hover:underline hover:underline-offset-4 ml-auto">
										{t("nuget")}
										<ArrowUpRight className="size-4" aria-hidden="true" />
									</a>
								</div>
								<p className="flex-1 text-sm leading-relaxed text-muted mt-3">
									{t(description)}
								</p>
								<div className="flex items-center gap-2 bg-code-bg rounded-lg border border-code-border font-mono text-xs text-code-fg min-w-0 mt-4 pl-3 pr-1 py-1">
									<span className="text-code-muted" aria-hidden="true">
										$
									</span>
									<code className="flex-1 whitespace-nowrap overflow-x-auto py-1.5">
										{command}
									</code>
									<CopyButton text={command} />
								</div>
							</article>
						</Reveal>
					)
				})}
			</div>
		</div>
	)
}
