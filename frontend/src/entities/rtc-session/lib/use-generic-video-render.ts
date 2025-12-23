import { useCallback, useRef } from 'react'

export const useGenericVideoRender = () => {
	const ref = useRef<HTMLElement>(null)

	const onAddVideo = useCallback(() => {
		if (!ref.current) {
			return
		}

		const el = document.createElement('video')

		el.className = 'block h-[300px] w-full rounded-xl bg-black/50 object-contain'
		el.autoplay = true

		ref.current.append(el)

		return el
	}, [])

	const onRemoveVideo = useCallback(
		(querySelector: string) => {
			if (!ref.current) {
				return
			}
			const foundedVideoElement = ref.current.querySelector<HTMLVideoElement>(querySelector)

			if (!foundedVideoElement) {
				console.error('Could not find video tag')
				return
			}

			foundedVideoElement.load()
			foundedVideoElement.remove()
		},
		[ref]
	)

	return {
		ref,
		onAddVideo,
		onRemoveVideo
	}
}
