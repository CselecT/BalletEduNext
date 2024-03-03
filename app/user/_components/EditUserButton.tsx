'use client'
import { Button, Dialog, Flex, TextField } from '@radix-ui/themes'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { patchUserSchema } from '@/app/validationSchemas'
import { z } from 'zod'
import ErrorMessage from '@/app/components/ErrorMessage'
import Spinner from '@/app/components/Spinner'
import { Jury, School, User } from '@prisma/client'
import { LocalizationProvider, StaticDateTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { toast } from 'react-hot-toast';
import dayjs, { Dayjs } from 'dayjs';
import { useSession } from 'next-auth/react'

interface Props {
    params: { user: User, data: Jury | School | null }
}

type EditUserForm = z.infer<typeof patchUserSchema>

const EditUserButton = ({ params }: Props) => {
    const { status, data: session } = useSession();
    const [isSubmitting, setSubmitting] = useState(false);
    const router = useRouter();
    const [error, setError] = useState('');
    const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<EditUserForm>({
        resolver: zodResolver(patchUserSchema)
    });
    const handleDateChange = (selectedDate: Dayjs | null) => {
        if (!selectedDate) return;
        register('birthdate'); // register the field
        setValue('birthdate', selectedDate.toDate().toDateString()); // set the value
    }

    useEffect(() => {
        register('role'); // register the field
        setValue('role', params.user.role); // set the value
        if (params.user.role === 'JURY' && params.data && 'birthDate' in params.data) {
            register('birthdate');
            setValue('birthdate', params.data?.birthDate.toDateString());
        }

    }, [register, setValue, params.user.role, params.data]);
    if (status !== "authenticated" || !session || session.user.role !== 'ADMIN')
        return (<div></div>)
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className='max-w-l h-full'>
                <Dialog.Root >
                    <Dialog.Trigger>
                        <Button variant="surface">Edit User</Button>
                    </Dialog.Trigger>
                    <Dialog.Content>
                        <Dialog.Title>Edit User</Dialog.Title>
                        <Flex direction="column" gap="3">
                            <form className='max-w-m flex flex-col content-between gap-4' onSubmit={handleSubmit(async (data) => {
                                try {
                                    setSubmitting(true)
                                    const result = await axios.patch('/api/user/' + params.user.id, data);
                                    toast.success("User has been edited successfully.", { duration: 3000, });
                                    router.refresh()
                                    setSubmitting(false)
                                } catch (error) {
                                    toast.error("Something went wrong!", { duration: 3000, });
                                    setSubmitting(false)
                                    setError('Input is not valid!')
                                }
                            })}>
                                <label>Name</label>
                                <TextField.Root>
                                    <TextField.Input defaultValue={params.user.name || ''} {...register('name')} />
                                </TextField.Root>
                                <ErrorMessage>
                                    {errors.name?.message}
                                </ErrorMessage>
                                {params.user.role !== 'SCHOOL' && <div><label>Surname</label>
                                    <TextField.Root>
                                        <TextField.Input defaultValue={params.user.username || ''} {...register('surname')} />
                                    </TextField.Root>
                                    <ErrorMessage>
                                        {errors.surname?.message}
                                    </ErrorMessage></div>}
                                {params.data && 'location' in params.data && <div><label>Location</label>
                                    <TextField.Root>
                                        <TextField.Input defaultValue={params.data.location || ''} {...register('location')} />
                                    </TextField.Root>
                                    <ErrorMessage>
                                        {errors.location?.message}
                                    </ErrorMessage></div>}
                                {params.data && 'birthDate' in params.data && <div>
                                    <label>Birthday</label>
                                    <StaticDateTimePicker
                                        onChange={handleDateChange}
                                        defaultValue={dayjs(params.data.birthDate)}
                                    /></div>
                                }<label>Username</label>
                                <TextField.Root>
                                    <TextField.Input defaultValue={params.user.username || ''} {...register('username')} />
                                </TextField.Root>
                                <ErrorMessage>
                                    {errors.username?.message}
                                </ErrorMessage>
                                <label>Email</label>
                                <TextField.Root>
                                    <TextField.Input defaultValue={params.user.email || ''} {...register('email')} />
                                </TextField.Root>
                                <ErrorMessage>
                                    {errors.email?.message}
                                </ErrorMessage>
                                {params.data && 'phone' in params.data && <div><label>Phone</label>
                                    <TextField.Root>
                                        <TextField.Input defaultValue={params.data.phone || ''} {...register('phone')} />
                                    </TextField.Root>
                                    <ErrorMessage>
                                        {errors.phone?.message}
                                    </ErrorMessage></div>}
                                <Flex gap="3" justify="between">
                                    <Button variant="surface" disabled={isSubmitting}>Edit User{isSubmitting && <Spinner />}</Button>
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
        </LocalizationProvider>
    )
}
export default EditUserButton