import { useCreateChannel } from '@entities/channel'
import { numericInput } from '@shared/lib'
import { Button } from '@shared/ui/button.tsx'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@shared/ui/form.tsx'
import { Input } from '@shared/ui/input.tsx'
import { LoaderCircle } from 'lucide-react'

export const CreateChannelForm = () => {
	const { isLoading, form, onSubmit } = useCreateChannel()

	const { control } = form

	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className='flex flex-col gap-y-4'>
				<FormField
					name='name'
					control={control}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className='flex flex-col gap-y-2'>
									<FormLabel>Название</FormLabel>
									<Input {...field} />
								</div>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					name='maxParticipants'
					control={control}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className='flex flex-col gap-y-2'>
									<FormLabel>Количество участников</FormLabel>
									<Input
										{...field}
										onBeforeInput={numericInput}
										onChange={(ev) => {
											field.onChange(parseInt(ev.currentTarget.value))
										}}
									/>
								</div>
							</FormControl>
						</FormItem>
					)}
				/>
				<Button disabled={!form.formState.isValid}>
					{isLoading ? <LoaderCircle className='animate-spin' /> : 'Создать'}
				</Button>
			</form>
		</Form>
	)
}
