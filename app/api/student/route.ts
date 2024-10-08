import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { createStudentSchema } from "../../validationSchemas";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = createStudentSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const newStudent = await prisma.student.create({
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
  return NextResponse.json(newStudent, { status: 201 });
}