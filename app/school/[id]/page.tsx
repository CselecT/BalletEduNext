import React from 'react'
import prisma from '@/prisma/client';
import { Button, Link, Table } from '@radix-ui/themes';
import SchoolDetail from '@/app/components/SchoolDetail';
interface Props {
    params: { id: string }
}

const SchoolDetailPage = async ({ params }: Props) => {
    return (
        <div className="h-full">
            <SchoolDetail params={{ id: params.id }} />
        </div>
    )
}

export default SchoolDetailPage