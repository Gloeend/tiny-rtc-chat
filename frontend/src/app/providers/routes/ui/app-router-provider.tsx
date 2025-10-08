import { RouterProvider } from 'react-router'

import { BrowserRouter } from '../config'

export const AppRouterProvider = () => {
	return <RouterProvider router={BrowserRouter} />
}
