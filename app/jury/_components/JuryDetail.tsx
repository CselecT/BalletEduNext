import React from 'react'
import prisma from '@/prisma/client';
import { Avatar, Box, Button, Card, Flex, Link, Table } from '@radix-ui/themes';
import { ExamStatus } from '@prisma/client';

interface Props {
    params: { id: string }
}

const JuryDetail = async ({ params }: Props) => {

    const juryId = params.id;

    const exams = await prisma.exam.findMany({
        where: { juryId: parseInt(juryId) }
    });

    const jury = await prisma.jury.findUnique({
        where: { id: parseInt(juryId) }
    });

    return (
        <div className=" flex flex-col content-between gap-4">
            <div className='mb-5 flex flex-col content-between gap-4'>
                {jury && <Card style={{ maxWidth: 240 }}>
                    <Flex gap="3" align="center">
                        <Avatar
                            size="3"
                            src="/winner.png"
                            radius="full"
                            fallback="S"
                        />
                        <Box>
                            <strong>
                                {jury.name + ' ' + jury.surname}
                            </strong>

                        </Box>
                    </Flex>
                </Card>}
            </div>

            {exams?.length === 0 && <div>No exams found</div>}
            {exams?.length && exams.length > 0 && <Table.Root variant='surface'>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Exam Date</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Exam Level</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Exam Status</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Exam Details</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Exam Evaluation</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {exams.map(exam => (
                        <Table.Row key={exam.id}>
                            <Table.RowHeaderCell>{exam.examDate.toDateString()}</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{exam.level.toString().replaceAll('_', ' ').replace('k', '')}</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{exam.status}</Table.RowHeaderCell>
                            <Table.Cell><Button variant="surface"><Link href={'/exam/' + exam.id}>Exam Details</Link></Button></Table.Cell>
                            {<Table.Cell>
                                <Button variant="surface"
                                    disabled={exam.status !== ExamStatus.TO_BE_EVALUATED}>
                                    {exam.status === ExamStatus.TO_BE_EVALUATED ? (
                                        <Link href={'/exam/eval/' + exam.id}>Evaluate Exam</Link>
                                    ) : (
                                        'Evaluate Exam'
                                    )}</Button>
                            </Table.Cell>
                            }
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>}
        </div>
    )
}

export default JuryDetail