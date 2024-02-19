import { authOptions } from "@/app/auth/authOptions";
import { patchTeacherSchema } from "@/app/validationSchemas";
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
    const validation = patchTeacherSchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.format(), {
            status: 400,
        });

    const teacher = await prisma.teacher.findUnique({
        where: { id: body.teacherid },
    });
    if (!teacher)
        return NextResponse.json(
            { error: "Invalid teacher." },
            { status: 400 }
        );

    const updatedTeacher = await prisma.teacher.update({
        where: { id: teacher.id },
        data: {
            name: body.name, surname: body.surname,
            birthDate: new Date(body.birthdate),
            email: body.email,
            phone: body.phone,
        },

    });

    return NextResponse.json(updatedTeacher);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 });

    const teacher = await prisma.teacher.findUnique({
        where: { id: parseInt(params.id) },
    });

    if (!teacher)
        return NextResponse.json(
            { error: "Invalid teacher" },
            { status: 404 }
        );

    await prisma.teacher.delete({
        where: { id: teacher.id },
    });

    return NextResponse.json({});
}