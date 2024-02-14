import React, { useEffect, useState } from 'react'
import NewTeacher from '@/app/components/NewTeacher'

interface Props {
    params: { id: string }
}

const NewTeacherPage = ({ params }: Props) => {

    return (
        <div className='max-w-xl h-full'>
            <NewTeacher params={{ schoolId: params.id }} />
        </div>
    )
}

export default NewTeacherPage