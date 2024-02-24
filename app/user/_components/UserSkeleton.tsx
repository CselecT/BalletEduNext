import { Avatar, Box, Card, Flex, Table } from '@radix-ui/themes'
import React from 'react'

interface Props {
    params: { avatar: string, name: string | null, location: string | null, surname: string | null, birthDate: Date | null, username: string | null, email: string | null, phone: string | null }
}

const UserSkeleton = ({ params }: Props) => {
    return (
        <div className='mb-5 flex flex-col place-items-center gap-4'>
            <div className='mb-5 flex flex-col place-items-center'>
                <Avatar
                    size="8"
                    src={params.avatar}
                    radius="large"
                    fallback="U"
                />
            </div>
            <Table.Root variant='surface'>
                <Table.Body>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Name:</Table.ColumnHeaderCell>
                        <Table.RowHeaderCell>{params.name}</Table.RowHeaderCell>
                    </Table.Row>
                    {params.surname && <Table.Row>
                        <Table.ColumnHeaderCell>Surname:</Table.ColumnHeaderCell>
                        <Table.RowHeaderCell>{params.surname}</Table.RowHeaderCell>
                    </Table.Row>}
                    {params.location && <Table.Row>
                        <Table.ColumnHeaderCell>Location:</Table.ColumnHeaderCell>
                        <Table.RowHeaderCell>{params.location}</Table.RowHeaderCell>
                    </Table.Row>}
                    {params.birthDate && <Table.Row>
                        <Table.ColumnHeaderCell>Birthday:</Table.ColumnHeaderCell>
                        <Table.RowHeaderCell>{params.birthDate.getDate()}</Table.RowHeaderCell>
                    </Table.Row>}
                    <Table.Row>
                        <Table.ColumnHeaderCell>Username:</Table.ColumnHeaderCell>
                        <Table.RowHeaderCell>{params.username}</Table.RowHeaderCell>
                    </Table.Row><Table.Row>
                        <Table.ColumnHeaderCell>Email:</Table.ColumnHeaderCell>
                        <Table.RowHeaderCell>{params.email}</Table.RowHeaderCell>
                    </Table.Row>
                    {params.phone && <Table.Row>
                        <Table.ColumnHeaderCell>Phone:</Table.ColumnHeaderCell>
                        <Table.RowHeaderCell>{params.phone}</Table.RowHeaderCell>
                    </Table.Row>}
                </Table.Body>
            </Table.Root>
        </div>
    )
}

export default UserSkeleton