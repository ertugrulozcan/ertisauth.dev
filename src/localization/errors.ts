import type { IntlError } from "next-intl"

// A missing or malformed translation fails the static build (and shows the error overlay in development) instead of
// being logged and rendered as a fallback. In the browser it is only logged: the HTML was already checked at build time.
export function onIntlError(error: IntlError) {
	if (typeof window === "undefined") {
		throw error
	}

	console.error(error)
}
