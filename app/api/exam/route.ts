import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { createExamSchema } from "../../validationSchemas";
import { ExamLevel, ExamStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = createExamSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });
  console.log(body)

  const status = body.videolink ? ExamStatus.TO_BE_EVALUATED : ExamStatus.ONGOING;

  const newExam = await prisma.exam.create({
    data: {
      videoLink: body.videolink,
      level: body.level,
      examDate: new Date(body.date),
      status: status,
      teacher: {
        connect: { id: body.teacherid }
      },
      jury: {
        connect: { id: body.juryid }

      },
      school: {
        connect: { id: body.schoolid }
      }
    },
    include: {
      school: true,
      teacher: true,
      jury: true,
    }
  });
  console.log(body.students)

  body.students.forEach(async (student: any) => {
    if (student === undefined) return;
    const newExamStudents = await prisma.examStudents.create({
      data: {
        student: { connect: { id: student } },
        exam: { connect: { id: newExam.id } }
      }
    });
  });
  return NextResponse.json(newExam, { status: 201 });
}