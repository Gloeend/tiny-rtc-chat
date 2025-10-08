import { store } from '@app/providers/store/config/store.ts'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
