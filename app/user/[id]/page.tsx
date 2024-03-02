import React from 'react'
import prisma from '@/prisma/client';
import UserDetail from '../_components/UserDetail';

interface Props {
    params: { id: string }
}

const UserDetailPage = async ({ params }: Props) => {
    const user = await prisma.user.findUnique({
        where: { id: params.id }
    });
    let data = null;
    let exams = null;
    if (!user) return (<div>User not found</div>);

    if (user.role == 'SCHOOL') {
        data = await prisma.school.findFirst({
            where: { accountId: user.id }
        });
    } else if (user.role == 'JURY') {
        data = await prisma.jury.findFirst({
            where: { accountId: user.id }
        });
        exams = await prisma.exam.findMany({
            where: { juryId: data?.id }
        });
    }

    return (
        <div className="h-full">
            <div className='mb-5'>
                <UserDetail params={{ user: user, data: data, exams: exams }} />
            </div>
        </div>
    )
}
export default UserDetailPage