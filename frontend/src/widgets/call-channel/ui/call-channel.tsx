import { MediaPanel } from '@features/media-panel'
import { AppRoutes, RoutePath } from '@shared/config/routes-config'
import { cn } from '@shared/lib'
import { useNavigate, useParams } from 'react-router'

import { useCall } from '../lib/hooks/use-call'

export const CallChannel = ({ className }: { className?: string }) => {
	const navigate = useNavigate()
	const { id = '' } = useParams()
	const { ref, containerRef } = useCall(id)

	const onDisconnect = () => {
		navigate(RoutePath[AppRoutes.MAIN])
	}

	return (
		<section
			ref={containerRef}
			className={cn(className, 'grid grid-cols-3 gap-4 pb-24 max-768px-576px:grid-cols-2 max-576px:grid-cols-1')}
		>
			<video className='bottom-4 right-4 h-[300px] w-full rounded-xl bg-black/50 object-contain' ref={ref} autoPlay muted />
			{/*<video className='block h-[300px] w-full rounded-xl bg-black/50 object-contain' ref={remoteRef} autoPlay />*/}
			<MediaPanel onDisconnect={onDisconnect} className='fixed bottom-4 left-0 right-0 mx-auto w-fit' />
		</section>
	)
}
