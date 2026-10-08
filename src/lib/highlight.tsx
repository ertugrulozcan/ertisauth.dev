import type { ReactNode } from "react"

export type CodeLanguage = "shell" | "json" | "csharp" | "http" | "javascript" | "yaml" | "text"

type Rule = [RegExp, string]

// A small build-time highlighter for the snippets of the site; good enough for display, not a full parser
const rules: Record<CodeLanguage, Rule[]> = {
	shell: [
		[/#.*$/, "tok-comment"],
		[/'[^']*'|"[^"]*"/, "tok-string"],
		[/(?<=^|\s)-{1,2}[A-Za-z-]+/, "tok-attr"],
		[/\b(curl|docker|compose|openssl|git|dotnet|db\.setup\.insertOne)\b/, "tok-keyword"],
	],
	json: [
		[/"(?:[^"\\]|\\.)*"(?=\s*:)/, "tok-type"],
		[/"(?:[^"\\]|\\.)*"/, "tok-string"],
		[/\b-?\d+(\.\d+)?\b/, "tok-number"],
		[/\b(true|false|null)\b/, "tok-keyword"],
	],
	csharp: [
		[/\/\/.*$/, "tok-comment"],
		[/"(?:[^"\\]|\\.)*"/, "tok-string"],
		[/\[[A-Za-z]+(?=[(\]])/, "tok-attr"],
		[/\b(public|class|var|return|string|new|async|await|using|private|readonly|static)\b/, "tok-keyword"],
		[/\b[A-Z][A-Za-z0-9]*\b/, "tok-type"],
	],
	// A request line (GET /path HTTP/1.1) and header lines (Name: value)
	http: [
		[/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)(?= )/, "tok-keyword"],
		[/HTTP\/\d(\.\d)?/, "tok-comment"],
		[/^[A-Za-z][A-Za-z0-9-]*(?=:)/, "tok-type"],
	],
	javascript: [
		[/\/\/.*$/, "tok-comment"],
		[/'[^']*'|"(?:[^"\\]|\\.)*"/, "tok-string"],
		[/\b(use|const|let|var|return|function|true|false|null)\b/, "tok-keyword"],
		[/\b\d+\b/, "tok-number"],
	],
	yaml: [
		[/#.*$/, "tok-comment"],
		[/^\s*-?\s*[A-Za-z_][\w.-]*(?=:)/, "tok-type"],
		[/'[^']*'|"[^"]*"/, "tok-string"],
		[/\b\d+\b/, "tok-number"],
	],
	text: [],
}

function highlightLine(line: string, language: CodeLanguage): ReactNode[] {
	const nodes: ReactNode[] = []
	let rest = line
	let key = 0

	while (rest.length > 0) {
		let best: { index: number, length: number, className: string } | undefined
		for (const [pattern, className] of rules[language]) {
			const match = new RegExp(pattern.source, "m").exec(rest)
			if (match && match[0].length > 0 && (!best || match.index < best.index)) {
				best = { index: match.index, length: match[0].length, className }
			}
		}

		if (!best) {
			nodes.push(rest)
			break
		}

		if (best.index > 0) {
			nodes.push(rest.slice(0, best.index))
		}

		nodes.push(
			<span key={key++} className={best.className}>
				{rest.slice(best.index, best.index + best.length)}
			</span>,
		)
		rest = rest.slice(best.index + best.length)
	}

	return nodes
}

export function highlight(code: string, language: CodeLanguage): ReactNode {
	return code.split("\n").map((line, index, lines) => {
		// A leading "$ " marks a shell prompt; it is shown but not selectable or copied
		const prompt = language === "shell" && line.startsWith("$ ")
		const content = prompt ? line.slice(2) : line

		return (
			<span key={index}>
				{prompt && (
					<span className="tok-prompt">
						{"$ "}
					</span>
				)}
				{highlightLine(content, language)}
				{index < lines.length - 1 && "\n"}
			</span>
		)
	})
}

// The text that the copy button puts on the clipboard: the code without the prompt markers
export function copyText(code: string, language: CodeLanguage): string {
	if (language !== "shell") {
		return code
	}

	return code
		.split("\n")
		.map((line) => (line.startsWith("$ ") ? line.slice(2) : line))
		.join("\n")
}
