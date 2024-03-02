import React from 'react'
import { Button, Flex, Table } from '@radix-ui/themes'
import Link from 'next/link'
import prisma from '@/prisma/client';
import NewJuryButton from './_components/NewJuryButton';

const JuryPage = async () => {
    const juries = await prisma.jury.findMany()
    return (
        <div className="h-full mb-5 flex flex-col content-between gap-4">
            <Table.Root variant='surface'>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Surname</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Phone</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Birthday</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {juries.map(jury => (
                        <Table.Row key={jury.id}>
                            <Table.RowHeaderCell>{jury.name}</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{jury.surname}</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{jury.email}</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{jury.phone}</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{jury.birthDate.toDateString()}</Table.RowHeaderCell>
                            <Table.RowHeaderCell><Button><Link href={'/user/' + jury.accountId}>Details</Link></Button></Table.RowHeaderCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
            <Flex gap="3" justify="end">
                <NewJuryButton />
            </Flex>
        </div>
    )
}

export default JuryPage