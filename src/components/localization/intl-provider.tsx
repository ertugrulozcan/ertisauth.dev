"use client"

import type { ReactNode } from "react"
import { NextIntlClientProvider, useLocale, useMessages } from "next-intl"
import { onIntlError } from "@/localization/errors"

// Functions can't be passed from the server layout to client components, so the error handler of the client
// components is set here, on a provider that reuses the locale and messages of the server-side provider.
export function IntlProvider({ children }: { children: ReactNode }) {
	const locale = useLocale()
	const messages = useMessages()

	return (
		<NextIntlClientProvider locale={locale} messages={messages} onError={onIntlError}>
			{children}
		</NextIntlClientProvider>
	)
}
