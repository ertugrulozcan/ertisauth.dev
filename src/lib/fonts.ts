import { Geist, Geist_Mono } from "next/font/google"

// next/font downloads the fonts at build time and serves them with the site; no request goes to Google at runtime
export const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin", "latin-ext"],
})

export const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin", "latin-ext"],
})
