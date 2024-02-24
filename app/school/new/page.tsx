'use client'
import { Button, Callout, TextArea, TextField } from '@radix-ui/themes'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { createSchoolSchema } from '@/app/validationSchemas'
import { z } from 'zod'
import ErrorMessage from '@/app/components/ErrorMessage'
import Spinner from '@/app/components/Spinner'

type SchoolFrom = z.infer<typeof createSchoolSchema>

const NewSchool = () => {
    const router = useRouter();
    const { register, control, handleSubmit, formState: { errors } } = useForm<SchoolFrom>({
        resolver: zodResolver(createSchoolSchema)
    });
    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);

    return (
        <div className='max-w-xl h-full'>
            <form className='flex flex-col content-between gap-4' onSubmit={handleSubmit(async (data) => {
                try {
                    setSubmitting(true)
                    await axios.post('/api/school', data);
                    router.push('/school')
                    router.refresh()
                } catch (error) {
                    setSubmitting(false)
                    setError('Input is not valid!')
                }
            })}>
                <label>School Name</label>
                <TextField.Root>
                    <TextField.Input placeholder='School Name' {...register('name')} />
                </TextField.Root>
                <ErrorMessage>
                    {errors.name?.message}
                </ErrorMessage>
                <label>School Location</label>
                <TextArea placeholder='School Location' {...register('location')} />
                <label>Account Username</label>
                <TextField.Root>
                    <TextField.Input placeholder='Account Username' {...register('username')} />
                </TextField.Root>
                <ErrorMessage>
                    {errors.username?.message}
                </ErrorMessage>
                <label>Account Password</label>
                <TextField.Root>
                    <TextField.Input placeholder='Account Password' {...register('password')} />
                </TextField.Root>
                <ErrorMessage>
                    {errors.password?.message}
                </ErrorMessage>
                <label>Account Email</label>
                <TextField.Root>
                    <TextField.Input placeholder='Account Email' {...register('email')} />
                </TextField.Root>
                <ErrorMessage>
                    {errors.email?.message}
                </ErrorMessage>
                <Button disabled={isSubmitting}>Add New School{isSubmitting && <Spinner />}</Button>
            </form>
        </div>
    )
}

export default NewSchool