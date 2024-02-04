import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { createSchoolSchema } from "../../validationSchemas";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = createSchoolSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const newSchool = await prisma.school.create({
    data: { name: body.name, location: body.location }
  });

  return NextResponse.json(newSchool, { status: 201 });
}