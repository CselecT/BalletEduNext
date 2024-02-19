import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { createEvaluationSchema } from "../../validationSchemas";
import { ExamLevel, ExamStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = createEvaluationSchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.format(), { status: 400 });
    console.log(body)

    const newEval = await prisma.examStudents.create({
        data: {
            eval: body.eval,
            evalTranslate: body.evalTranslation,
            marking: body.marking,
            exam: {
                connect: { id: body.examid }
            },
            student: {
                connect: { id: body.studentid }

            }
        },
        include: {
            student: true,
            exam: true,
        }
    });

    return NextResponse.json(newEval, { status: 201 });
}