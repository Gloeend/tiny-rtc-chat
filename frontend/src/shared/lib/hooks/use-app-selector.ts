import type { RootState } from '@shared/config/store-config'
import { useSelector } from 'react-redux'

export const useAppSelector = useSelector.withTypes<RootState>()
