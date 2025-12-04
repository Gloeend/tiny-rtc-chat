import { z } from 'zod'

export const useProfileEditFormSchema = () => {
	return z.object({
		username: z.string(),
		avatar: z.base64().nullable()
	})
}

export type ProfileEditForm = z.infer<ReturnType<typeof useProfileEditFormSchema>>
