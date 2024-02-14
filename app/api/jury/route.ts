import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { createJurySchema } from "../../validationSchemas";
import { hash } from 'bcrypt'

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = createJurySchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const password = await hash(body.password, 12)
  console.log({ password })
  try {
    const newUser = await prisma.user.create({
      data: {
        username: body.username, password: password, email: body.email, role: 'JURY', name: body.name,
        surname: body.surname,
      }
    });

    const newJury = await prisma.jury.create({
      data: {
        name: body.name,
        surname: body.surname,
        birthDate: new Date(body.birthdate),
        email: body.email,
        phone: body.phone,
        accountId: newUser.id
      }
    });
    await prisma.user.update({
      where: { id: newUser.id },
      data: { juryId: newJury.id }
    })
    return NextResponse.json(newJury, { status: 201 });

  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }

}