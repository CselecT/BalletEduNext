import React, { useEffect, useState } from 'react'
import NewStudent from '@/app/components/NewStudent'

interface Props {
    params: { id: string }
}

const NewStudentPage = ({ params }: Props) => {
    return (
        <div className='max-w-xl h-full'>
            <NewStudent params={{ schoolId: params.id }} />
        </div >
    )
}

export default NewStudentPage