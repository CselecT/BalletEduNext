import React from 'react'
import { Button, Table } from '@radix-ui/themes';
import Link from 'next/link'
import { Exam, } from "@prisma/client";

interface Props {
    params: { exams: Exam[] }
}

const ExamList = ({ params }: Props) => {
    return (
        <div className='mb-5 flex flex-col gap-4'>
            <Table.Root variant='surface'>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Exam Date</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Exam Status</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Exam Details</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {params.exams.map((exam, index) => (
                        <Table.Row key={index}>
                            <Table.RowHeaderCell>{exam.examDate.toDateString()}</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{exam.status}</Table.RowHeaderCell>
                            <Table.Cell><Button variant="outline"><Link href={'/exam/' + exam.id}>Exam Details</Link></Button></Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </div>
    )
}

export default ExamList