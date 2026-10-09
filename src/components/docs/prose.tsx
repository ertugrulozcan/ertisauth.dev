import Link from "next/link"
import clsx from "clsx"
import type { ReactNode } from "react"
import { Info, TriangleAlert } from "lucide-react"
import { CopyButton } from "@/components/utils/copy-button"
import type { DocSlug } from "@/docs/registry"
import { docHref } from "@/docs/paths"
import { useLocale, useTranslations } from "next-intl"
import { copyText, highlight, type CodeLanguage } from "@/lib/highlight"

// The building blocks of a documentation page. Plain elements (p, ul, ol, table, code, strong) are styled by the
// docs-prose class of the article; these components cover what plain elements can't.

type HeadingProps = {
	// The anchor of the heading: English and the same in every language, so links between pages keep working
	id: string
	children: ReactNode
}

function Anchor({ id }: { id: string }) {
	const t = useTranslations("docs")

	return (
		<a
			href={`#${id}`}
			aria-label={t("anchor")}
			className="text-faint opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 ml-2">
			#
		</a>
	)
}

export function H2({ id, children }: HeadingProps) {
	return (
		<h2 id={id} className="group">
			{children}
			<Anchor id={id} />
		</h2>
	)
}

export function H3({ id, children }: HeadingProps) {
	return (
		<h3 id={id} className="group">
			{children}
			<Anchor id={id} />
		</h3>
	)
}

type CodeProps = {
	language: CodeLanguage
	code: string
	title?: string
}

export function Code({ language, code, title }: CodeProps) {
	return (
		<div className="bg-code-bg rounded-xl border border-code-border text-code-fg overflow-hidden my-6">
			<div className="flex items-center gap-3 bg-code-bar border-b border-code-border h-9 pl-4 pr-2">
				<span className="flex-1 truncate font-mono text-xs text-code-fg">
					{title ?? language}
				</span>
				<CopyButton text={copyText(code, language)} />
			</div>
			<pre className="font-mono text-[0.8rem] leading-relaxed overflow-x-auto p-4">
				<code className="bg-code-bg! border-code-bg!">
					{highlight(code, language)}
				</code>
			</pre>
		</div>
	)
}

export function Callout({ type = "note", children }: { type?: "note" | "warning", children: ReactNode }) {
	const t = useTranslations("docs")
	const Icon = type === "warning" ? TriangleAlert : Info

	return (
		<div
			className={clsx(
				"flex gap-3 rounded-xl border text-sm leading-relaxed my-6 p-4",
				type === "note" && "bg-accent-soft border-accent/30",
				type === "warning" && "bg-deny-soft border-deny/30",
			)}>
			<Icon className={clsx("shrink-0 size-4 mt-0.5", type === "note" ? "text-accent" : "text-deny")} aria-hidden="true" />
			<div className="docs-prose-inline min-w-0">
				<strong className="font-semibold">
					{t(type)}:
				</strong>{" "}
				{children}
			</div>
		</div>
	)
}

const methodColors: Record<string, string> = {
	GET: "text-allow",
	POST: "text-accent",
	PUT: "text-accent-2",
	PATCH: "text-accent-2",
	DELETE: "text-deny",
}

export function Endpoint({ method, path }: { method: string, path: string }) {
	return (
		<div className="flex flex-wrap items-center gap-x-3 gap-y-1 bg-surface rounded-lg border border-border font-mono text-sm my-4 px-4 py-2.5">
			<span className={clsx("font-semibold", methodColors[method] ?? "text-fg")}>
				{method}
			</span>
			<span className="break-all text-fg">
				{path}
			</span>
		</div>
	)
}

// A link to another page of the documentation (the overview without a page)
export function DocLink({ to, hash, children }: { to?: DocSlug, hash?: string, children: ReactNode }) {
	const locale = useLocale()

	return (
		<Link href={docHref(locale, to, hash)}>
			{children}
		</Link>
	)
}

type TableProps = {
	// Either the header cells and the rows as data, which keeps long reference tables short...
	head?: ReactNode[]
	rows?: ReactNode[][]
	// ...or thead/tbody/tr/th/td written as plain elements
	children?: ReactNode
	className?: string
}

// A table that scrolls horizontally on narrow screens
export function Table({ head, rows, children, className }: TableProps) {
	return (
		<div className={`docs-table ${className || ""}`}>
			<table>
				{head && (
					<thead>
						<tr>
							{head.map((cell, index) => (
								<th key={index} className="min-w-40">
									{cell}
								</th>
							))}
						</tr>
					</thead>
				)}
				{rows && (
					<tbody>
						{rows.map((row, rowIndex) => (
							<tr key={rowIndex}>
								{row.map((cell, cellIndex) => (
									<td key={cellIndex}>
										{cell}
									</td>
								))}
							</tr>
						))}
					</tbody>
				)}
				{children}
			</table>
		</div>
	)
}
