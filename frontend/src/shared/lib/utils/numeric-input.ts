import type { FormEvent } from 'react'

export const numericInput = () => {
	return (ev: FormEvent<HTMLInputElement>) => {
		const input = ev.currentTarget
		const selectionStart = input.selectionStart ?? 0
		const selectionEnd = input.selectionEnd ?? 0
		const rawData = (ev.nativeEvent as InputEvent).data ?? ''

		const inputData = rawData.replace(',', '.')
		const nextValue = input.value.slice(0, selectionStart) + inputData + input.value.slice(selectionEnd)

		const normalizedValue = nextValue.replace(',', '.')

		if (!/^\d*$/.test(normalizedValue)) {
			ev.preventDefault()
		}
	}
}
