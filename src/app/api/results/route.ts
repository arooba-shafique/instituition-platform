import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const results = await prisma.result.findMany({
    include: { exam: { include: { subject: true, assignedClass: true } }, student: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { examId, studentId, marksObtained, remarks } = body;

  const exam = await prisma.exam.findUnique({ where: { id: parseInt(examId) } });
  const percentage = exam ? (parseInt(marksObtained) / exam.totalMarks) * 100 : 0;
  const grade = percentage >= 90 ? "A" : percentage >= 75 ? "B" : percentage >= 60 ? "C" : percentage >= 40 ? "D" : "F";

  const result = await prisma.result.create({
    data: {
      examId: parseInt(examId),
      studentId: parseInt(studentId),
      marksObtained: parseInt(marksObtained),
      percentage,
      grade,
      remarks,
    },
  });

  return NextResponse.json(result, { status: 201 });
}