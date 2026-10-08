# Documentation scripts

The documentation pages of the site are written by hand (`src/docs/{en,tr}/*.tsx`), and kept in sync with the
[GitHub wiki](https://github.com/ertugrulozcan/ErtisAuth/wiki) by hand too. These scripts take over the mechanical part:
the code samples and the Error Codes tables, which are generated from the wiki instead of being copied.

They need Python 3 and the wiki cloned next to this repository (`../ErtisAuth.wiki`); set `ERTISAUTH_WIKI` to use
another folder.

| Command | What it does |
|---|---|
| `npm run check:docs` | Reports the samples and Error Codes tables that differ from the wiki, without changing anything |
| `npm run docs:samples -- sdk users` | Regenerates `src/docs/samples/<slug>.ts` of the given pages from the wiki (`--all` for every page) |
| `npm run docs:error-codes` | Regenerates `src/docs/{en,tr}/error-codes.tsx` from the wiki's Error-Codes page |

## Samples

The exports of `src/docs/samples/<slug>.ts` match the code blocks of the wiki page one by one, in order. After adding,
removing or reordering a code block in the wiki, do the same with the exports of the samples file (the names are yours),
then run the script: it fills in the code. Shell samples get tab indentation.

An export in several languages (``{ en: `…`, tr: `…` }``, the diagrams with translated labels) only gets its English text
from the wiki; the script names it, and the Turkish text is updated by hand. `diagram.py` replaces a label without
breaking the alignment of the box characters.

## Error Codes

The English pages come from the wiki tables. The Turkish section titles and meanings are in `TITLES_TR` and
`MEANINGS_TR` of `error_codes.py`: the script stops and lists them when a code or a section has no translation yet,
or when a translated code is no longer in the wiki.
