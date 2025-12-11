import { type MouseEvent, useCallback } from 'react'

export const useCopyClipboardByAttribute = <T extends HTMLElement = HTMLButtonElement>(attr: string) => {
	return useCallback(
		async (ev: MouseEvent<T>) => {
			const value = ev.currentTarget.getAttribute(attr)

			if (!value) {
				return
			}

			if (!navigator.clipboard) {
				return
			}

			try {
				await navigator.clipboard.writeText(value)
			} catch (e) {
				console.error(e)
			}
		},
		[attr]
	)
}
