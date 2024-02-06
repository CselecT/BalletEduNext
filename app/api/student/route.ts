import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { createStudentSchema } from "../../validationSchemas";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = createStudentSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const newSchool = await prisma.student.create({
    data: { name: body.name, surname: body.surname, birthDate: body.birthdate, email: body.email, phone: body.phone,
            schoolId: body.schoolId}
  });

  return NextResponse.json(newSchool, { status: 201 });
}