import { authOptions } from "@/app/auth/authOptions";
import { patchPasswordSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { compare, hash } from "bcrypt";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 });

    const body = await request.json();
    const validation = patchPasswordSchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.format(), {
            status: 400,
        });

    const user = await prisma.user.findUnique({
        where: { id: params.id },
    });
    if (!user)
        return NextResponse.json(
            { error: "Invalid User." },
            { status: 400 }
        );

    const isPasswordValid = await compare(
        body.password,
        user.password
    )

    if (!isPasswordValid) {
        return NextResponse.json(
            { error: "Incorrect Password." },
            { status: 401 }
        );
    }
    const newPassword = await hash(body.newPassword, 12)

    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            password: newPassword,
        },
    });

    return NextResponse.json(updatedUser);
}