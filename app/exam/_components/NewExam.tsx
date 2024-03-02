'use client'
import { Button,  Dialog, Flex, Select, Switch, Table, TextField } from '@radix-ui/themes'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { createExamSchema } from '@/app/validationSchemas'
import { z } from 'zod'
import ErrorMessage from '@/app/components/ErrorMessage'
import Spinner from '@/app/components/Spinner'
import { ExamLevel, Jury, Student, Teacher } from '@prisma/client'
import { LocalizationProvider, StaticDateTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { toast } from 'react-hot-toast';
import { Dayjs } from 'dayjs';
import { useSession } from 'next-auth/react'

type ExamForm = z.infer<typeof createExamSchema>

interface Props {
    params: { schoolId: string, students: Array<Student> | null, teachers: Array<Teacher> | null, juries: Array<Jury> | null }
}

const NewExam = ({ params }: Props) => {
    const router = useRouter();

    const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<ExamForm>({
        resolver: zodResolver(createExamSchema)
    });
    const [dateSelected, setDateSelected] = useState(false);

    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
    const { status, data: session } = useSession();

    const levels = Object.values(ExamLevel);

    const handleToggle = (id: number, toggled: boolean) => {
        console.log(id, toggled)
        register('students'); // register the field
        if (toggled) {
            setSelectedStudentIds(selectedStudentIds => {
                const updatedStudentIds = [...selectedStudentIds, id];
                setValue('students', updatedStudentIds); // set the value
                return updatedStudentIds;
            });
        } else {
            setSelectedStudentIds(selectedStudentIds => {
                const updatedStudentIds = selectedStudentIds.filter((student) => student !== id);
                setValue('students', updatedStudentIds); // set the value
                return updatedStudentIds;
            });
        }
    };

    const handleJurySelect = (jury: number) => {
        register('juryid'); // register the field
        setValue('juryid', jury); //
    }


    const handleTeacherSelect = (teacher: number) => {
        register('teacherid'); // register the field
        setValue('teacherid', teacher); //
    }

    const handleLevelSelect = (level: string) => {
        register('level'); // register the field
        setValue('level', level); //
    }

    const handleDateChange = (selectedDate: Dayjs | null) => {
        if (!selectedDate) return;
        setDateSelected(true)
        register('date'); // register the field
        setValue('date', selectedDate.toDate().toDateString()); // set the value
    }

    useEffect(() => {
        register('schoolid'); // register the field
        setValue('schoolid', parseInt(params.schoolId)); // set the value
        register('students'); // register the field
        setValue('students', selectedStudentIds); // set the value
    }, [register, setValue, params.schoolId]);
    if (status !== "authenticated" || !session || (session.user.role !== 'ADMIN' && session.user.role !== 'SCHOOL'))
        return (<div>You are not authorized for this operation!</div>)
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>

            <div className='max-w-l h-full'>
                <Dialog.Root >
                    <Dialog.Trigger>
                        <Button>Add Exam</Button>
                    </Dialog.Trigger>
                    <Dialog.Content>
                        <Dialog.Title>Add Exam</Dialog.Title>

                        <Flex direction="column" gap="3">
                            <form className='max-w-m flex flex-col content-between gap-4' onSubmit={handleSubmit(async (data) => {
                                try {
                                    setSubmitting(true)
                                    const result = await axios.post('/api/exam', data);
                                    toast.success("Exam has been created successfully.", { duration: 3000, });
                                    router.refresh()
                                    setSubmitting(false)
                                } catch (error) {
                                    toast.error("Something went wrong!", { duration: 3000, });
                                    setSubmitting(false)
                                    setError('Input is not valid!')
                                }
                            })}>
                                <label>Select the Jury</label>
                                <Select.Root onValueChange={(str) => { handleJurySelect(Number(str)) }}>
                                    <Select.Trigger placeholder="Select a jury" />
                                    <Select.Content>
                                        {params.juries && params.juries.map(jury => (
                                            <Select.Item key={jury.id} value={jury.id + ''}>{jury.name + ' ' + jury.surname}</Select.Item>

                                        ))}
                                    </Select.Content>
                                </Select.Root>
                                <ErrorMessage>
                                    {errors.juryid?.message}
                                </ErrorMessage>
                                <label>Select the Teacher</label>
                                <Select.Root onValueChange={(str) => { handleTeacherSelect(Number(str)) }}>
                                    <Select.Trigger placeholder="Select a teacher" />
                                    <Select.Content>
                                        {params.teachers && params.teachers.map(teacher => (
                                            <Select.Item key={teacher.id} value={teacher.id + ''}>{teacher.name + ' ' + teacher.surname}</Select.Item>

                                        ))}
                                    </Select.Content>
                                </Select.Root>
                                <ErrorMessage>
                                    {errors.teacherid?.message}
                                </ErrorMessage>
                                <label>Select Exam Level</label>
                                <Select.Root onValueChange={(str) => { handleLevelSelect(str) }}>
                                    <Select.Trigger placeholder="Select exam level" />
                                    <Select.Content>
                                        {levels.map(level => (
                                            <Select.Item key={level} value={level}>{level.toString().replace('_', ' ')}</Select.Item>
                                        ))}

                                    </Select.Content>
                                </Select.Root>
                                <ErrorMessage>
                                    {errors.level?.message}
                                </ErrorMessage>
                                <label>Select Exam Taking Students</label>
                                <Table.Root variant='surface'>
                                    <Table.Header>
                                        <Table.Row >
                                            <Table.ColumnHeaderCell>Student Name</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell>Exam Taker</Table.ColumnHeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {params.students && params.students.map(student => (
                                            <Table.Row key={student.id}>
                                                <Table.RowHeaderCell>{student.name + ' ' + student.surname}</Table.RowHeaderCell>
                                                <Table.RowHeaderCell> {<Switch onCheckedChange={(event) => { handleToggle(student.id, event) }} />}</Table.RowHeaderCell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table.Root>
                                <ErrorMessage>
                                    {errors.students?.message}
                                </ErrorMessage>

                                <label>Video Link</label>
                                <TextField.Root>
                                    <TextField.Input placeholder='Video link' {...register('videolink')} />
                                </TextField.Root>
                                <ErrorMessage>
                                    {errors.videolink?.message}
                                </ErrorMessage>
                                <label>Exam Date</label>
                                <StaticDateTimePicker
                                    onChange={handleDateChange}
                                />
                                <ErrorMessage>
                                    {!dateSelected && 'Date is required!'}
                                </ErrorMessage>
                                <Flex gap="3" justify="between">
                                    <Button disabled={isSubmitting}>Add New Exam{isSubmitting && <Spinner />}</Button>
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

export default NewExam