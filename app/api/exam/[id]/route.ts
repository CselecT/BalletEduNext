import { authOptions } from "@/app/auth/authOptions";
import { patchExamSchema } from "@/app/validationSchemas";
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
    const validation = patchExamSchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.format(), {
            status: 400,
        });

    const exam = await prisma.exam.findUnique({
        where: { id: body.id },
    });
    if (!exam)
        return NextResponse.json(
            { error: "Invalid exam." },
            { status: 400 }
        );

    const updatedExam = await prisma.exam.update({
        where: { id: exam.id },
        data: {
            videoLink: body.videolink,
            level: body.level,
            examDate: new Date(body.date),
            status: ExamStatus.ONGOING,
            teacher: {
                connect: { id: body.teacherid }
            },
            jury: {
                connect: { id: body.juryid }

            },
            school: {
                connect: { id: body.schoolid }
            }
        },
        include: {
            school: true,
            teacher: true,
            jury: true,
        }
    });

    return NextResponse.json(updatedExam);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 });

    const exam = await prisma.exam.findUnique({
        where: { id: parseInt(params.id) },
    });

    if (!exam)
        return NextResponse.json(
            { error: "Invalid exam" },
            { status: 404 }
        );

    await prisma.exam.delete({
        where: { id: exam.id },
    });

    return NextResponse.json({});
}