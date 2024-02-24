'use client';
import React from 'react'
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@radix-ui/themes';

const TranslateExamButton = ({ examId }: { examId: number }) => {

    const { status, data: session } = useSession();

    if (status !== "authenticated" || !session || session.user.role !== 'ADMIN')
        return (<div></div>)
    return (
        < >
            <Button><Link href={'/exam/translate/' + examId.toString()}>Translate Exam</Link></Button>
        </>
    )
}

export default TranslateExamButton