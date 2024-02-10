import React from 'react'
import prisma from '@/prisma/client';
import { Button, Link, Table } from '@radix-ui/themes';

interface Props {
    params: { id: string }
}

const TeacherDetail = async ({ params }: Props) => {
    const teacher = await prisma.teacher.findUnique({
        where: { id: parseInt(params.id) }
    });

    return (
        <div className="h-screen">
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
                            <Table.RowHeaderCell>{teacher.birthDate.getDate()}</Table.RowHeaderCell>
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
        </div>
    )
}

export default TeacherDetail