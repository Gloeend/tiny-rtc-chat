import type { AppDispatch } from '@shared/config/store-config'
import { useDispatch } from 'react-redux'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
