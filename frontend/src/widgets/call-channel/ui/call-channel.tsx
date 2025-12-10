import { cn } from '@shared/lib'
import { useParams } from 'react-router'

import { useCall } from '../lib/hooks/use-call'

export const CallChannel = ({ className }: { className?: string }) => {
	const { id = '' } = useParams()
	const { ref, remoteRef } = useCall(id)

	return (
		<section className={cn(className, 'relative')}>
			<video
				className='absolute bottom-4 right-4 h-[150px] w-[300px] rounded-xl bg-black object-contain'
				ref={ref}
				autoPlay
				muted
			/>
			<video className='block h-full w-full rounded-xl bg-black/50 object-contain' ref={remoteRef} autoPlay />
		</section>
	)
}
