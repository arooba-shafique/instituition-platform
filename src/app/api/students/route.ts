import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const students = await prisma.studentProfile.findMany({
    include: { studentClass: true, parent: true, user: true },
    orderBy: { fullName: "asc" },
  });
  return NextResponse.json(students);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fullName, admissionNumber, rollNumber, studentClassId, dateOfBirth, gender, phone, address, guardianName, parentId } = body;

  const password = await bcrypt.hash("student123", 12);
  const username = fullName.toLowerCase().replace(/\s+/g, "") + Math.floor(Math.random() * 1000);

  const user = await prisma.user.create({
    data: { username, password, role: "student" },
  });

  const student = await prisma.studentProfile.create({
    data: {
      userId: user.id,
      fullName,
      admissionNumber,
      rollNumber,
      studentClassId: parseInt(studentClassId),
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender,
      phone,
      address,
      guardianName,
      parentId: parentId ? parseInt(parentId) : null,
    },
  });

  return NextResponse.json(student, { status: 201 });
}