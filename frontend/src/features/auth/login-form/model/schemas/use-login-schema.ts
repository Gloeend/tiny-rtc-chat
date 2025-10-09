import { z } from 'zod'

export const useLoginSchema = () => {
	return z.object({
		username: z.string({ message: 'Заполните поле' }).min(1, { message: 'Заполните поле' })
	})
}

export type LoginSchema = z.infer<ReturnType<typeof useLoginSchema>>
