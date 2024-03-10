import { Exam, School } from '@prisma/client'
import { Button, Table } from '@radix-ui/themes'
import Link from 'next/link'
import React from 'react'

interface Props {
    params: { exams: Array<Exam> }
}

const ExamTable = ({ params }: Props) => {
    return (<div>
        {params.exams.length > 0 && <Table.Root variant='surface'>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>School</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Exam Date</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Exam Level</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Exam Status</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Exam Details</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {params.exams.map(exam => (
                    <Table.Row key={exam.id}>
                        <Table.RowHeaderCell>{exam.examDate.toDateString()}</Table.RowHeaderCell>
                        <Table.RowHeaderCell>{exam.status}</Table.RowHeaderCell>
                        <Table.Cell><Button variant="outline"><Link href={'/exam/' + exam.id}>Exam Details</Link></Button></Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>}</div>
    )
}

export default ExamTable