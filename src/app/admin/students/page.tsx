import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminStudents() {
  const classes = await prisma.class.findMany({
    include: { students: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-[15px] font-bold">Students</h2>
        <Link href="/admin/students/new" className="px-4 py-2 rounded-xl bg-[#2563eb] text-white text-[12px] font-bold hover:opacity-90">+ Add Student</Link>
      </div>
      {classes.map((cls) => (
        <div key={cls.id} className="bg-white rounded-2xl shadow-sm border border-black/5 mb-4 overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#eff6ff] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div className="text-sm font-bold">{cls.name} {cls.section}</div>
            </div>
            <div className="px-3 py-1 rounded-lg bg-[#eff6ff] text-[#2563eb] text-sm font-bold">{cls.students.length}</div>
          </div>
          {cls.students.length > 0 && (
            <div className="border-t border-gray-100 overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead><tr className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Roll No</th>
                  <th className="text-left px-5 py-3">Name</th>
                  <th className="text-left px-5 py-3">Guardian</th>
                  <th className="text-left px-5 py-3">Gender</th>
                  <th className="text-left px-5 py-3">Phone</th>
                  <th className="text-center px-5 py-3">Actions</th>
                </tr></thead>
                <tbody>
                  {cls.students.map((s) => (
                    <tr key={s.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 text-sm font-mono">{s.rollNumber || "—"}</td>
                      <td className="px-5 py-3"><div className="text-[13px] font-semibold">{s.fullName}</div><div className="text-[11px] text-[#94a3b8]">{s.admissionNumber || ""}</div></td>
                      <td className="px-5 py-3 text-sm">{s.guardianName || "—"}</td>
                      <td className="px-5 py-3 text-sm">{s.gender === "M" ? "Male" : "Female"}</td>
                      <td className="px-5 py-3 text-sm font-mono">{s.phone || "—"}</td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex gap-1 justify-center">
                          <Link href={`/admin/students/${s.id}/edit`} className="px-3 py-1 rounded-lg bg-yellow-50 text-yellow-700 text-[11px] font-bold border border-yellow-200 hover:bg-yellow-100">Edit</Link>
                          <Link href={`/admin/students/${s.id}/delete`} className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-[11px] font-bold border border-red-200 hover:bg-red-100">Delete</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {cls.students.length === 0 && <div className="text-center text-[#94a3b8] text-sm py-8">No students in this class.</div>}
        </div>
      ))}
      {classes.length === 0 && <div className="text-center text-[#94a3b8] text-sm py-12 bg-white rounded-2xl">No classes found.</div>}
    </div>
  );
}
