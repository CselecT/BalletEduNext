'use client'
import { Button, Dialog, Flex, Table, TextField } from '@radix-ui/themes'
import Select, { SingleValue } from 'react-select';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { patchExamSchema } from '@/app/validationSchemas'
import { z } from 'zod'
import ErrorMessage from '@/app/components/ErrorMessage'
import Spinner from '@/app/components/Spinner'
import { ExamLevel, Jury, Student, Teacher, Exam, ExamStudents } from '@prisma/client'
import { LocalizationProvider, StaticDateTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { toast } from 'react-hot-toast';
import dayjs, { Dayjs } from 'dayjs';
import { useSession } from 'next-auth/react'
import { Cross2Icon } from '@radix-ui/react-icons';

type ExamForm = z.infer<typeof patchExamSchema>

interface Props {
    params: { exam: Exam, students: Array<Student> | null, teachers: Array<Teacher> | null, juries: Array<Jury> | null, examTakers: Array<Student> | null, examTakingStudentsOrders: Array<ExamStudents> | null }
}

const EditExam = ({ params }: Props) => {
    const router = useRouter();

    const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<ExamForm>({
        resolver: zodResolver(patchExamSchema)
    });

    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const [studentOptions, setStudentOptions] = useState(params.students?.map((student) => {
        const isDisabled = params.examTakers?.some((examTaker) => examTaker.id === student.id) ? true : false;
        return { value: student.id, label: student.name + ' ' + student.surname, isDisabled: isDisabled }
    }));

    const [selectedStudentOptions, setSelectedStudentOptions] = useState<SingleValue<{
        value: number;
        label: string;
        isDisabled: boolean;
    }>[]>(params.examTakers ? params.examTakers?.map((student) => {
        return { value: student.id, label: student.name + ' ' + student.surname, isDisabled: true }
    }) : []);

    const [selectedStudentIds, setSelectedStudentIds] = useState<[number, number][]>(params.examTakingStudentsOrders ?
        params.examTakingStudentsOrders?.map((student) => {
            return [student.studentId, student.studentOrder]
        }) : []);

    const [currentJury, setCurrentJury] = useState(params.exam.juryId);
    const [currentTeacher, setCurrentTeacher] = useState(params.exam.teacherId);
    const [currentLevel, setCurrentLevel] = useState<string>(params.exam.level);
    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs(params.exam.examDate));

    const { status, data: session } = useSession();

    const levels = Object.values(ExamLevel);

    const teachers = params.teachers?.map((teacher) => { return { value: teacher.id, label: teacher.name + ' ' + teacher.surname, isDisabled: false } });
    const juries = params.juries?.map((jury) => { return { value: jury.id, label: jury.name + ' ' + jury.surname, isDisabled: false } });

    const defaultTeacher = teachers?.find((teacher) => teacher.value === params.exam.teacherId);
    const defaultJury = juries?.find((jury) => jury.value === params.exam.juryId);

    console.log(params.examTakingStudentsOrders)
    console.log(selectedStudentOptions)
    const handleStudentOrderEnter = (id: number | undefined, order: number) => {
        if (id === undefined) return;

        setSelectedStudentIds(selectedStudentIds => {
            const deletedOldValue = selectedStudentIds.filter((student) => student[0] !== id);
            const updatedStudentIds: [number, number][] = [...deletedOldValue, [id, order]];
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
        if (studentId === undefined) return;
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
            setValue('students', updatedStudentIds); // set the value
            return updatedStudentIds;
        });
        console.log(selectedStudentIds)
    }

    const handleDateChange = (selectedDate: Dayjs | null) => {
        if (!selectedDate) return;
        setCurrentDate(selectedDate);
    }
    const handleRegister = () => {
        register('students');
        setValue('students', selectedStudentIds);
        register('date');
        setValue('date', currentDate.toDate().toDateString());
        register('juryid');
        setValue('juryid', currentJury);
        register('teacherid');
        setValue('teacherid', currentTeacher);
        register('level');
        setValue('level', currentLevel);
        register('schoolid');
        setValue('schoolid', params.exam.schoolId);
        register('students');
        setValue('students', selectedStudentIds);
    }
    const [open, setOpen] = useState(false);

    if (status !== "authenticated" || !session || (session.user.role !== 'ADMIN' && session.user.role !== 'SCHOOL'))
        return (<div></div>)
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>

            <div className='max-w-l h-full'>
                <Dialog.Root open={open} >
                    <Dialog.Trigger>
                        <Button onClick={() => setOpen(true)} variant="surface" >Edit Exam</Button>
                    </Dialog.Trigger>
                    <Dialog.Content>
                        <Dialog.Title>Edit Exam</Dialog.Title>

                        <Flex direction="column" gap="3">
                            <form className='max-w-m flex flex-col content-between gap-4' onSubmit={handleSubmit(async (data) => {
                                try {
                                    setSubmitting(true)
                                    const result = await axios.patch('/api/exam/' + params.exam.id, data);
                                    toast.success("Exam has been created successfully.", { duration: 3000, });
                                    setOpen(false)
                                    router.push('/exam/' + params.exam.id)
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
                                    defaultValue={defaultJury}
                                    onChange={(selectedOption) => { if (selectedOption) setCurrentJury(selectedOption.value) }}
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
                                    defaultValue={defaultTeacher}
                                    onChange={(selectedOption) => { if (selectedOption) setCurrentTeacher(selectedOption.value) }}
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
                                    defaultValue={{ value: params.exam.level, label: params.exam.level.toString().replace('_', ' ').replace('k', '') }}
                                    classNamePrefix="select"
                                    onChange={(selectedOption) => { if (selectedOption) setCurrentLevel(selectedOption.value) }}
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
                                                    <TextField.Input required defaultValue={params.examTakingStudentsOrders?.find(
                                                        (order) => order.studentId === student?.value)?.studentOrder}
                                                        placeholder='Order' type='number'
                                                        min='1'
                                                        // max={selectedStudentOptions.length} 
                                                        onChange={(input) => { handleStudentOrderEnter(student?.value, parseInt(input.target.value)) }} />
                                                </Table.RowHeaderCell>
                                                <Table.RowHeaderCell><Cross2Icon onClick={() => handleStudentUnSelect(student?.value)} /></Table.RowHeaderCell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table.Root>
                                <ErrorMessage>
                                    {errors.students?.message}
                                </ErrorMessage>
                                <label>Video Link</label>
                                <TextField.Root defaultValue={params.exam.videoLink ? params.exam.videoLink : ''}>
                                    <TextField.Input placeholder='Video link' {...register('videolink')} />
                                </TextField.Root>
                                <ErrorMessage>
                                    {errors.videolink?.message}
                                </ErrorMessage>
                                <label>Exam Date</label>
                                <StaticDateTimePicker
                                    onChange={handleDateChange}
                                    defaultValue={dayjs(params.exam.examDate)}
                                />
                                <Flex gap="3" justify="between">
                                    <Button variant="surface" disabled={isSubmitting} onClick={handleRegister}>Edit Exam{isSubmitting && <Spinner />}</Button>
                                </Flex>
                            </form>
                        </Flex>
                        <Flex gap="3" justify="end">
                            <Dialog.Close>
                                <Button onClick={() => setOpen(false)} variant="soft" color="gray">
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

export default EditExam