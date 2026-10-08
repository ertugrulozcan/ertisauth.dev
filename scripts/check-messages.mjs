// Checks the translations before a build:
// - every locale has exactly the keys of the default locale,
// - every message formats without errors, which catches unescaped ICU syntax such as "{id}" (write "'{id}'").
//
// Must run with `node --conditions=development`: the production build of next-intl returns messages without
// placeholder values as they are, so "{id}" would silently be printed instead of failing.
import { readdirSync, readFileSync } from "node:fs"
import { createTranslator } from "next-intl"

const directory = new URL("../src/localization/locales/", import.meta.url)
const defaultLocale = "en"

// Messages that take arguments need sample values here, e.g. { "footer.copyright": { year: 2026 } }
const sampleValues = {}

function flatten(messages, prefix = "") {
	return Object.entries(messages).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key
		return typeof value === "object" && value !== null ? flatten(value, path) : [path]
	})
}

const locales = readdirSync(directory)
	.filter((file) => file.endsWith(".json"))
	.map((file) => file.slice(0, -".json".length))

const catalogs = Object.fromEntries(
	locales.map((locale) => [locale, JSON.parse(readFileSync(new URL(`${locale}.json`, directory), "utf8"))]),
)

const errors = []
const expectedKeys = new Set(flatten(catalogs[defaultLocale]))

for (const locale of locales) {
	const keys = flatten(catalogs[locale])

	if (locale !== defaultLocale) {
		const actualKeys = new Set(keys)
		for (const key of expectedKeys) {
			if (!actualKeys.has(key)) {
				errors.push(`${locale}: missing key "${key}"`)
			}
		}
		for (const key of actualKeys) {
			if (!expectedKeys.has(key)) {
				errors.push(`${locale}: unknown key "${key}" (not in ${defaultLocale}.json)`)
			}
		}
	}

	const t = createTranslator({
		locale,
		messages: catalogs[locale],
		onError: (error) => errors.push(`${locale}: ${error.message}`),
	})

	for (const key of keys) {
		t(key, sampleValues[key])
	}
}

if (errors.length > 0) {
	console.error(`Translation check failed:\n${errors.map((error) => `  - ${error}`).join("\n")}`)
	process.exit(1)
}

console.log(`Translations OK (${locales.join(", ")}: ${expectedKeys.size} keys)`)
