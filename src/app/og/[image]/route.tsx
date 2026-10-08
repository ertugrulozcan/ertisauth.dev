import { hasLocale } from "next-intl"
import { routing } from "@/localization/routing"
import { renderOgImage } from "@/lib/og-image"

// The shared images, written at build time as /og/en.png and /og/tr.png: a route handler (rather than the
// opengraph-image convention) gives the files a .png extension, so the static host serves them as images
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ image: `${locale}.png` }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ image: string }> }) {
	const { image } = await params
	const locale = image.replace(/\.png$/, "")

	if (!hasLocale(routing.locales, locale)) {
		return new Response(null, { status: 404 })
	}

	return renderOgImage(locale)
}
