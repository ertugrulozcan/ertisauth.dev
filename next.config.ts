import createNextIntlPlugin from "next-intl/plugin"
import type { NextConfig } from "next"

const withNextIntl = createNextIntlPlugin("./src/localization/request.ts")

const nextConfig: NextConfig = {
	// GitHub Pages serves static files only: the build writes plain HTML/CSS/JS into out/.
	// Only for the build: in development, export mode reports every request that isn't a generated language
	// (e.g. /sw.js asked for by the browser) as an error instead of a 404.
	output: process.env.NODE_ENV === "production" ? "export" : undefined,
	// Every page is a folder with an index.html, which static hosts resolve without rewrites
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
	reactCompiler: true,
	experimental: {
		// A single 404 page for the whole site; there are two root layouts ((root) and [locale]), so a not-found.tsx
		// can't be composed from one layout
		globalNotFound: true,
	},
}

export default withNextIntl(nextConfig)
