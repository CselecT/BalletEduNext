'use client'
import { Button, Dialog, Flex, TextField } from '@radix-ui/themes'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { patchPasswordSchema } from '@/app/validationSchemas'
import { z } from 'zod'
import ErrorMessage from '@/app/components/ErrorMessage'
import Spinner from '@/app/components/Spinner'
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react'

type PasswordForm = z.infer<typeof patchPasswordSchema>

interface Props {
    params: { userId: string }
}

const ChangePassword = ({ params }: Props) => {
    const router = useRouter();
    const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<PasswordForm>({
        resolver: zodResolver(patchPasswordSchema)
    });
    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const { status, data: session } = useSession();

    useEffect(() => {
        if (session?.user.role === 'ADMIN') {
            register('ignorePassword');
            setValue('ignorePassword', true);
        }
    }, [register, setValue]);

    if (status !== "authenticated" || !session || (session.user.id !== params.userId && session.user.role !== 'ADMIN'))
        return (<div></div>)

    return (
        <div className='max-w-l h-full'>
            <Dialog.Root >
                <Dialog.Trigger>
                    <Button>Change Password</Button>
                </Dialog.Trigger>
                <Dialog.Content>
                    <Dialog.Title>Change Password</Dialog.Title>
                    <Flex direction="column" gap="3">
                        <form className='max-w-m flex flex-col content-between gap-4' onSubmit={handleSubmit(async (data) => {
                            try {
                                setSubmitting(true)
                                const result = await axios.patch('/api/user/' + params.userId + '/password', data);
                                toast.success("Password has been changed successfully.", { duration: 3000, });
                                router.refresh()
                                setSubmitting(false)
                            } catch (error) {
                                toast.error("Something went wrong!", { duration: 3000, });
                                setSubmitting(false)
                                setError('Input is not valid!')
                            }
                        })}>
                            {session.user.role !== 'ADMIN' && <TextField.Root>
                                <label>Old Password</label>
                                <TextField.Input placeholder='Old Password' {...register('password')} />
                            </TextField.Root>}
                            <ErrorMessage>
                                {errors.password?.message}
                            </ErrorMessage>
                            <label>New Password</label>
                            <TextField.Root>
                                <TextField.Input placeholder='New Password' {...register('newPassword')} />
                            </TextField.Root>
                            <ErrorMessage>
                                {errors.password?.message}
                            </ErrorMessage>
                            <label>Confirm Password</label>
                            <TextField.Root>
                                <TextField.Input placeholder='Confirm Password' {...register('confirmPassword')} />
                            </TextField.Root>
                            <ErrorMessage>
                                {errors.password?.message}
                            </ErrorMessage>

                            <Flex gap="3" justify="between">
                                <Button disabled={isSubmitting}>Change Password{isSubmitting && <Spinner />}</Button>
                            </Flex>
                        </form>
                    </Flex>
                    <Flex gap="3" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray">
                                Close
                            </Button>
                        </Dialog.Close>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
        </div>
    )
}
export default ChangePassword