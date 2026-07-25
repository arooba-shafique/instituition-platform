import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const exams = await prisma.exam.findMany({
    include: { subject: true, assignedClass: true, createdBy: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(exams);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, subjectId, assignedClassId, examType, totalMarks, date } = body;

  const exam = await prisma.exam.create({
    data: {
      name,
      subjectId: parseInt(subjectId),
      assignedClassId: parseInt(assignedClassId),
      examType,
      totalMarks: parseInt(totalMarks) || 100,
      date: date ? new Date(date) : null,
    },
  });

  return NextResponse.json(exam, { status: 201 });
}