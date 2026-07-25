import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const classes = await prisma.class.findMany({
    include: { _count: { select: { students: true } }, classTeacher: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(classes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, section, academicYear, classTeacherId } = body;

  const cls = await prisma.class.create({
    data: {
      name,
      section,
      academicYear,
      classTeacherId: classTeacherId ? parseInt(classTeacherId) : null,
    },
  });

  return NextResponse.json(cls, { status: 201 });
}