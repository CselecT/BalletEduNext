import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { createTeacherSchema } from "../../validationSchemas";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = createTeacherSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const newTeacher = await prisma.teacher.create({
    data: {
      name: body.name, surname: body.surname,
      birthDate: new Date(body.birthdate),
      email: body.email,
      phone: body.phone,
      school: {
        connect: {
          id: body.schoolid
        }
      }
    },
    include: {
      school: true
    }
  });
  return NextResponse.json(newTeacher, { status: 201 });
}