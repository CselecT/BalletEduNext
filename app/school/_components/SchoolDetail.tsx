import React, { useEffect, useState } from 'react'
import prisma from '@/prisma/client';
import { Avatar, Box, Button, Card, Dialog, Flex, Inset, Link, Table } from '@radix-ui/themes';
import { useSession } from 'next-auth/react';
import NewExam from '../../exam/_components/NewExam';
import NewStudentDialog from '../../student/_components/NewStudentDialog';
import NewTeacherDialog from '../../teacher/_components/NewTeacherDialog';
import { Exam, Jury, School, Student, Teacher } from '@prisma/client';

interface Props {
    params: { id: string }
}

const SchoolDetail = async ({ params }: Props) => {

    const schoolId = params.id;

    const school = await prisma.school.findUnique({ where: { id: parseInt(params.id) } });

    const students = await prisma.student.findMany({
        where: { schoolId: parseInt(params.id) }
    });

    const teachers = await prisma.teacher.findMany({
        where: { schoolId: parseInt(params.id) }
    });

    const exams = await prisma.exam.findMany({
        where: { schoolId: parseInt(params.id) }
    });

    const juries = await prisma.jury.findMany();


    return (
        <div className=" flex flex-col content-between gap-4">
            <div className='mb-5 flex flex-col content-between gap-4'>
                {school && <Card style={{ maxWidth: 240 }}>
                    <Flex gap="3" align="center">
                        <Avatar
                            size="3"
                            src="/graduation-cap.png"
                            radius="full"
                            fallback="S"
                        />
                        <Box>
                            <strong>
                                {school.name}
                            </strong>
                            <br />
                            <label>
                                {school.location}
                            </label>
                        </Box>
                    </Flex>
                </Card>}
            </div>

            <div className='mb-5 space-y-4'>
                {students?.length === 0 && <div>No students found </div>}
                <NewStudentDialog params={{ schoolId }} />

                {students?.length && students.length > 0 && <Table.Root variant='surface'>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Student Name</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Student Surname</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Student Details</Table.ColumnHeaderCell>

                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {students.map(student => (
                            <Table.Row key={student.id}>
                                <Table.RowHeaderCell>{student.name}</Table.RowHeaderCell>
                                <Table.RowHeaderCell>{student.surname}</Table.RowHeaderCell>
                                <Table.Cell><Button variant="outline"><Link href={'/student/' + student.id}>Student Details</Link></Button></Table.Cell>

                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
                }
            </div>
            <div className='mb-5 space-y-4'>

                {teachers?.length === 0 && <div>No teachers found</div>}
                <NewTeacherDialog params={{ schoolId }} />

                {teachers?.length && teachers.length > 0 && <Table.Root variant='surface'>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Teacher Name</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Teacher Surname</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Teacher Details</Table.ColumnHeaderCell>

                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {teachers.map(teacher => (
                            <Table.Row key={teacher.id}>
                                <Table.RowHeaderCell>{teacher.name}</Table.RowHeaderCell>
                                <Table.RowHeaderCell>{teacher.surname}</Table.RowHeaderCell>
                                <Table.Cell><Button variant="outline"><Link href={'/teacher/' + teacher.id}>Teacher Details</Link></Button></Table.Cell>

                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>}
            </div>
            {exams?.length === 0 && <div>No exams found</div>}
            {students && teachers && juries && exams && <NewExam params={{ schoolId, students, teachers, juries }} />}
            {exams?.length && exams.length > 0 && <Table.Root variant='surface'>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Exam Date</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Exam Status</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Exam Details</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {exams.map(exam => (
                        <Table.Row key={exam.id}>
                            <Table.RowHeaderCell>{exam.examDate.toDateString()}</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{exam.status}</Table.RowHeaderCell>
                            <Table.Cell><Button variant="outline"><Link href={'/exam/' + exam.id}>Exam Details</Link></Button></Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>}
        </div>
    )
}

export default SchoolDetail