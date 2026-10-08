import { Braces, Code2, ScanSearch } from "lucide-react"
import { CodeBlock } from "@/components/utils/code-window"
import { CodeTabs } from "@/components/utils/code-tabs"
import { NugetPackages } from "./nuget-packages"
import { Reveal } from "@/components/layout/reveal"
import { Section, SectionHeading } from "@/components/sections/section"
import { useTranslations } from "next-intl"

const points = [
	{ key: "attributes", icon: Code2 },
	{ key: "analyzer", icon: ScanSearch },
	{ key: "anyLanguage", icon: Braces },
] as const

const program = `using ErtisAuth.Sdk.AspNetCore.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddErtisAuth();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();`

const settings = `{
	"ErtisAuth": {
		"BaseUrl": "https://auth.example.com",
		"MembershipId": "<membership_id>"
	}
}`

function controller(comment: string) {
	return `[Authorized]
[RbacResource("orders")]
[Route("orders")]
public class OrdersController : ControllerBase
{
	[HttpGet("{id}")]
	[RbacObject("{id}")]
	[RbacAction(Rbac.CrudActions.Read)]
	public IActionResult Get(string id)
	{
		// ${comment}
		...
	}
}`
}

export function Developers() {
	const t = useTranslations("developers")
	const controllerCode = controller(t("comment"))

	const tabs = [
		{ id: "controller", label: t("tabs.controller"), code: controllerCode, language: "csharp" as const },
		{ id: "program", label: t("tabs.program"), code: program, language: "csharp" as const },
		{ id: "settings", label: t("tabs.settings"), code: settings, language: "json" as const },
	]

	return (
		<Section id="developers" className="bg-bg-subtle border-t border-border">
			<div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
				<Reveal>
					<SectionHeading align="left" eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
					<ul className="mt-10 space-y-6">
						{points.map(({ key, icon: Icon }) => (
							<li key={key} className="flex gap-4">
								<div className="flex shrink-0 items-center justify-center bg-surface rounded-lg border border-border text-accent size-8">
									<Icon className="size-4" aria-hidden="true" />
								</div>
								<p className="text-sm leading-relaxed text-muted">
									{t(`points.${key}`)}
								</p>
							</li>
						))}
					</ul>
				</Reveal>

				<Reveal className="min-w-0" delay={120}>
					<CodeTabs
						tabs={tabs.map((tab) => ({
							id: tab.id,
							label: tab.label,
							copy: tab.code,
							content: <CodeBlock code={tab.code} language={tab.language} />,
						}))} />
				</Reveal>
			</div>

			<NugetPackages />
		</Section>
	)
}
