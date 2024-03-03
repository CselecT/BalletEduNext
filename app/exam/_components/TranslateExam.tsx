'use client';
import React, { useEffect, useState } from 'react'
import { Button, Flex, Text, Table, TextArea, Heading } from '@radix-ui/themes';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { translateExamSchema } from '@/app/validationSchemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Exam, ExamStudents, Jury, School, Student, Teacher } from '@prisma/client';
import ErrorMessage from '@/app/components/ErrorMessage';
import { useSession } from 'next-auth/react';

interface Props {
    params: { id: string, exam: Exam, school: School | null, examStudents: ExamStudents[], jury: Jury | null, teacher: Teacher | null, students: Student[] }
}
type EditForm = z.infer<typeof translateExamSchema>

const TranslateExam = ({ params }: Props) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<EditForm>({
        resolver: zodResolver(translateExamSchema),
    });
    const router = useRouter();
    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const { status, data: session } = useSession();

    useEffect(() => {
        register('examId'); // register the field
        setValue('examId', parseInt(params.id)); // set the value
    }, [register, setValue, params.id]);
    if (status !== "authenticated" || !session || session.user.role !== 'ADMIN')
        return (<div>You are not authorized for this operation!</div>)
    return (
        <div className='mb-5 flex flex-col content-between gap-4'>
            <form className='max-w-m flex flex-col content-between gap-4' onSubmit={handleSubmit(
                async (data) => {
                    console.log(data)

                    try {
                        setSubmitting(true)
                        const result = await axios.post('/api/exam/translate', data);
                        toast.success("Exam has been edited successfully.", { duration: 3000, });
                        router.push('/exam/' + params.id);
                        router.refresh()
                        setSubmitting(false)
                    } catch (error) {
                        toast.error("Something went wrong!", { duration: 3000, });
                        setSubmitting(false)
                        setError('Input is not valid!')
                    }
                })}>
                {params.exam &&
                    <Table.Root variant='surface'>
                        <Table.Body>
                            <Table.Row>
                                <Table.ColumnHeaderCell>School:</Table.ColumnHeaderCell>
                                {params.school && <Table.RowHeaderCell>{params.school.name}</Table.RowHeaderCell>}
                            </Table.Row>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Exam Date:</Table.ColumnHeaderCell>
                                <Table.RowHeaderCell>{params.exam.examDate.toDateString()}</Table.RowHeaderCell>
                            </Table.Row>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Level:</Table.ColumnHeaderCell>
                                <Table.RowHeaderCell>{params.exam.level}</Table.RowHeaderCell>
                            </Table.Row><Table.Row>
                                <Table.ColumnHeaderCell>Teacher:</Table.ColumnHeaderCell>
                                {params.teacher && <Table.RowHeaderCell>{params.teacher.name + ' ' + params.teacher.surname}</Table.RowHeaderCell>}
                            </Table.Row><Table.Row>
                                <Table.ColumnHeaderCell>Jury:</Table.ColumnHeaderCell>
                                {params.jury && <Table.RowHeaderCell>{params.jury.name + ' ' + params.jury.surname}</Table.RowHeaderCell>}
                            </Table.Row>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Video Link:</Table.ColumnHeaderCell>
                                {params.exam && <Table.RowHeaderCell>{params.exam.videoLink}</Table.RowHeaderCell>}
                            </Table.Row>
                        </Table.Body>
                    </Table.Root>}
                <Table.Root variant='surface'>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Surname</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Marking</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Evaluation</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Translation</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {params.examStudents && params.examStudents.map((evaluation, index) => (
                            <>
                                <Table.Row key={index}>
                                    <Table.RowHeaderCell>{params.students.find(student => student.id === evaluation.studentId)?.name}</Table.RowHeaderCell>
                                    <Table.RowHeaderCell>{params.students.find(student => student.id === evaluation.studentId)?.surname}</Table.RowHeaderCell>
                                    <Table.RowHeaderCell>
                                        {evaluation.marking}
                                    </Table.RowHeaderCell>
                                    <Table.RowHeaderCell>
                                        {evaluation.eval}
                                    </Table.RowHeaderCell>
                                    <Table.RowHeaderCell>
                                        <TextArea placeholder="Translation..." {...register(`translations.${index}.evalTranslation`)}
                                        />
                                        <input type="hidden" {...register(`translations.${index}.evalid`, {
                                            valueAsNumber: true,
                                        })} value={evaluation.id} />
                                    </Table.RowHeaderCell>
                                </Table.Row>
                                {errors.translations?.[index] &&
                                    <Table.Row>
                                        <Table.RowHeaderCell />
                                        <Table.RowHeaderCell />
                                        <Table.RowHeaderCell />
                                        <Table.RowHeaderCell />
                                        <Table.RowHeaderCell>
                                            <ErrorMessage>
                                                {errors.translations?.[index]?.evalTranslation?.message}
                                            </ErrorMessage>
                                        </Table.RowHeaderCell>
                                    </Table.Row>
                                }
                            </>
                        ))}
                    </Table.Body>
                </Table.Root>
                <Heading mb="2" size="4">General Evaluation</Heading>
                <Text>{params.exam.examEval}</Text>
                <Heading mb="2" size="4">General Evaluation Translation</Heading>
                <TextArea placeholder="General Evaluation Translation..." {...register(`examEvalTranslation`)}
                />
                <ErrorMessage>
                    {errors.examEvalTranslation?.message}
                </ErrorMessage>
                <Flex gap="3" justify="end">
                    <Button variant="surface">Evaluate</Button>
                </Flex>
            </form>
        </div>
    )
}

export default TranslateExam