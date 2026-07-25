import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const parents = await prisma.parentProfile.findMany({
    include: { students: { include: { studentClass: true } } },
    orderBy: { fullName: "asc" },
  });
  return NextResponse.json(parents);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fullName, relation, phone, email } = body;

  const password = await bcrypt.hash("parent123", 12);
  const username = fullName.toLowerCase().replace(/\s+/g, "") + Math.floor(Math.random() * 1000);

  const user = await prisma.user.create({
    data: { username, password, role: "parent", email },
  });

  const parent = await prisma.parentProfile.create({
    data: { userId: user.id, fullName, relation, phone, email },
  });

  return NextResponse.json(parent, { status: 201 });
}