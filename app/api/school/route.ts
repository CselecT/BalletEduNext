import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { createSchoolSchema } from "../../validationSchemas";
import { hash } from 'bcrypt'

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = createSchoolSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const password = await hash(body.password, 12)

  const newUser = await prisma.user.create({
    data: {
      username: body.username, password: password, email: body.email, role: 'SCHOOL', name: body.name,
      surname: body.surname,
    }
  });
  const newSchool = await prisma.school.create({
    data: { name: body.name, location: body.location, accountId: newUser.id }
  });

  await prisma.user.update({
    where: { id: newUser.id },
    data: { schoolId: newSchool.id }
  })

  return NextResponse.json(newSchool, { status: 201 });
}