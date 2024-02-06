'use client'
import { Button, Callout, TextArea, TextField } from '@radix-ui/themes'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
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
        <div className='max-w-xl h-screen'>
            <form className='space-y-3' onSubmit={handleSubmit(async (data) => {
                try {
                    setSubmitting(true)
                    await axios.post('/api/school', data);
                    router.push('/school')
                } catch (error) {
                    setSubmitting(false)
                    setError('Input is not valid!')
                }
            })}>
                <TextField.Root>
                    <TextField.Input placeholder='School Name' {...register('name')} />
                </TextField.Root>
                <ErrorMessage>
                    {errors.name?.message}
                </ErrorMessage>
                <TextArea placeholder='School Location' {...register('location')} />
                <Button disabled={isSubmitting}>Add New School{isSubmitting && <Spinner />}</Button>
            </form>
        </div>
    )
}

export default NewSchool