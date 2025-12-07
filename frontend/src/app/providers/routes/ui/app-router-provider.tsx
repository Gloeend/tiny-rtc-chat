import { withReceiveUser } from '@entities/user'
import { RouterProvider } from 'react-router'

import { BrowserRouter } from '../config'

export const AppRouterProvider = withReceiveUser(() => {
	return <RouterProvider router={BrowserRouter} />
})
