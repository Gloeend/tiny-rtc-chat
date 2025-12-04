import { z } from 'zod'

export const themeSchema = z.enum(['DARK', 'LIGHT'])
