import { cn } from '@shared/lib'
import { useParams } from 'react-router'

import { useCall } from '../lib/hooks/use-call'

export const CallChannel = ({ className }: { className?: string }) => {
	const { id = '' } = useParams()
	const { ref, remoteRef } = useCall(id)

	return (
		<section className={cn(className, 'grid grid-cols-3 gap-4')}>
			<video className='bottom-4 right-4 h-[300px] w-full rounded-xl bg-black/50 object-contain' ref={ref} autoPlay muted />
			<video className='block h-[300px] w-full rounded-xl bg-black/50 object-contain' ref={remoteRef} autoPlay />
		</section>
	)
}
