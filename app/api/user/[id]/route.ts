import { authOptions } from "@/app/auth/authOptions";
import { patchUserSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { ExamStatus } from "@prisma/client";
import { hash } from "bcrypt";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 });

    const body = await request.json();
    const validation = patchUserSchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.format(), {
            status: 400,
        });

    const user = await prisma.user.findUnique({
        where: { id: params.id },
    });
    if (!user)
        return NextResponse.json(
            { error: "Invalid user." },
            { status: 400 }
        );

    if (body.role === 'JURY' && user.juryId) {
        const jury = await prisma.jury.update({
            where: { id: user.juryId },
            data: {
                name: body.name,
                surname: body.surname,
                birthDate: new Date(body.birthdate),
                email: body.email,
                phone: body.phone,
            },
        });
    } else if (body.role === 'SCHOOL' && user.schoolId) {
        const school = await prisma.school.update({
            where: { id: user.schoolId },
            data: {
                name: body.name,
                location: body.location,
            },
        });

    }

    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            name: body.name,
            surname: body.surname,
            username: body.username,
            email: body.email,
        },
    });

    return NextResponse.json(updatedUser);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 });

    const user = await prisma.user.findUnique({
        where: { id: params.id },

    });

    if (!user)
        return NextResponse.json(
            { error: "Invalid user" },
            { status: 404 }
        );

    if (user.juryId) {
        const jury = await prisma.jury.findUnique({
            where: { id: user.juryId },

        });
        if (jury) {
            await prisma.jury.delete({
                where: { id: jury.id },
            });
        }
    }
    if (user.schoolId) {
        const school = await prisma.school.findUnique({
            where: { id: user.schoolId },

        });
        if (school) {
            await prisma.school.delete({
                where: { id: school.id },
            });
        }
    }
    await prisma.user.delete({
        where: { id: user.id },
    });

    return NextResponse.json({});
}