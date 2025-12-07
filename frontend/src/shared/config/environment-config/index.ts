import { z } from 'zod'

const validateSchema = z.object({
	VITE_APP_MODE: z.enum(['prod', 'dev'] as const),
	VITE_APP_BACKEND_WS_URL: z.string(),
	VITE_APP_BACKEND_REST_URL: z.string(),
	VITE_APP_ICE_SERVERS: z.string()
})

export const ENV_CONFIG = validateSchema.parse(import.meta.env)
