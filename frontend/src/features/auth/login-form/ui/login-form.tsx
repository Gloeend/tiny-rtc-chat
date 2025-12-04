import { cn } from '@shared/lib'
import { Button } from '@shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card'
import { Field, FieldGroup } from '@shared/ui/field'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@shared/ui/form'
import { Input } from '@shared/ui/input'
import { Loader } from 'lucide-react'

import { useLoginForm } from '../lib/hooks/use-login-form'

export const LoginForm = ({ className }: { className?: string }) => {
	const { form, onSubmit } = useLoginForm()

	const {
		formState: { isValid, isSubmitting },
		control
	} = form

	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className={cn('flex flex-col gap-6', className)}>
				<Card>
					<CardHeader>
						<CardTitle>Войдите в аккаунт</CardTitle>
						<CardDescription>Введите ваш логин, чтобы продолжить.</CardDescription>
					</CardHeader>
					<CardContent>
						<FieldGroup>
							<Field>
								<FormLabel htmlFor='email'>Логин</FormLabel>
								<FormField
									name='username'
									control={control}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<div>
													<Input
														id='username'
														type='text'
														placeholder='BananaLover2001'
														required
														{...field}
														value={field.value || ''}
													/>
													<FormMessage className='mt-1' />
												</div>
											</FormControl>
										</FormItem>
									)}
								/>
							</Field>

							<Field>
								<Button type='submit' disabled={!isValid || isSubmitting}>
									{isSubmitting ? <Loader className='animate-spin' /> : 'Продолжить'}
								</Button>
							</Field>
						</FieldGroup>
					</CardContent>
				</Card>
			</form>
		</Form>
	)
}
