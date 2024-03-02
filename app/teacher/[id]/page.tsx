import React from 'react'
import prisma from '@/prisma/client';
import { Heading, Table, Text } from '@radix-ui/themes';
import ExamList from '@/app/exam/_components/ExamList';

interface Props {
    params: { id: string }
}
const TeacherDetail = async ({ params }: Props) => {
    const teacher = await prisma.teacher.findUnique({
        where: { id: parseInt(params.id) }
    });
    const exams = await prisma.exam.findMany({
        where: { teacherId: parseInt(params.id) }
    });
    return (
        <div className="h-full">
            <div className='mb-5'>
                {teacher && <Table.Root variant='surface'>
                    <Table.Body>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Name:</Table.ColumnHeaderCell>
                            <Table.RowHeaderCell>{teacher.name}</Table.RowHeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Surname:</Table.ColumnHeaderCell>
                            <Table.RowHeaderCell>{teacher.surname}</Table.RowHeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Birthdate:</Table.ColumnHeaderCell>
                            <Table.RowHeaderCell>{teacher.birthDate.toDateString()}</Table.RowHeaderCell>
                        </Table.Row><Table.Row>
                            <Table.ColumnHeaderCell>Email:</Table.ColumnHeaderCell>
                            <Table.RowHeaderCell>{teacher.email}</Table.RowHeaderCell>
                        </Table.Row><Table.Row>
                            <Table.ColumnHeaderCell>Phone Number:</Table.ColumnHeaderCell>
                            <Table.RowHeaderCell>{teacher.phone}</Table.RowHeaderCell>
                        </Table.Row>
                    </Table.Body>
                </Table.Root>}
            </div>
            <Heading mb="2" size="4">Assigned Exams</Heading>
            {(!exams || exams?.length) === 0 &&
                <Text>No exams found</Text>
            }
            {exams?.length > 0 &&
                <ExamList params={{ exams: exams }} />
            }
        </div>
    )
}

export default TeacherDetail