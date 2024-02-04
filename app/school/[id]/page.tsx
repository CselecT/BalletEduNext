import React from 'react'
import prisma from '@/prisma/client';
import { Button, Link, Table } from '@radix-ui/themes';

interface Props {
    params: { id: string }
}

const SchoolDetail = async ({ params }: Props) => {
    const school = await prisma.school.findUnique({
        where: { id: parseInt(params.id) }
    });
    const students = await prisma.student.findMany({
        where: { schoolId: parseInt(params.id) }
    });

    const teachers = await prisma.teacher.findMany({
        where: { schoolId: parseInt(params.id) }
    });

    return (
        <div>
            <div className='mb-5'>

                {school && <Table.Root variant='surface'>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>School Name</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>School Location</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.RowHeaderCell>{school.name}</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{school.location}</Table.RowHeaderCell>
                        </Table.Row>
                    </Table.Body>
                </Table.Root>}
            </div>
            {students.length === 0 && <div>No students found</div>}
            {teachers.length === 0 && <div>No teachers found</div>}
            {students.length > 0 && <Table.Root variant='surface'>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Student Name</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Student Surname</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {students.map(student => (
                        <Table.Row key={student.id}>
                            <Table.RowHeaderCell>{student.name}</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{student.surname}</Table.RowHeaderCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
            }
            {teachers.length > 0 && <Table.Root variant='surface'>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Teacher Name</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Teacher Surname</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {teachers.map(teacher => (
                        <Table.Row key={teacher.id}>
                            <Table.RowHeaderCell>{teacher.name}</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{teacher.surname}</Table.RowHeaderCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>}

        </div>
    )
}

export default SchoolDetail