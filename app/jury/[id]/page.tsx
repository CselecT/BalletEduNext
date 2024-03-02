import React from 'react'
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