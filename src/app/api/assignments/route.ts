import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const assignments = await prisma.teacherSubjectAssignment.findMany({
    include: { teacher: true, subject: true, assignedClass: true },
  });
  return NextResponse.json(assignments);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { teacherId, subjectId, assignedClassId, academicYear } = body;

  const assignment = await prisma.teacherSubjectAssignment.create({
    data: {
      teacherId: parseInt(teacherId),
      subjectId: parseInt(subjectId),
      assignedClassId: parseInt(assignedClassId),
      academicYear,
    },
  });

  return NextResponse.json(assignment, { status: 201 });
}