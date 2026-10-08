import { ArrowUpRight } from "lucide-react"
import { CodeWindow } from "@/components/utils/code-window"
import { Section, SectionHeading } from "@/components/sections/section"
import { Reveal } from "@/components/layout/reveal"
import { useLocale, useTranslations } from "next-intl"
import { docHref } from "@/docs/paths"

const steps = [
	{
		key: "run",
		code: `$ git clone https://github.com/ertugrulozcan/ErtisAuth.git
$ cd ErtisAuth
$ docker compose up -d --build`,
	},
	{
		key: "setup",
		code: `$ openssl rand -hex 32
$ docker compose exec mongo mongosh auth \\
	--eval 'db.setup.insertOne({ token: "<setup_token>" })'
$ curl -X POST http://localhost:9716/setup \\
	-H 'X-Setup-Token: <setup_token>' \\
	-H 'Content-Type: application/json' \\
	-d '{ "membership": { … }, "user": { … } }'`,
	},
	{
		key: "token",
		code: `$ curl -X POST http://localhost:9716/generate-token \\
	-H 'X-Ertis-Alias: <membership_id>' \\
	-H 'Content-Type: application/json' \\
	-d '{ "username": "admin", "password": "<password>" }'`,
	},
] as const

export function GetStarted() {
	const t = useTranslations("start")
	const locale = useLocale()

	return (
		<Section id="get-started" className="bg-bg-subtle border-t border-border">
			<SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

			<ol className="max-w-4xl mx-auto mt-14 space-y-10">
				{steps.map(({ key, code }, index) => (
					<li key={key}>
						<Reveal className="grid gap-5 md:grid-cols-[14rem_1fr] md:gap-8">
							<div className="flex gap-4 md:block">
								<span className="flex shrink-0 items-center justify-center bg-accent rounded-full font-mono text-sm font-medium text-accent-fg size-8">
									{index + 1}
								</span>
								<div className="md:mt-4">
									<h3 className="font-semibold">
										{t(`steps.${key}.title`)}
									</h3>
									<p className="text-sm leading-relaxed text-muted mt-1.5">
										{t(`steps.${key}.text`)}
									</p>
								</div>
							</div>
							<CodeWindow code={code} language="shell" className="min-w-0" />
						</Reveal>
					</li>
				))}
			</ol>

			<div className="text-center mt-20">
				<a
					href={docHref(locale, "getting-started")}
					className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline hover:underline-offset-4">
					{t("guide")}
					<ArrowUpRight className="size-4" />
				</a>
			</div>
		</Section>
	)
}
