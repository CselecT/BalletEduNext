'use client'
import React from 'react'
import prisma from '@/prisma/client';
import { Avatar, Button, Flex, Link, Table } from '@radix-ui/themes';
import { Jury, School, User, Exam } from '@prisma/client';
import { useSession } from 'next-auth/react';
import ChangePassword from './ChangePassword';
import UserSkeleton from './UserSkeleton';
import EditUserButton from './EditUserButton';
import DeleteUserButton from './DeleteUserButton';
import ExamList from '@/app/exam/_components/ExamList';

interface Props {
    params: { user: User, data: Jury | School | null, exams: Exam[] | null}
}

const UserDetail = ({ params }: Props) => {
    const { status, data: session } = useSession();

    const skeletonParams = {
        name: params.user.name,
        surname: params.user.surname,
        username: params.user.username,
        email: params.user.email,
        avatar: params.user.role == 'ADMIN' ? '/admin.png' : params.user.role == 'SCHOOL' ? '/graduation-cap.png' : '/judge.png',
        location: params.data && 'location' in params.data ? params.data.location : null,
        birthDate: params.data && 'birthDate' in params.data ? params.data.birthDate : null,
        phone: params.data && 'phone' in params.data ? params.data.phone : null
    };


    return (
        <div className='mb-5 flex flex-col place-items-center gap-4'>
            <UserSkeleton params={skeletonParams} />
            <Flex gap="3" justify="end">
                <ChangePassword params={{ userId: params.user.id }} />
                <EditUserButton params={params} />
                <DeleteUserButton userId={params.user.id} />
            </Flex>
            {params.user.role == 'JURY' && params.exams &&
                <ExamList params={{ exams: params.exams }} />
            }
        </div>
    )
}

export default UserDetail