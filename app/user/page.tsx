import React, { useState } from 'react'
import { Button, Table } from '@radix-ui/themes'
import Link from 'next/link'
import prisma from '@/prisma/client';
import Spinner from '../components/Spinner';
import { useSession } from 'next-auth/react';


const UserPage = async () => {
    const users = await prisma.user.findMany()

    return (
        <div className="h-full">

            <div className='mb-5'>
                {(<Button><Link href='/user/new'>Add User</Link></Button>)}
            </div>

            <Table.Root variant='surface'>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Surname</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {users.map(user => (
                        <Table.Row key={user.id}>
                            <Table.RowHeaderCell>{user.username}</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{user.name}</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{user.surname}</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{user.email}</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{user.role}</Table.RowHeaderCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </div>
    )
}

export default UserPage