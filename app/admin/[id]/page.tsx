import { Button } from '@radix-ui/themes'
import Link from 'next/link'
import React from 'react'
import UserDetail from '../../user/_components/UserDetail'
import prisma from '@/prisma/client';

interface Props {
    params: { id: string }
}

const AdminPage = async ({ params }: Props) => {
    const user = await prisma.user.findUnique({
        where: { id: params.id }
    });
    return (
        <div className="max-w-xxl flex  flex-row place-content-between place-items-center ">
            <div className='max-w-l flex flex-col content-between gap-4 place-items-start'>
                <Button className='w-full' ><Link href='/user'>View Users</Link></Button>
                <Button className='w-full'><Link href='/user/new'>Create New Admin User</Link></Button>
                <Button className='w-full'><Link href='/school'>View Schools</Link></Button>
                <Button className='w-full'><Link href='/school/new'>Add School</Link></Button>
                <Button className='w-full'><Link href='/jury'>View Juries</Link></Button>
                <Button className='w-full'><Link href='/jury/new'>Add Jury</Link></Button>
            </div>
            {/* <div className="max-w-xl "> */}
            {user && <UserDetail params={{ user: user, data: null }} />}
            {/* </div> */}

        </div>
    )
}

export default AdminPage