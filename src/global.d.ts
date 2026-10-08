import type messages from "./localization/locales/en.json"
import type { routing } from "./localization/routing"

declare module "next-intl" {
	interface AppConfig {
		Locale: (typeof routing.locales)[number]
		Messages: typeof messages
	}
}
