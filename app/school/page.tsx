// 'use client'
import React, { useState } from 'react'
import { Button, Table } from '@radix-ui/themes'
import Link from 'next/link'
import prisma from '@/prisma/client';
import Spinner from '../components/Spinner';

const SchoolPage = async () => {
    const schools = await prisma.school.findMany()
    // const [isSubmitting, setSubmitting] = useState(false);

    return (
        <div>
            <div className='mb-5'>
                <Button><Link href='/school/new'>Add School</Link></Button>
            </div>

            <Table.Root variant='surface'>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>School Name</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {schools.map(school => (
                        <Table.Row key={school.id}>
                            <Table.RowHeaderCell>{school.name}</Table.RowHeaderCell>
                            <Table.Cell><Button><Link href={'/school/' + school.id}>School Details</Link></Button></Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </div>

    )
}

export default SchoolPage