import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");

  const where: any = {};
  if (classId) where.assignedClassId = parseInt(classId);

  const slots = await prisma.timetableSlot.findMany({
    where,
    include: { assignedClass: true, subject: true, teacher: true },
    orderBy: [{ day: "asc" }, { startTime: "asc" }],
  });
  return NextResponse.json(slots);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slots } = body;

  const results = await Promise.all(
    slots.map((s: any) =>
      prisma.timetableSlot.upsert({
        where: {
          assignedClassId_day_periodLabel: {
            assignedClassId: parseInt(s.assignedClassId),
            day: s.day,
            periodLabel: s.periodLabel,
          },
        },
        update: {
          startTime: s.startTime,
          endTime: s.endTime,
          subjectId: s.subjectId ? parseInt(s.subjectId) : null,
          teacherId: s.teacherId ? parseInt(s.teacherId) : null,
        },
        create: {
          assignedClassId: parseInt(s.assignedClassId),
          day: s.day,
          periodLabel: s.periodLabel,
          startTime: s.startTime,
          endTime: s.endTime,
          subjectId: s.subjectId ? parseInt(s.subjectId) : null,
          teacherId: s.teacherId ? parseInt(s.teacherId) : null,
        },
      })
    )
  );

  return NextResponse.json(results, { status: 201 });
}