import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const teachers = await prisma.teacherProfile.findMany({
    include: { assignments: { include: { subject: true, assignedClass: true } } },
    orderBy: { fullName: "asc" },
  });
  return NextResponse.json(teachers);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fullName, employeeId, gender, phone, joiningDate } = body;

  const password = await bcrypt.hash("teacher123", 12);
  const username = fullName.toLowerCase().replace(/\s+/g, "") + Math.floor(Math.random() * 1000);

  const user = await prisma.user.create({
    data: { username, password, role: "teacher" },
  });

  const teacher = await prisma.teacherProfile.create({
    data: {
      userId: user.id,
      fullName,
      employeeId,
      gender,
      phone,
      joiningDate: joiningDate ? new Date(joiningDate) : null,
    },
  });

  return NextResponse.json(teacher, { status: 201 });
}