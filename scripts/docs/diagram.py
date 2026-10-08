"""Helpers for the translated text diagrams of the samples (exports like { en: `…`, tr: `…` }): a label can be replaced
without breaking the alignment of the box characters.

Usage, from a Python shell in scripts/docs:
	from diagram import relabel, positions
	tr = "\n".join(relabel(line, "Your app", "Uygulama") if "Your app" in line else line for line in en.split("\n"))
	assert positions(tr) == positions(en)
"""
import re

def relabel(line, old, new):
	"""Replaces a label in a text diagram without moving the rest of the line: a longer label takes the place of the
	─ characters (or spaces) that follow it, a shorter one gives it back."""
	i = line.index(old)
	end = i + len(old)
	diff = len(new) - len(old)
	if diff <= 0:
		filler = line[end] if end < len(line) and line[end] in "─ " else " "
		return line[:i] + new + filler * (-diff) + line[end:]
	j = end
	# skip one separating space, then consume from the run of ─ or spaces
	if j < len(line) and line[j] == " ":
		j += 1
	run = 0
	while j + run < len(line) and line[j + run] in "─ " and run < diff + 1:
		run += 1
	if end == len(line):
		return line[:i] + new
	assert run >= diff + (1 if line[j - 1] == " " and j > end else 0), (old, new, run, diff)
	return line[:i] + new + line[end:j] + line[j + diff:]

def positions(text):
	return [[m.start() for m in re.finditer("[│▶◀┘└┐┌]", l)] for l in text.split("\n")]
