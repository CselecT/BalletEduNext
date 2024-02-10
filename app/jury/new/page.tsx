'use client'
import { Button, Callout, TextArea, TextField } from '@radix-ui/themes'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { createJurySchema } from '@/app/validationSchemas'
import { z } from 'zod'
import ErrorMessage from '@/app/components/ErrorMessage'
import Spinner from '@/app/components/Spinner'
import Datepicker from "tailwind-datepicker-react"

type JuryForm = z.infer<typeof createJurySchema>

const NewJury = () => {
    const router = useRouter();
    const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<JuryForm>({
        resolver: zodResolver(createJurySchema)
    });
    const [error, setError] = useState('');
    const [dateSelected, setDateSelected] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [show, setShow] = useState(false)
    const handleDateChange = (selectedDate: Date) => {
        setDateSelected(true)
        console.log(selectedDate)
        register('birthdate'); // register the field
        setValue('birthdate', selectedDate.toDateString()); // set the value
    }
    const handleDateClose = (state: boolean) => {
        setShow(state)
    }
    return (
        <div className='max-w-xl h-screen'>
            <form className='flex flex-col content-between gap-4' onSubmit={handleSubmit(async (data) => {
                try {
                    if (!dateSelected) throw new Error('Date is required!')
                    setSubmitting(true)
                    await axios.post('/api/jury', data);
                    router.push('/jury')
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
                <label>Birthday</label>
                <Datepicker onChange={handleDateChange} show={show} setShow={handleDateClose} />
                <ErrorMessage>
                    {!dateSelected && 'Date is required!'}
                </ErrorMessage>
                <label>Email</label>
                <TextField.Root>
                    <TextField.Input placeholder='Email' {...register('email')} />
                </TextField.Root>
                <ErrorMessage>
                    {errors.email?.message}
                </ErrorMessage>
                <label>Phone number</label>
                <TextField.Root>
                    <TextField.Input placeholder='Phone number' {...register('phone')} />
                </TextField.Root>
                <ErrorMessage>
                    {errors.phone?.message}
                </ErrorMessage>
                <label>Username</label>
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
                <Button disabled={isSubmitting}>Add New Jury{isSubmitting && <Spinner />}</Button>
            </form>
        </div>
    )
}

export default NewJury