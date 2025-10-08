import { z } from 'zod'

const validateSchema = z.object({
	VITE_APP_MODE: z.string()
})

export const ENV_CONFIG = validateSchema.parse(import.meta.env)
