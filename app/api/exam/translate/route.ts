import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { $Enums, ExamLevel, ExamStatus } from "@prisma/client";
import { translateExamSchema } from "@/app/validationSchemas";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = translateExamSchema.safeParse(body);
    if (!validation.success) {
        console.log(body)
        return NextResponse.json(validation.error.format(), { status: 400 });
    }

    body.translations.forEach(async (translation: any) => {
        if (translation === undefined) return;

        const translatedEval = await prisma.examStudents.update({
            where: { id: translation.evalid },
            data: {
                evalTranslate: translation.evalTranslation,
            }
        });
    }
    );

    const updatedExam = await prisma.exam.update({
        where: { id: body.examId },
        data: {
            updateDate: new Date(),
            examEvalTranslate: body.examEvalTranslation,
            status: ExamStatus.COMPLETED
        }
    });

    return NextResponse.json({ exam: updatedExam }, { status: 201 });
}