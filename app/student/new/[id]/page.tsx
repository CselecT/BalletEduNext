'use client'
import { Button, Callout, TextArea, TextField } from '@radix-ui/themes'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { createStudentSchema } from '@/app/validationSchemas'
import { z } from 'zod'
import ErrorMessage from '@/app/components/ErrorMessage'
import Spinner from '@/app/components/Spinner'
import Datepicker from "tailwind-datepicker-react"

type StudentForm = z.infer<typeof createStudentSchema>

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Props {
    params: { id: string }
}

const NewStudent = ({ params }: Props) => {
    const router = useRouter();
    const { register, control, handleSubmit, formState: { errors } } = useForm<StudentForm>({
        resolver: zodResolver(createStudentSchema)
    });
    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const [bday, setBday] = useState<Value>(new Date());
    const [show, setShow] = useState(false)
    const handleDateChange = (selectedDate: Date) => {
        console.log(selectedDate)
        register('birthdate', { value: selectedDate });
    }
    const handleDateClose = (state: boolean) => {
        setShow(state)
    }

    return (
        <div className='max-w-xl h-screen'>
            <form className='space-y-3' onSubmit={handleSubmit(async (data) => {
                try {
                    register('schoolid', { value: parseInt(params.id) })
                    setSubmitting(true)
                    await axios.post('/api/student', data);
                    router.push('/student')
                } catch (error) {
                    setSubmitting(false)
                    setError('Input is not valid!')
                }
            })}>
                <TextField.Root>
                    <TextField.Input placeholder='Student Name' {...register('name')} />
                </TextField.Root>
                <ErrorMessage>
                    {errors.name?.message}
                </ErrorMessage>
                <TextArea placeholder='Student Surname' {...register('surname')} />
                <Datepicker onChange={handleDateChange} show={show} setShow={handleDateClose} />
                <Button disabled={isSubmitting}>Add New Student{isSubmitting && <Spinner />}</Button>
            </form>
        </div>
    )
}

export default NewStudent