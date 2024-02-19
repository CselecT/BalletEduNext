import { authOptions } from "@/app/auth/authOptions";
import { patchStudentSchema } from "@/app/validationSchemas";
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
    const validation = patchStudentSchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.format(), {
            status: 400,
        });

    const student = await prisma.student.findUnique({
        where: { id: body.studentid },
    });
    if (!student)
        return NextResponse.json(
            { error: "Invalid student." },
            { status: 400 }
        );

    const updatedStudent = await prisma.student.update({
        where: { id: student.id },
        data: {
            name: body.name, surname: body.surname,
            birthDate: new Date(body.birthdate),
            email: body.email,
            phone: body.phone,
        }
    });

    return NextResponse.json(updatedStudent);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 });

    const student = await prisma.student.findUnique({
        where: { id: parseInt(params.id) },
    });

    if (!student)
        return NextResponse.json(
            { error: "Invalid student" },
            { status: 404 }
        );

    await prisma.student.delete({
        where: { id: student.id },
    });

    return NextResponse.json({});
}