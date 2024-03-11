import React from 'react'
import prisma from '@/prisma/client';
import { Button, Flex, Table } from '@radix-ui/themes';
import DeleteStudentButton from '../_components/DeleteStudentButton';
import Link from 'next/link';

interface Props {
    params: { id: string }
}

const StudentDetail = async ({ params }: Props) => {
    const student = await prisma.student.findUnique({
        where: { id: parseInt(params.id) }
    });
    if (!student) return (<div>Student not found</div>);

    const school = await prisma.school.findUnique({
        where: { id: student.schoolId }
    });

    const exams = await prisma.exam.findMany({
        where: { students: { some: { studentId: student.id } } },
        include: { students: true }
    });

    return (
        <div className="h-full mb-5 space-y-4 ">
                {student && <Table.Root variant='surface'>
                    <Table.Body>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Name:</Table.ColumnHeaderCell>
                            <Table.RowHeaderCell>{student.name}</Table.RowHeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Surname:</Table.ColumnHeaderCell>
                            <Table.RowHeaderCell>{student.surname}</Table.RowHeaderCell>
                        </Table.Row>
                        {school && <Table.Row>
                            <Table.ColumnHeaderCell>School:</Table.ColumnHeaderCell>
                            <Table.RowHeaderCell>{school.name}</Table.RowHeaderCell>
                        </Table.Row>}
                        <Table.Row>
                            <Table.ColumnHeaderCell>Birthdate:</Table.ColumnHeaderCell>
                            <Table.RowHeaderCell>{student.birthDate.toDateString()}</Table.RowHeaderCell>
                        </Table.Row><Table.Row>
                            <Table.ColumnHeaderCell>Email:</Table.ColumnHeaderCell>
                            <Table.RowHeaderCell>{student.email}</Table.RowHeaderCell>
                        </Table.Row><Table.Row>
                            <Table.ColumnHeaderCell>Phone Number:</Table.ColumnHeaderCell>
                            <Table.RowHeaderCell>{student.phone}</Table.RowHeaderCell>
                        </Table.Row>

                    </Table.Body>
                </Table.Root>}
                {student && <Flex gap="3" justify="end">
                    <DeleteStudentButton studentId={student.id} />
                </Flex>}
                {exams.length > 0 && <Table.Root variant='surface'>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Exam Date</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Exam Level</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Exam Status</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Exam Details</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Marking</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Evaluation</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Evaluation Translation</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {exams.map(exam => (
                            <Table.Row key={exam.id}>
                                <Table.RowHeaderCell>{exam.examDate.toDateString()}</Table.RowHeaderCell>
                                <Table.RowHeaderCell>{exam.level.replace('k', '').replaceAll('_', ' ')}</Table.RowHeaderCell>
                                <Table.RowHeaderCell>{exam.status}</Table.RowHeaderCell>
                                <Table.Cell><Button variant="outline"><Link href={'/exam/' + exam.id}>Exam Details</Link></Button></Table.Cell>
                                <Table.RowHeaderCell>{exam.students.find(s => s.id === student.id)?.marking}</Table.RowHeaderCell>
                                <Table.RowHeaderCell>{exam.students.find(s => s.id === student.id)?.eval}</Table.RowHeaderCell>
                                <Table.RowHeaderCell>{exam.students.find(s => s.id === student.id)?.evalTranslate}</Table.RowHeaderCell>

                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>}
        </div>
    )
}
export default StudentDetail