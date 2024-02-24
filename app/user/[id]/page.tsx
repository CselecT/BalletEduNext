import React from 'react'
import prisma from '@/prisma/client';
import { Button, Link, Table } from '@radix-ui/themes';
import UserDetail from '../_components/UserDetail';

interface Props {
    params: { id: string }
}

const UserDetailPage = async ({ params }: Props) => {
    const user = await prisma.user.findUnique({
        where: { id: params.id }
    });
    let data = null;

    if (!user) return (<div>User not found</div>);

    if (user.role == 'SCHOOL') {
        data = await prisma.school.findFirst({
            where: { accountId: user.id }
        });
    } else if (user.role == 'JURY') {
        data = await prisma.jury.findFirst({
            where: { accountId: user.id }
        });
    }

    return (
        <div className="h-full">
            <div className='mb-5'>
                <UserDetail params={{ user: user, data: data }} />
            </div>
        </div>
    )
}

export default UserDetailPage