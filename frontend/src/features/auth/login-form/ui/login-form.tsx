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
						<CardTitle>Login to your account</CardTitle>
						<CardDescription>Enter your username below to continue</CardDescription>
					</CardHeader>
					<CardContent>
						<FieldGroup>
							<Field>
								<FormLabel htmlFor='email'>Username</FormLabel>
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
														placeholder='Type your username'
														required
														{...field}
														value={field.value || ''}
													/>
													<FormMessage />
												</div>
											</FormControl>
										</FormItem>
									)}
								/>
							</Field>

							<Field>
								<Button type='submit' disabled={!isValid || isSubmitting}>
									{isSubmitting ? <Loader className='animate-spin' /> : 'Login'}
								</Button>
							</Field>
						</FieldGroup>
					</CardContent>
				</Card>
			</form>
		</Form>
	)
}
