'use client'
import { Button, Callout, DropdownMenu, RadioGroup, Select, TextArea, TextField } from '@radix-ui/themes'
import { CaretDownIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserSchema } from '@/app/validationSchemas'
import { z } from 'zod'
import ErrorMessage from '@/app/components/ErrorMessage'
import Spinner from '@/app/components/Spinner'

type UserForm = z.infer<typeof createUserSchema>


const NewUser = () => {
    const router = useRouter();
    const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<UserForm>({
        resolver: zodResolver(createUserSchema)
    });
    const [error, setError] = useState('');
    const [dateSelected, setDateSelected] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);

    useEffect(() => {
        register('role'); // register the field
        setValue('role', 'ADMIN'); // set the value
    }, [register, setValue]);


    return (
        <div className='max-w-xxl h-full'>
            <form className='flex flex-col content-between gap-4' onSubmit={handleSubmit(async (data) => {
                try {
                    if (!dateSelected) throw new Error('Date is required!')
                    setSubmitting(true)
                    await axios.post('/api/user', data);
                    router.push('/user')
                    router.refresh()
                } catch (error) {
                    setSubmitting(false)
                    setError('Input is not valid!')
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

                <Button disabled={isSubmitting}>Add New User{isSubmitting && <Spinner />}</Button>
            </form>
        </div>
    )
}

export default NewUser