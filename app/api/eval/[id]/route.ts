import { authOptions } from "@/app/auth/authOptions";
import { patchEvaluationSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { ExamStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 });

    const body = await request.json();
    const validation = patchEvaluationSchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.format(), {
            status: 400,
        });

    const examEval = await prisma.examStudents.findUnique({
        where: { id: body.evalid },
    });
    if (!examEval)
        return NextResponse.json(
            { error: "Invalid examEval." },
            { status: 400 }
        );

    const updatedExamEval = await prisma.examStudents.update({
        where: { id: examEval.id },
        data: {
            eval: body.eval,
            evalTranslate: body.evalTranslation,
            marking: body.marking,
            confirmDate: new Date(body.confirmDate),
        },

    });

    return NextResponse.json(updatedExamEval);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 });

    const examEval = await prisma.examStudents.findUnique({
        where: { id: parseInt(params.id) },
    });

    if (!examEval)
        return NextResponse.json(
            { error: "Invalid examEval" },
            { status: 404 }
        );

    await prisma.exam.delete({
        where: { id: examEval.id },
    });

    return NextResponse.json({});
}