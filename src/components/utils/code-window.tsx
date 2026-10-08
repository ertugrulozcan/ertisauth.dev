import clsx from "clsx"
import type { ReactNode } from "react"
import { CopyButton } from "./copy-button"
import { copyText, highlight, type CodeLanguage } from "@/lib/highlight"

type Props = {
	title?: ReactNode
	code: string
	language: CodeLanguage
	className?: string
	copyable?: boolean
}

export function CodeWindow({ title, code, language, className, copyable = true }: Props) {
	return (
		<div
			className={clsx(
				"bg-code-bg rounded-xl border border-code-border text-code-fg overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/60",
				className,
			)}>
			<div className="flex items-center gap-3 bg-code-bar border-b border-code-border h-10 pl-4 pr-2">
				<div className="flex gap-1.5" aria-hidden="true">
					<span className="bg-red-500 rounded-full size-3" />
					<span className="bg-yellow-500 rounded-full size-3" />
					<span className="bg-green-500 rounded-full size-3" />
				</div>
				{title && (
					<div className="flex-1 truncate font-mono text-xs text-code-muted min-w-0">
						{title}
					</div>
				)}
				{copyable && (
					<div className="ml-auto">
						<CopyButton text={copyText(code, language)} />
					</div>
				)}
			</div>
			<CodeBlock code={code} language={language} />
		</div>
	)
}

export function CodeBlock({ code, language }: { code: string, language: CodeLanguage }) {
	return (
		<pre className="font-mono text-[0.8rem] leading-relaxed overflow-x-auto p-4 sm:p-5">
			<code>
				{highlight(code, language)}
			</code>
		</pre>
	)
}
