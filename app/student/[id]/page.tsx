import React from 'react'
import prisma from '@/prisma/client';
import { Button, Flex, Link, Table } from '@radix-ui/themes';
import DeleteStudentButton from '../_components/DeleteStudentButton';

interface Props {
    params: { id: string }
}

const StudentDetail = async ({ params }: Props) => {

    const student = await prisma.student.findUnique({
        where: { id: parseInt(params.id) }
    });

    return (
        <div className="h-full">
            <div className='mb-5'>

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
            </div>
            {student && <Flex gap="3" justify="end">
                <DeleteStudentButton studentId={student.id} />
            </Flex>}
        </div>
    )
}

export default StudentDetail