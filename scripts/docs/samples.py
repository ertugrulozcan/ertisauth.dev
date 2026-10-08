"""Regenerates the code samples of the documentation (src/docs/samples/<slug>.ts) from the code blocks of the wiki.

The exports of a samples file match the code blocks of its wiki page one by one, in order; their names are read from the
existing file. An export in several languages ({ en: `…`, tr: `…` }, e.g. a diagram with translated labels) only gets its
English text from the wiki: the other languages are kept and reported, to be updated by hand (see diagram.py).

Usage:
	python3 scripts/docs/samples.py sdk users        regenerate these pages
	python3 scripts/docs/samples.py --all            regenerate every page
	python3 scripts/docs/samples.py --all --check    only report the differences (exit code 1 when there are some)
"""
import os
import re
import sys

from wiki import SAMPLES_ROOT, tabs, wiki_blocks

EXPORT = re.compile(r"^export const (\w+) = (`(?:\\.|[^`\\])*`|\{.*?^\})\n", re.S | re.M)
LANGUAGE_VALUE = re.compile(r"^\t(\w+): (`(?:\\.|[^`\\])*`),\n", re.S | re.M)


def page_name(slug):
	"""The wiki page of a slug: getting-started -> Getting-Started; the names that differ are listed."""
	special = {"api-conventions": "API-Conventions", "sdk": "SDK"}
	return special.get(slug) or "-".join(part.capitalize() for part in slug.split("-"))


def to_ts(code):
	return "`" + code.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${") + "`"


def from_ts(literal):
	return literal[1:-1].replace("\\${", "${").replace("\\`", "`").replace("\\\\", "\\")


def regenerate(slug, check):
	path = os.path.join(SAMPLES_ROOT, f"{slug}.ts")
	with open(path, encoding="utf-8") as file:
		text = file.read()
	
	exports = list(EXPORT.finditer(text))
	blocks = wiki_blocks(page_name(slug))
	if len(exports) != len(blocks):
		print(f"{slug}: {len(exports)} exports but {len(blocks)} code blocks in the wiki; update the samples file by hand")
		return False
	
	result, position, changes = [], 0, []
	for match, (language, code) in zip(exports, blocks):
		name, value = match.group(1), match.group(2)
		code = tabs(code) if language == "shell" else code
		result.append(text[position:match.start(2)])
		if value.startswith("`"):
			if from_ts(value) != code:
				changes.append(name)
			result.append(to_ts(code))
		else:
			languages = dict((x.group(1), x.group(2)) for x in LANGUAGE_VALUE.finditer(value))
			if from_ts(languages["en"]) != code:
				changes.append(f"{name}.en (check the other languages of {name} by hand)")
			languages["en"] = to_ts(code)
			result.append("{\n" + "".join(f"\t{key}: {literal},\n" for key, literal in languages.items()) + "}")
		position = match.end(2)
	result.append(text[position:])
	
	if changes:
		print(f"{slug}: {', '.join(changes)}")
		if not check:
			with open(path, "w", encoding="utf-8") as file:
				file.write("".join(result))
	
	return not changes


def main(args):
	check = "--check" in args
	slugs = [x for x in args if not x.startswith("--")]
	if "--all" in args:
		slugs = sorted(x[:-3] for x in os.listdir(SAMPLES_ROOT) if x.endswith(".ts"))
	if not slugs:
		print(__doc__)
		return 2
	
	unchanged = [regenerate(slug, check) for slug in slugs]
	if all(unchanged):
		print("The samples match the wiki")
	return 0 if all(unchanged) or not check else 1


if __name__ == "__main__":
	sys.exit(main(sys.argv[1:]))
