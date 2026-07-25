import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create school
  const school = await prisma.school.create({
    data: {
      name: "DPS Ravi",
      address: "Delhi Public School",
      phone: "1234567890",
      email: "admin@school.com",
    },
  });

  // Create admin user
  const adminHash = await bcrypt.hash("admin123", 12);
  const adminUser = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@school.com",
      password: adminHash,
      role: "admin",
      schoolId: school.id,
    },
  });

  // Create a teacher
  const teacherHash = await bcrypt.hash("teacher123", 12);
  const teacherUser = await prisma.user.create({
    data: {
      username: "teacher1",
      email: "teacher@school.com",
      password: teacherHash,
      role: "teacher",
      schoolId: school.id,
    },
  });

  const teacher = await prisma.teacherProfile.create({
    data: {
      userId: teacherUser.id,
      fullName: "Ahmed Khan",
      employeeId: "T001",
      gender: "M",
      phone: "03001234567",
    },
  });

  // Create a class
  const cls = await prisma.class.create({
    data: {
      name: "Class 5",
      section: "A",
      academicYear: "2026",
      classTeacherId: teacher.id,
    },
  });

  // Create subjects
  const math = await prisma.subject.create({ data: { name: "Mathematics", code: "MATH" } });
  const english = await prisma.subject.create({ data: { name: "English", code: "ENG" } });
  const science = await prisma.subject.create({ data: { name: "Science", code: "SCI" } });

  // Assign teacher to subjects
  await prisma.teacherSubjectAssignment.createMany({
    data: [
      { teacherId: teacher.id, subjectId: math.id, assignedClassId: cls.id, academicYear: "2026" },
      { teacherId: teacher.id, subjectId: english.id, assignedClassId: cls.id, academicYear: "2026" },
    ],
  });

  // Create a parent
  const parentHash = await bcrypt.hash("parent123", 12);
  const parentUser = await prisma.user.create({
    data: {
      username: "parent1",
      email: "parent@school.com",
      password: parentHash,
      role: "parent",
      schoolId: school.id,
    },
  });

  const parent = await prisma.parentProfile.create({
    data: {
      userId: parentUser.id,
      fullName: "Ali Raza",
      relation: "father",
      phone: "03009876543",
    },
  });

  // Create students
  const studentHash = await bcrypt.hash("student123", 12);
  const studentUser = await prisma.user.create({
    data: {
      username: "student1",
      email: "student@school.com",
      password: studentHash,
      role: "student",
      schoolId: school.id,
    },
  });

  await prisma.studentProfile.create({
    data: {
      userId: studentUser.id,
      fullName: "Hassan Ali",
      admissionNumber: "ADM001",
      rollNumber: "01",
      studentClassId: cls.id,
      gender: "M",
      guardianName: "Ali Raza",
      parentId: parent.id,
    },
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
