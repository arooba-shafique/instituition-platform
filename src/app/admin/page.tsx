import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
  const [students, teachers, parents, classes, subjects] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.teacherProfile.count(),
    prisma.parentProfile.count(),
    prisma.class.count(),
    prisma.subject.count(),
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayAttendance = await prisma.attendance.groupBy({
    by: ["status"],
    where: { date: { gte: today, lt: tomorrow } },
    _count: true,
  });

  const present = todayAttendance.find((a) => a.status === "present")?._count || 0;
  const absent = todayAttendance.find((a) => a.status === "absent")?._count || 0;
  const leave = todayAttendance.find((a) => a.status === "leave")?._count || 0;

  return { students, teachers, parents, classes, subjects, present, absent, leave };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    { label: "Students", value: stats.students, color: "#2563eb", bg: "#eff6ff" },
    { label: "Teachers", value: stats.teachers, color: "#16a34a", bg: "#f0fdf4" },
    { label: "Classes", value: stats.classes, color: "#f59e0b", bg: "#fffbeb" },
    { label: "Subjects", value: stats.subjects, color: "#a855f7", bg: "#fdf4ff" },
    { label: "Present Today", value: stats.present, color: "#16a34a", bg: "#f0fdf4" },
    { label: "Absent Today", value: stats.absent, color: "#dc2626", bg: "#fef2f2" },
    { label: "On Leave", value: stats.leave, color: "#d97706", bg: "#fffbeb" },
  ];

  const quickActions = [
    { label: "Add Student", href: "/admin/students/new", color: "bg-[#2563eb]" },
    { label: "Add Teacher", href: "/admin/teachers/new", color: "bg-[#16a34a]" },
    { label: "Add Parent", href: "/admin/parents/new", color: "bg-[#7c3aed]" },
    { label: "Add Class", href: "/admin/classes/new", color: "bg-[#d97706]" },
    { label: "Add Subject", href: "/admin/subjects/new", color: "bg-[#0d9488]" },
    { label: "Assign Teacher", href: "/admin/assignments/new", color: "bg-[#475569]" },
  ];

  return (
    <div>
      <p className="text-[#475569] text-sm mb-5">Welcome back, Admin. Here&apos;s a quick overview.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-black/5 hover:-translate-y-1 transition-transform">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: card.bg }}>
              <div className="w-3 h-3 rounded-full" style={{ background: card.color }} />
            </div>
            <div className="text-2xl font-[Sora] font-extrabold tracking-tight" style={{ color: card.color }}>{card.value}</div>
            <div className="text-[13px] font-semibold text-[#0f172a] mt-1">{card.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">
        <p className="text-[13px] font-bold mb-3">Quick Actions</p>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`px-4 py-2 rounded-xl text-white text-[12px] font-bold ${action.color} hover:opacity-90 transition-opacity`}
            >
              + {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
