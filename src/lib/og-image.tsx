import en from "@/localization/locales/en.json"
import tr from "@/localization/locales/tr.json"
import { ImageResponse } from "next/og"
import type { Locale } from "@/localization/routing"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

// The shared image of a page (Open Graph; X falls back to it too), rendered once per language at build time
export const ogImageSize = { width: 1200, height: 630 }

const messages: Record<Locale, typeof en> = { en, tr }

// The default font of ImageResponse covers basic Latin only; Geist (OFL, see src/assets/fonts) also has the Turkish letters
const font = (weight: 400 | 600) => readFile(join(process.cwd(), "src/assets/fonts", `Geist-${weight}.ttf`))

// The Open Graph / X image entry of a page's metadata
export function ogImage(locale: Locale) {
	return {
		url: `/og/${locale}.png`,
		width: ogImageSize.width,
		height: ogImageSize.height,
		alt: messages[locale].meta.title,
		type: "image/png",
	}
}

export async function renderOgImage(locale: Locale) {
	const { hero } = messages[locale]
	const [regular, semiBold] = await Promise.all([font(400), font(600)])

	return new ImageResponse(
		(
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					width: "100%",
					height: "100%",
					padding: "72px 80px",
					background: "#000000",
					backgroundImage: [
						"radial-gradient(ellipse 60% 55% at 50% 0%, rgba(139, 116, 255, 0.35), transparent 70%)",
						"linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
						"linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
					].join(", "),
					backgroundSize: "100% 100%, 56px 56px, 56px 56px",
					color: "#ededed",
					fontFamily: "Geist",
				}}>
				<div style={{ display: "flex", alignItems: "center", gap: 20 }}>
					<svg width="64" height="64" viewBox="0 0 32 32" fill="none">
						<defs>
							<linearGradient id="mark" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
								<stop stopColor="#8b74ff" />
								<stop offset="1" stopColor="#22d3ee" />
							</linearGradient>
						</defs>
						<path d="M16 2.5 27 6.6v8.3c0 7-4.6 12.6-11 14.6C9.6 27.5 5 21.9 5 14.9V6.6L16 2.5Z" fill="url(#mark)" />
						<circle cx="16" cy="13.2" r="3.4" fill="#000000" />
						<path d="M14.6 15.6h2.8l.9 6.2h-4.6l.9-6.2Z" fill="#000000" />
					</svg>
					<div style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.02em" }}>
						ErtisAuth
					</div>
				</div>

				<div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.035em" }}>
					<div>
						{hero.title}
					</div>
					<div style={{ backgroundImage: "linear-gradient(90deg, #8b74ff, #22d3ee)", backgroundClip: "text", color: "transparent" }}>
						{hero.subtitle}
					</div>
				</div>

				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 26, color: "#a1a1aa" }}>
					<div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 22px", border: "1px solid #2c2c2e", borderRadius: 999 }}>
						<div style={{ width: 10, height: 10, borderRadius: 999, background: "#8b74ff" }} />
						{hero.badge}
					</div>
					<div>
						github.com/ertugrulozcan/ErtisAuth
					</div>
				</div>
			</div>
		),
		{
			...ogImageSize,
			fonts: [
				{ name: "Geist", data: regular, weight: 400, style: "normal" },
				{ name: "Geist", data: semiBold, weight: 600, style: "normal" },
			],
		},
	)
}
