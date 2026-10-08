"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { useTranslations } from "next-intl"

export function CopyButton({ text }: { text: string }) {
	const t = useTranslations("code")
	const [copied, setCopied] = useState(false)

	async function copy() {
		try {
			await navigator.clipboard.writeText(text)
			setCopied(true)
			setTimeout(() => setCopied(false), 1600)
		} catch {
			// The clipboard isn't available (e.g. an insecure context); the code can still be selected by hand
		}
	}

	return (
		<button
			type="button"
			onClick={copy}
			aria-label={copied ? t("copied") : t("copy")}
			title={copied ? t("copied") : t("copy")}
			className="inline-flex items-center justify-center hover:bg-white/5 rounded-md focus-visible:outline-2 focus-visible:outline-accent text-code-muted hover:text-code-fg transition-colors size-7">
			{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
		</button>
	)
}
