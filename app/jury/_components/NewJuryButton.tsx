'use client'
import { Button,  Dialog, Flex,  TextField } from '@radix-ui/themes'
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
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { NextResponse } from 'next/server'

type JuryForm = z.infer<typeof createJurySchema>

const NewJuryButton = () => {
    const router = useRouter();
    const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<JuryForm>({
        resolver: zodResolver(createJurySchema)
    });
    const [error, setError] = useState('');
    const { status, data: session } = useSession();
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
    if (status !== "authenticated" || !session || (session.user.role !== 'ADMIN' && session.user.role !== 'SCHOOL'))
        return (<></>)
    return (
        <div className='max-w-xl h-full'>
            <Dialog.Root >
                <Dialog.Trigger>
                    <Button variant="surface">Add Jury</Button>
                </Dialog.Trigger>
                <Dialog.Content>
                    <Dialog.Title>Add Jury</Dialog.Title>
                    <Flex direction="column" gap="3">
                        <form className='flex flex-col content-between gap-4' onSubmit={handleSubmit(async (data) => {
                            try {
                                if (!dateSelected) throw new Error('Date is required!')
                                setSubmitting(true)
                                const ret = await axios.post('/api/jury', data);
                                toast.success("Jury has been created successfully.", { duration: 3000, });
                                router.refresh()
                                setSubmitting(false)
                            } catch (error) {
                                setSubmitting(false)
                                console.log(error as NextResponse)
                                toast.error('', { duration: 3000, });
                                setError((error as Error).message)
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
                            <Button  variant="surface" disabled={isSubmitting}>Add New Jury{isSubmitting && <Spinner />}</Button>
                        </form>
                        <Dialog.Close>
                            <Button variant="soft" color="gray">
                                Close
                            </Button>
                        </Dialog.Close>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
        </div >
    )
}

export default NewJuryButton