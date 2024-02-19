import React from 'react'
import prisma from '@/prisma/client';
import { Button, Link, Table } from '@radix-ui/themes';
import JuryDetail from '@/app/jury/_components/JuryDetail';
interface Props {
    params: { id: string }
}

const JuryDetailPage = ({ params }: Props) => {
    return (
        <div className="h-full">
            <JuryDetail params={{ id: params.id }} />
        </div>
    )
}

export default JuryDetailPage