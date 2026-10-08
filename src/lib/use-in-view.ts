"use client"

import { useEffect, useRef, useState } from "react"

type Options = {
	// Stay true after the element was seen once (reveal effects); otherwise follow the element in and out (looping animations)
	once?: boolean
	rootMargin?: string
	threshold?: number
}

export function useInView<T extends Element>({ once = false, rootMargin = "0px", threshold = 0 }: Options = {}) {
	const ref = useRef<T>(null)
	const [inView, setInView] = useState(false)

	useEffect(() => {
		const element = ref.current
		if (!element) {
			return
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true)
					if (once) {
						observer.disconnect()
					}
				} else if (!once) {
					setInView(false)
				}
			},
			{ rootMargin, threshold },
		)

		observer.observe(element)
		return () => observer.disconnect()
	}, [once, rootMargin, threshold])

	return [ref, inView] as const
}

// The visitor asked the system for less motion; looping animations show a still state instead
export function usePrefersReducedMotion() {
	const [reduced, setReduced] = useState(false)

	useEffect(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)")
		const update = () => setReduced(query.matches)
		update()
		query.addEventListener("change", update)
		return () => query.removeEventListener("change", update)
	}, [])

	return reduced
}
