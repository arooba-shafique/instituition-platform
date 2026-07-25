import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminTeachers() {
  const teachers = await prisma.teacherProfile.findMany({
    include: { assignments: { include: { subject: true, assignedClass: true } } },
    orderBy: { fullName: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-[15px] font-bold">All Teachers</h2>
        <Link href="/admin/teachers/new" className="px-4 py-2 rounded-xl bg-[#16a34a] text-white text-[12px] font-bold hover:opacity-90">+ Add Teacher</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
            <div className="p-5 flex items-center gap-3 border-b border-gray-100">
              <div className="w-11 h-11 rounded-full bg-[#16a34a] flex items-center justify-center text-white text-lg font-bold">{t.fullName[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[14.5px] font-bold truncate">{t.fullName}</div>
                <div className="text-[11px] text-[#94a3b8]">ID: {t.employeeId || "Not assigned"}</div>
              </div>
              <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${t.gender === "M" ? "bg-[#eff6ff] text-[#2563eb]" : "bg-[#fdf4ff] text-[#9333ea]"}`}>{t.gender === "M" ? "Male" : "Female"}</span>
            </div>
            <div className="p-4">
              <div className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Assigned Subjects</div>
              {t.assignments.length > 0 ? t.assignments.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <div className="text-[13px] font-semibold">{a.subject.name}</div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#f0fdf4] text-[#16a34a]">{a.assignedClass.name} {a.assignedClass.section}</span>
                </div>
              )) : <div className="text-[12px] text-[#94a3b8]">No subjects assigned.</div>}
            </div>
            <div className="px-5 py-3 flex gap-2 border-t border-gray-100">
              <Link href={`/admin/teachers/${t.id}/edit`} className="px-3 py-1 rounded-lg bg-yellow-50 text-yellow-700 text-[11px] font-bold border border-yellow-200 hover:bg-yellow-100">Edit</Link>
              <Link href={`/admin/teachers/${t.id}/delete`} className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-[11px] font-bold border border-red-200 hover:bg-red-100">Delete</Link>
            </div>
          </div>
        ))}
        {teachers.length === 0 && <div className="col-span-full text-center text-[#94a3b8] text-sm py-12">No teachers found.</div>}
      </div>
    </div>
  );
}
