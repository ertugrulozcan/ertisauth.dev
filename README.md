# ErtisAuth website

The landing page of [ErtisAuth](https://github.com/ertugrulozcan/ErtisAuth), built with Next.js (static export), TypeScript and Tailwind CSS, and published on GitHub Pages.

## Development

Requires Node.js 22 (see `.nvmrc`).

```shell
nvm use
npm install
npm run dev
```

The site opens at http://localhost:3000 and redirects to `/en/` or `/tr/` by the browser language.

## Build

```shell
npm run build
```

The static site is written to `out/`. Any static file server can serve it, for example:

```shell
npx serve out
```

## Structure

| Path | Content |
|---|---|
| `src/app/(root)` | The root page; picks the language in the browser and redirects |
| `src/app/[locale]` | The landing page, generated once per language |
| `src/app/global-not-found.tsx` | The 404 page (`out/404.html`, served by GitHub Pages for unknown URLs); contains every language and shows the one of the URL or the browser |
| `src/components/sections` | The sections of the page |
| `src/locales` | Translations (`en.json`, `tr.json`); both files must have the same keys |
| `src/localization` | Language routing (next-intl) |
| `src/app/globals.css` | Color tokens of the light and dark themes |
| `src/app/og/[image]` | The shared (Open Graph / X) images, rendered at build time as `/og/en.png` and `/og/tr.png` from `src/lib/og-image.tsx` |
| `src/assets/fonts` | Geist TTF files for the shared images (SIL Open Font License, `OFL.txt`) |

To add a language, add its code to `src/localization/routing.ts` and a message file to `src/localization/locales`.

Messages use the ICU message syntax: braces are placeholders, so a literal `{id}` must be escaped as `'{id}'`. `npm run check:messages` (run automatically before every build) fails when a locale misses a key or has an extra one, or when a message can't be formatted, e.g. because of an unescaped brace. During the build, a translation missing at runtime also fails the build.

## Deployment

`.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages on every push to `main`.

One-time setup in the repository settings:

1. **Settings → Pages → Build and deployment → Source:** GitHub Actions.
2. **Settings → Pages → Custom domain:** the domain of the site, with a CNAME record at the DNS provider pointing to `<user>.github.io`.
3. **Settings → Secrets and variables → Actions → Variables:** `SITE_URL` with the public URL of the site (e.g. `https://example.com`), used for the canonical, Open Graph, sitemap and robots URLs. The workflow fails while it isn't set.
