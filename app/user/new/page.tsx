'use client'
import { Button, TextField } from '@radix-ui/themes'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserSchema } from '@/app/validationSchemas'
import { z } from 'zod'
import ErrorMessage from '@/app/components/ErrorMessage'
import Spinner from '@/app/components/Spinner'
import toast from 'react-hot-toast'

type UserForm = z.infer<typeof createUserSchema>

const NewUser = () => {
    const router = useRouter();
    const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<UserForm>({
        resolver: zodResolver(createUserSchema)
    });
    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);

    useEffect(() => {
        register('role'); // register the field
        setValue('role', 'ADMIN'); // set the value
    }, [register, setValue]);

    return (
        <div className='max-w-xxl h-full'>
            <form className='flex flex-col content-between gap-4' onSubmit={handleSubmit(async (data) => {
                try {
                    setSubmitting(true)
                    await axios.post('/api/user', data);
                    toast.success("User has been created successfully.", { duration: 3000, });
                    setSubmitting(false)
                } catch (error) {
                    setSubmitting(false)
                    setError('Input is not valid!')
                    toast.error("Something went wrong!", { duration: 3000, });
                }
            })}>
                <label>Name</label>
                <TextField.Root>
                    <TextField.Input placeholder='Name' {...register('name')} />
                </TextField.Root>
                <ErrorMessage>
                    {errors.name?.message}
                </ErrorMessage>
                <label>Surname</label>
                <TextField.Root>
                    <TextField.Input placeholder='Surname' {...register('surname')} />
                </TextField.Root>
                <ErrorMessage>
                    {errors.surname?.message}
                </ErrorMessage>
                <label>Username</label>
                <TextField.Root>
                    <TextField.Input placeholder='Username' {...register('username')} />
                </TextField.Root>
                <ErrorMessage>
                    {errors.surname?.message}
                </ErrorMessage>
                <label>Email</label>
                <TextField.Root>
                    <TextField.Input placeholder='Email' {...register('email')} />
                </TextField.Root>
                <ErrorMessage>
                    {errors.email?.message}
                </ErrorMessage>
                <label>Password</label>
                <TextField.Root>
                    <TextField.Input placeholder='Password' {...register('password')} />
                </TextField.Root>
                <ErrorMessage>
                    {errors.password?.message}
                </ErrorMessage>

                <Button disabled={isSubmitting}>Add New User{isSubmitting && <Spinner />}</Button>
            </form>
        </div>
    )
}
export default NewUser