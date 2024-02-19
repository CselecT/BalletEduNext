import { authOptions } from "@/app/auth/authOptions";
import { patchSchoolSchema } from "@/app/validationSchemas";
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
    const validation = patchSchoolSchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.format(), {
            status: 400,
        });

    const school = await prisma.school.findUnique({
        where: { id: body.schoolid },
    });
    if (!school)
        return NextResponse.json(
            { error: "Invalid school." },
            { status: 400 }
        );

    const updatedSchool = await prisma.school.update({
        where: { id: school.id },
        data: {
            name: body.name, location: body.location
        }
    });

    return NextResponse.json(updatedSchool);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 });

    const school = await prisma.school.findUnique({
        where: { id: parseInt(params.id) },
    });

    if (!school)
        return NextResponse.json(
            { error: "Invalid school" },
            { status: 404 }
        );
    const user = await prisma.user.findUnique({
        where: { id: school.accountId },
    });
    await prisma.school.delete({
        where: { id: school.id },
    });
    if (user) {
        await prisma.user.delete({
            where: { id: user?.id },
        });
    }


    return NextResponse.json({});
}