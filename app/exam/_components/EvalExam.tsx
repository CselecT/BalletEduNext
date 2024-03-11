'use client';
import React, { useEffect, useState } from 'react'
import { Button, Flex, Heading, Link, Table, TextArea, TextField } from '@radix-ui/themes';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { evaluateExamSchema } from '@/app/validationSchemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Exam, ExamStudents, Jury, School, Student, Teacher } from '@prisma/client';
import ErrorMessage from '@/app/components/ErrorMessage';
import { useSession } from 'next-auth/react';

interface Props {
    params: { id: string, exam: Exam, school: School | null, examStudents: ExamStudents[], jury: Jury | null, teacher: Teacher | null, students: Student[] }
}
type EvalForm = z.infer<typeof evaluateExamSchema>

const EvalExam = ({ params }: Props) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<EvalForm>({
        resolver: zodResolver(evaluateExamSchema),
    });
    const router = useRouter();
    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const { status, data: session } = useSession();

    useEffect(() => {
        register('examId'); // register the field
        setValue('examId', parseInt(params.id)); // set the value
    }, [register, setValue, params.id]);
    if (status !== "authenticated" || !session || (session.user.role !== 'ADMIN' && session.user.role !== 'JURY'))
        return (<div></div>)

    return (
        <div className='mb-5 flex flex-col content-between gap-4'>
            <form className='max-w-m flex flex-col content-between gap-4' onSubmit={handleSubmit(
                async (data) => {
                    console.log(data)

                    try {
                        setSubmitting(true)
                        const result = await axios.patch('/api/exam/eval', data);
                        toast.success("Exam has been evaluated successfully.", { duration: 3000, });
                        setSubmitting(false)
                        router.push('/exam/' + params.id);
                        router.refresh()
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
                                <Table.RowHeaderCell>{params.exam.level.replace('k','').replaceAll('_',' ')}</Table.RowHeaderCell>
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
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {params.students && params.students.map((student, index) => (
                            <>
                                <Table.Row key={index}>
                                    <Table.RowHeaderCell>{student.name}</Table.RowHeaderCell>
                                    <Table.RowHeaderCell>{student.surname}</Table.RowHeaderCell>
                                    <Table.RowHeaderCell>
                                        {/* {student.marking} */}
                                        {/* <TextField.Input placeholder="Marking..." {...register(`evals.${index}.marking`)} /> */}
                                        <input placeholder="Marking..." {...register(`evals.${index}.marking`, {
                                            valueAsNumber: true,
                                        })} />

                                    </Table.RowHeaderCell>
                                    <Table.RowHeaderCell>
                                        <TextArea placeholder="Evaluation..." {...register(`evals.${index}.eval`)}
                                        />
                                        <input type="hidden" {...register(`evals.${index}.studentid`, {
                                            valueAsNumber: true,
                                        })} value={student.id} />
                                    </Table.RowHeaderCell>
                                </Table.Row>
                                {errors.evals?.[index] &&
                                    <Table.Row>
                                        <Table.RowHeaderCell />
                                        <Table.RowHeaderCell />

                                        <Table.RowHeaderCell>
                                            <ErrorMessage>
                                                {errors.evals?.[index]?.marking?.message}
                                            </ErrorMessage>
                                        </Table.RowHeaderCell>
                                        <Table.RowHeaderCell>
                                            <ErrorMessage>
                                                {errors.evals?.[index]?.eval?.message}
                                            </ErrorMessage>
                                        </Table.RowHeaderCell>
                                    </Table.Row>
                                }
                            </>
                        ))}
                    </Table.Body>
                </Table.Root>
                <ErrorMessage>
                    {errors.evals?.message}
                </ErrorMessage>
                <Heading mb="2" size="4">General Evaluation</Heading>
                <TextArea placeholder="General Evaluation..." {...register(`examEval`)}
                />
                <ErrorMessage>
                    {errors.examEval?.message}
                </ErrorMessage>
                <Flex gap="3" justify="end">
                    <Button variant="surface">Evaluate</Button>
                </Flex>
            </form>
        </div>
    )
}

export default EvalExam