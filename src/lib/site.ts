import type { Metadata } from "next"

// The public URL of the site, used for canonical and Open Graph URLs.
// Set NEXT_PUBLIC_SITE_URL at build time (the GitHub Actions workflow reads it from the SITE_URL repository variable).
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const links = {
	github: "https://github.com/ertugrulozcan/ErtisAuth",
	wiki: "https://github.com/ertugrulozcan/ErtisAuth/wiki",
	license: "https://github.com/ertugrulozcan/ErtisAuth/blob/master/LICENSE",
	gettingStarted: "https://github.com/ertugrulozcan/ErtisAuth/wiki/Getting-Started",
	operationsSecurity: "https://github.com/ertugrulozcan/ErtisAuth/wiki/Operations#security-checklist",
	securityPolicy: "https://github.com/ertugrulozcan/ErtisAuth/security/policy",
}

// The icons are served from public/ and linked here instead of using the icon/apple-icon file conventions:
// Safari requests /apple-touch-icon.png and /apple-touch-icon-precomposed.png directly, whatever the page links to,
// and a configured icons field replaces the icons of the file conventions (favicon.ico in app/ is kept)
export const icons: Metadata["icons"] = {
	icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
	apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
}

// The NuGet packages of the SDK, shown in the developers section.
export const packages = [
	{ 
		name: "ErtisAuth.Sdk", 
		version: "10.0.2", 
		url: "https://www.nuget.org/packages/ErtisAuth.Sdk", 
		badge: "https://img.shields.io/nuget/v/ErtisAuth.Sdk?label=ErtisAuth.Sdk&style=flat", 
		description: "client" 
	},
	{ 
		name: "ErtisAuth.Sdk.AspNetCore", 
		version: "10.0.2", 
		url: "https://www.nuget.org/packages/ErtisAuth.Sdk.AspNetCore", 
		badge: "https://img.shields.io/nuget/v/ErtisAuth.Sdk.AspNetCore?label=ErtisAuth.Sdk.AspNetCore&style=flat", 
		description: "aspnetcore" 
	},
] as const