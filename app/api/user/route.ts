import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { createUserSchema } from "../../validationSchemas";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = createUserSchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.format(), { status: 400 });

    const newUser = await prisma.user.create({
        data: {
            name: body.name, surname: body.surname,
            username: body.username, password: body.surname,
            email: body.email,
            role: body.role,
        },
    });
    return NextResponse.json(newUser, { status: 201 });
}