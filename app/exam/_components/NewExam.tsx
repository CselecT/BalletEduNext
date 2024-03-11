'use client'
import { Button, Dialog, Flex, Table, TextField } from '@radix-ui/themes'
import Select, { SingleValue } from 'react-select';
import React, { useState } from 'react'
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
import { Cross2Icon } from '@radix-ui/react-icons'

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
    const [studentOptions, setStudentOptions] = useState(params.students?.map((student) => { return { value: student.id, label: student.name + ' ' + student.surname, isDisabled: false } }));

    const [selectedStudentOptions, setSelectedStudentOptions] = useState<SingleValue<{
        value: number;
        label: string;
        isDisabled: boolean;
    }>[]>();

    const [selectedStudentIds, setSelectedStudentIds] = useState<[number, number][]>([]);
    const { status, data: session } = useSession();

    const levels = Object.values(ExamLevel);

    const teachers = params.teachers?.map((teacher) => { return { value: teacher.id, label: teacher.name + ' ' + teacher.surname, isDisabled: false } });
    const juries = params.juries?.map((jury) => { return { value: jury.id, label: jury.name + ' ' + jury.surname, isDisabled: false } });

    const handleStudentOrderEnter = (id: number | undefined, order: number) => {
        if (id === undefined) return;
        register('students'); // register the field
        setSelectedStudentIds(selectedStudentIds => {
            const deletedOldValue = selectedStudentIds.filter((student) => student[0] !== id);
            const updatedStudentIds: [number, number][] = [...deletedOldValue, [id, order]];
            setValue('students', updatedStudentIds); // set the value
            return updatedStudentIds;
        });
        console.log(selectedStudentIds)
    };

    const handleStudentSelect = (student: SingleValue<{
        value: number;
        label: string;
        isDisabled: boolean;
    }>) => {
        const updatedOptions = studentOptions?.map(option => {
            const isSelected = student?.value === option.value;
            if (isSelected) {
                return { ...option, isDisabled: true };
            } else {
                return option;
            }
        });
        if (updatedOptions) {
            setStudentOptions(updatedOptions);
        }
        if (student) {
            const newValue = { value: student.value, label: student.label, isDisabled: true };
            setSelectedStudentOptions([...(selectedStudentOptions || []), newValue]);
        }
    }

    const handleStudentUnSelect = (studentId: number | undefined) => {
        const updatedOptions = studentOptions?.map(option => {
            if (option.value === studentId) {
                return { ...option, isDisabled: false };
            } else {
                return option;
            }
        });
        setStudentOptions(updatedOptions);
        const newSelectedStudentIds = selectedStudentOptions?.filter(student => student?.value !== studentId);
        setSelectedStudentOptions(newSelectedStudentIds);

        setSelectedStudentIds(selectedStudentIds => {
            const updatedStudentIds = selectedStudentIds.filter((student) => student[0] !== studentId);
            return updatedStudentIds;
        });

        console.log(selectedStudentIds)

    }

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
    const handleRegister = () => {
        register('students');
        setValue('students', selectedStudentIds);
        register('schoolid'); // register the field
        setValue('schoolid', parseInt(params.schoolId)); // set the value
    }

    if (status !== "authenticated" || !session || (session.user.role !== 'ADMIN' && session.user.role !== 'SCHOOL'))
        return (<div></div>)
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>

            <div className='max-w-l h-full'>
                <Dialog.Root >
                    <Dialog.Trigger>
                        <Button variant="surface" onClick={handleRegister} >Add Exam</Button>
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
                                {params.juries && <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    onChange={(selectedOption) => { if (selectedOption) handleJurySelect(selectedOption.value) }}
                                    isSearchable={true}
                                    name="Select a jury"
                                    options={juries}
                                />}
                                <ErrorMessage>
                                    {errors.juryid?.message}
                                </ErrorMessage>
                                <label>Select the Teacher</label>
                                {params.teachers && <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    onChange={(selectedOption) => { if (selectedOption) handleTeacherSelect(selectedOption.value) }}
                                    isSearchable={true}
                                    name="Select a teacher"
                                    options={teachers}
                                />}
                                <ErrorMessage>
                                    {errors.teacherid?.message}
                                </ErrorMessage>
                                <label>Select Exam Level</label>
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    onChange={(selectedOption) => { if (selectedOption) handleLevelSelect(selectedOption.value) }}
                                    isSearchable={true}
                                    name="Select exam level"
                                    options={levels.map((level) => { return { value: level, label: level.toString().replace('_', ' ').replace('k', '') } })}
                                />
                                <ErrorMessage>
                                    {errors.level?.message}
                                </ErrorMessage>
                                <label>Select Exam Taking Students</label>

                                {params.students && <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    onChange={(selectedOption) => { if (selectedOption) handleStudentSelect(selectedOption) }}
                                    isSearchable={true}
                                    name="Select exam taking students"
                                    options={studentOptions}
                                    placeholder="Select exam taking students"
                                />}

                                <Table.Root variant='surface'>
                                    <Table.Header>
                                        <Table.Row >
                                            <Table.ColumnHeaderCell>Student Name</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell>Student Order</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell>Cancel</Table.ColumnHeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {selectedStudentOptions && selectedStudentOptions.map(student => (
                                            <Table.Row key={student?.value}>
                                                <Table.RowHeaderCell>{student?.label}</Table.RowHeaderCell>
                                                <Table.RowHeaderCell>
                                                    <TextField.Input required placeholder='Order' type='number' min='1' max={selectedStudentOptions.length} onChange={(input) => { handleStudentOrderEnter(student?.value, parseInt(input.target.value)) }} />
                                                </Table.RowHeaderCell>
                                                <Table.RowHeaderCell><Cross2Icon color='red' onClick={() => handleStudentUnSelect(student?.value)} /></Table.RowHeaderCell>
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
                                    <Button variant="surface" disabled={isSubmitting}>Add New Exam{isSubmitting && <Spinner />}</Button>
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