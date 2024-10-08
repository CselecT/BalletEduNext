import React from 'react'
import prisma from '@/prisma/client';
import { Flex, Heading, Table, Text } from '@radix-ui/themes';
import DeleteExamButton from '../_components/DeleteExamButton';
import TranslateExamButton from '../_components/TranslateExamButton';
import EditExam from '../_components/EditExam';
import Spinner from '@/app/components/Spinner';

interface Props {
    params: { id: string }
}

const ExamDetail = async ({ params }: Props) => {

    const exam = await prisma.exam.findUnique({
        where: { id: parseInt(params.id) }
    });

    if (!exam) return (<div>Exam not found</div>);

    const school = await prisma.school.findUnique({
        where: { id: exam.schoolId }
    });


    const examStudents = await prisma.examStudents.findMany({
        where: { examId: exam.id },
        include: { student: true }
    });

    examStudents.sort((a, b) => a.studentOrder - b.studentOrder);

    const studentIds = examStudents.map(examStudent => examStudent.studentId);

    const examTakingStudents = await prisma.student.findMany({
        where: { id: { in: studentIds } }
    });

    const jury = await prisma.jury.findFirst({
        where: { id: exam.juryId }
    });

    const teacher = await prisma.teacher.findFirst({
        where: { id: exam.teacherId }
    });

    const students = await prisma.student.findMany({
        where: { schoolId: exam.schoolId }
    });

    const teachers = await prisma.teacher.findMany({
        where: { schoolId: exam.schoolId }
    });

    const juries = await prisma.jury.findMany();

    return (
        <div className='mb-5 flex flex-col content-between gap-4'>

            {exam &&
                <Table.Root variant='surface'>
                    <Table.Body>
                        <Table.Row>
                            <Table.ColumnHeaderCell>School:</Table.ColumnHeaderCell>
                            {school && <Table.RowHeaderCell>{school.name}</Table.RowHeaderCell>}
                        </Table.Row>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Date:</Table.ColumnHeaderCell>
                            <Table.RowHeaderCell>{exam.examDate.toDateString()}</Table.RowHeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Level:</Table.ColumnHeaderCell>
                            <Table.RowHeaderCell>{exam.level.replace('k', '').replaceAll('_', ' ')}</Table.RowHeaderCell>
                        </Table.Row><Table.Row>
                            <Table.ColumnHeaderCell>Teacher:</Table.ColumnHeaderCell>
                            {teacher && <Table.RowHeaderCell>{teacher.name + ' ' + teacher.surname}</Table.RowHeaderCell>}
                        </Table.Row><Table.Row>
                            <Table.ColumnHeaderCell>Jury:</Table.ColumnHeaderCell>
                            {jury && <Table.RowHeaderCell>{jury.name + ' ' + jury.surname}</Table.RowHeaderCell>}
                        </Table.Row>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Video Link:</Table.ColumnHeaderCell>
                            {exam && <Table.RowHeaderCell>{exam.videoLink}</Table.RowHeaderCell>}
                        </Table.Row>
                    </Table.Body>
                </Table.Root>}
            <Table.Root variant='surface'>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Order</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Surname</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Marking</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Evaluation</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Translation</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {examStudents && examStudents.map(examStudent => (

                        <Table.Row key={examStudent.id}>
                            <Table.RowHeaderCell>{examStudent.studentOrder}</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{examStudent.student.name}</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{examStudent.student.surname}</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{examStudent.marking}</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{examStudent.eval}</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{examStudent.evalTranslate}</Table.RowHeaderCell>
                        </Table.Row>
                    ))}
                    {examStudents.length === 0 && <Spinner />}
                </Table.Body>
            </Table.Root>
            <Heading mb="2" size="4">General Evaluation</Heading>
            <Text>{exam.examEval}</Text>
            <Heading mb="2" size="4">General Evaluation Translation</Heading>
            <Text>{exam.examEvalTranslate}</Text>
            <Flex gap="3" justify="end">
                <DeleteExamButton examId={exam.id} />
                <TranslateExamButton examId={exam.id} />
                {(exam.status === 'ONGOING' || exam.status === 'TO_BE_EVALUATED') &&
                    <EditExam params={{ exam: exam, students: students, teachers, juries, examTakers: examTakingStudents, examTakingStudentsOrders: examStudents }} />
                }
            </Flex>
        </div>
    )
}

export default ExamDetail