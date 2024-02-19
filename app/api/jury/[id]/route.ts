import { authOptions } from "@/app/auth/authOptions";
import { patchJurySchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 });

    const body = await request.json();
    const validation = patchJurySchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.format(), {
            status: 400,
        });

    const jury = await prisma.jury.findUnique({
        where: { id: body.juryid },
    });
    if (!jury)
        return NextResponse.json(
            { error: "Invalid jury." },
            { status: 400 }
        );

    const updatedJury = await prisma.jury.update({
        where: { id: jury.id },
        data: {
            name: body.name,
            surname: body.surname,
            birthDate: new Date(body.birthdate),
            email: body.email,
            phone: body.phone,
        }
    });

    return NextResponse.json(updatedJury);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 });
    const jury = await prisma.jury.findUnique({
        where: { id: parseInt(params.id) },
    });
    if (!jury)
        return NextResponse.json(
            { error: "Invalid jury" },
            { status: 404 }
        );
    const user = await prisma.user.findUnique({
        where: { id: jury.accountId },
    });
    await prisma.jury.delete({
        where: { id: jury.id },
    });
    if (user) {
        await prisma.user.delete({
            where: { id: user?.id },
        });
    }
    return NextResponse.json({});
}