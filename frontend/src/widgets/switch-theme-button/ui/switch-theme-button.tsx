import { getTheme, useChangeTheme } from '@entities/theme'
import { useAppSelector } from '@shared/lib'
import { Moon, Sun } from 'lucide-react'

export const SwitchThemeButton = () => {
	const theme = useAppSelector(getTheme)
	const { revertTheme } = useChangeTheme()

	return (
		<button onClick={revertTheme} className='fixed bottom-4 right-4 bg-background text-foreground'>
			{theme === 'LIGHT' ? <Moon width={24} height={24} /> : <Sun width={24} height={24} />}
		</button>
	)
}
