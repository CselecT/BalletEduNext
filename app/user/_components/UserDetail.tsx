import React from 'react'
import { Flex, Heading, Text } from '@radix-ui/themes';
import { Jury, School, User, Exam } from '@prisma/client';
import ChangePassword from './ChangePassword';
import UserSkeleton from './UserSkeleton';
import EditUserButton from './EditUserButton';
import DeleteUserButton from './DeleteUserButton';
import ExamList from '@/app/exam/_components/ExamList';
import { RiAdminLine } from "react-icons/ri";

interface Props {
    params: { user: User, data: Jury | School | null, exams: Exam[] | null }
}

const UserDetail = ({ params }: Props) => {
    const skeletonParams = {
        name: params.user.name,
        surname: params.user.surname,
        username: params.user.username,
        email: params.user.email,
        avatar: params.user.role == 'ADMIN' ? 'ADMIN' : params.user.role == 'SCHOOL' ? 'SCHOOL' : 'JURY',
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
            {params.user.role == 'ADMIN' &&
                <Heading mb="2" size="4">Exams To Be Reviewed</Heading>
            }
            {params.user.role == 'JURY' &&
                <Heading mb="2" size="4">Assigned Exams</Heading>
            }
            {params.exams &&
                <ExamList params={{ exams: params.exams }} />
            }
            {!params.exams && params.user.role !== 'SCHOOL' && <Text>No exams found.</Text>}
        </div>
    )
}

export default UserDetail