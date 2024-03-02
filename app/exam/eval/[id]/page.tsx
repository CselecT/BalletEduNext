import React, { useState } from 'react'
import prisma from '@/prisma/client';
import EvalExam from '../../_components/EvalExam';

interface Props {
    params: { id: string }
}


const EvalExamPage = async ({ params }: Props) => {


    const exam = await prisma.exam.findUnique({
        where: { id: parseInt(params.id) }
    });

    if (!exam) return (<div>Exam not found</div>);

    const school = await prisma.school.findUnique({
        where: { id: exam.schoolId }
    });

    const examStudents = await prisma.examStudents.findMany({
        where: { examId: exam.id },
    });

    const jury = await prisma.jury.findFirst({
        where: { id: exam.juryId }
    });

    const teacher = await prisma.teacher.findFirst({
        where: { id: exam.teacherId }
    });
    const students = await prisma.student.findMany({
        where: { id: { in: examStudents.map((es) => es.studentId) } }
    });
    return (
        <EvalExam
            params={{
                id: params.id,
                exam: exam,
                school,
                examStudents,
                jury,
                teacher,
                students
            }} />
    )
}

export default EvalExamPage