import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { $Enums, ExamLevel, ExamStatus } from "@prisma/client";
import { evaluateExamSchema } from "@/app/validationSchemas";

export async function PATCH(request: NextRequest) {
    let evalsReturn: ({ exam: { id: number; level: $Enums.ExamLevel; examDate: Date; evalDate: Date | null; status: $Enums.ExamStatus; teacherId: number; juryId: number; schoolId: number; videoLink: string | null; examEval: string | null; }; student: { id: number; name: string; surname: string; birthDate: Date; email: string | null; phone: string | null; schoolId: number; }; } & { id: number; examId: number; studentId: number; marking: number | null; eval: string | null; evalTranslate: string | null; evalDate: Date | null; confirmDate: Date | null; })[] = [];
    const body = await request.json();
    const validation = evaluateExamSchema.safeParse(body);
    if (!validation.success) {
        console.log(body)
        return NextResponse.json(validation.error.format(), { status: 400 });
    }

    body.evals.forEach(async (evaluation: any) => {
        if (evaluation === undefined) return;
        const oldEval = await prisma.examStudents.findFirst({
            where: {
                examId: body.examId,
                studentId: evaluation.studentid
            }
        });
        if (oldEval) {
            const updatedEval = await prisma.examStudents.update({
                where: { id: oldEval.id },
                data: {
                    eval: evaluation.eval,
                    evalTranslate: evaluation.evalTranslate,
                    marking: evaluation.marking,
                    exam: {
                        connect: { id: body.examId }
                    },
                    student: {
                        connect: { id: evaluation.studentid }
                    }
                },
                include: {
                    student: true,
                    exam: true,
                }
            });
            evalsReturn.push(updatedEval);
        }
    }
    );
    const updatedExam = await prisma.exam.update({
        where: { id: body.examId },
        data: {
            evalDate: new Date(),
            examEval: body.examEval,
            status: ExamStatus.REVIEW
        }
    });
    console.log(body.students)


    return NextResponse.json({ evals: evalsReturn, exam: updatedExam }, { status: 201 });
}