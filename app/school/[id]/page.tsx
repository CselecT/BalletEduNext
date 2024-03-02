import React from 'react'
import SchoolDetail from '@/app/school/_components/SchoolDetail';

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