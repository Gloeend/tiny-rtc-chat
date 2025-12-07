import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
	loadEnv(mode, process.cwd(), 'VITE_')

	return {
		plugins: [react()],
		define: {
			global: 'window'
		},
		server: {
			host: '0.0.0.0'
		},
		resolve: {
			alias: {
				'@app': path.resolve(__dirname, './src/app'),
				'@entities': path.resolve(__dirname, './src/entities'),
				'@features': path.resolve(__dirname, './src/features'),
				'@pages': path.resolve(__dirname, './src/pages'),
				'@shared': path.resolve(__dirname, './src/shared'),
				'@widgets': path.resolve(__dirname, './src/widgets')
			}
		}
	}
})
