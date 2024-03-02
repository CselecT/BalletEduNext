import React from 'react'
import { Button, Table } from '@radix-ui/themes'
import Link from 'next/link'
import prisma from '@/prisma/client';

const SchoolPage = async () => {
    const schools = await prisma.school.findMany()
    return (
        <div className="h-full">
            <Table.Root variant='surface'>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>School Name</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {schools.map(school => (
                        <Table.Row key={school.id}>
                            <Table.RowHeaderCell>{school.name}</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{school.location}</Table.RowHeaderCell>
                            <Table.Cell><Button><Link href={'/school/' + school.id}>School Details</Link></Button></Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </div>
    )
}
export default SchoolPage