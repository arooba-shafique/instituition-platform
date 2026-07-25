import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminClasses() {
  const classes = await prisma.class.findMany({
    include: { _count: { select: { students: true } }, classTeacher: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-[15px] font-bold">Classes</h2>
        <Link href="/admin/classes/new" className="px-4 py-2 rounded-xl bg-[#d97706] text-white text-[12px] font-bold hover:opacity-90">+ Add Class</Link>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead><tr className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider bg-gray-50">
              <th className="text-left px-5 py-3">Class Name</th>
              <th className="text-left px-5 py-3">Section</th>
              <th className="text-left px-5 py-3">Academic Year</th>
              <th className="text-left px-5 py-3">Class Teacher</th>
              <th className="text-left px-5 py-3">Students</th>
              <th className="text-center px-5 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3 text-sm font-semibold">{c.name}</td>
                  <td className="px-5 py-3 text-sm">{c.section || "—"}</td>
                  <td className="px-5 py-3 text-sm">{c.academicYear || "—"}</td>
                  <td className="px-5 py-3 text-sm">{c.classTeacher?.fullName || "—"}</td>
                  <td className="px-5 py-3 text-sm font-bold">{c._count.students}</td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex gap-1 justify-center">
                      <Link href={`/admin/classes/${c.id}/edit`} className="px-3 py-1 rounded-lg bg-yellow-50 text-yellow-700 text-[11px] font-bold border border-yellow-200 hover:bg-yellow-100">Edit</Link>
                      <Link href={`/admin/classes/${c.id}/delete`} className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-[11px] font-bold border border-red-200 hover:bg-red-100">Delete</Link>
                    </div>
                  </td>
                </tr>
              ))}
              {classes.length === 0 && <tr><td colSpan={6} className="text-center text-[#94a3b8] text-sm py-8">No classes found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
