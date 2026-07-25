import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");
  const date = searchParams.get("date");

  const where: any = {};
  if (classId) where.classId = parseInt(classId);
  if (date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    where.date = { gte: d, lt: next };
  }

  const attendance = await prisma.attendance.findMany({
    where,
    include: { student: true, class: true },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(attendance);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { records } = body; // Array of { studentId, classId, date, status }

  const results = await Promise.all(
    records.map((r: any) =>
      prisma.attendance.upsert({
        where: {
          studentId_classId_date: {
            studentId: parseInt(r.studentId),
            classId: parseInt(r.classId),
            date: new Date(r.date),
          },
        },
        update: { status: r.status },
        create: {
          studentId: parseInt(r.studentId),
          classId: parseInt(r.classId),
          date: new Date(r.date),
          status: r.status,
        },
      })
    )
  );

  return NextResponse.json(results, { status: 201 });
}