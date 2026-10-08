import type { MetadataRoute } from "next"
import { siteUrl } from "@/lib/site"

// Required with output: "export"; the file is written once at build time
export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: `${siteUrl}/sitemap.xml`,
	}
}
