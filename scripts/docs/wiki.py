# Shared helpers of the documentation scripts: where the wiki is and how its code blocks are read.
import os
import re
import textwrap

SITE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

# The wiki is cloned next to the site repository by default (../ErtisAuth.wiki); ERTISAUTH_WIKI overrides it
WIKI_ROOT = os.path.abspath(os.environ.get("ERTISAUTH_WIKI", os.path.join(SITE_ROOT, "..", "ErtisAuth.wiki")))

SAMPLES_ROOT = os.path.join(SITE_ROOT, "src", "docs", "samples")


def read_wiki_page(page):
	path = os.path.join(WIKI_ROOT, f"{page}.md")
	if not os.path.exists(path):
		raise SystemExit(f"Wiki page not found: {path} (set ERTISAUTH_WIKI to the wiki folder)")
	with open(path, encoding="utf-8") as file:
		return file.read()


def wiki_blocks(page):
	"""The fenced code blocks of a wiki page, in order, as (language, code); indented blocks inside list items too."""
	text = read_wiki_page(page)
	return [(language, textwrap.dedent(body).rstrip("\n")) for language, body in re.findall(r"^[ \t]*```(\w*)\n(.*?)^[ \t]*```", text, re.S | re.M)]


def tabs(code):
	"""Two-space indentation units become tabs (the shell samples of the wiki indent with spaces; JSON already uses tabs)."""
	lines = []
	for line in code.split("\n"):
		match = re.match(r"^( +)", line)
		if match and len(match.group(1)) % 2 == 0:
			line = "\t" * (len(match.group(1)) // 2) + line[len(match.group(1)):]
		lines.append(line)
	return "\n".join(lines)
