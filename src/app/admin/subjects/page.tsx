import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminSubjects() {
  const subjects = await prisma.subject.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-[15px] font-bold">Subjects</h2>
        <Link href="/admin/subjects/new" className="px-4 py-2 rounded-xl bg-[#0d9488] text-white text-[12px] font-bold hover:opacity-90">+ Add Subject</Link>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <table className="w-full">
          <thead><tr className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider bg-gray-50">
            <th className="text-left px-5 py-3">Name</th>
            <th className="text-left px-5 py-3">Code</th>
            <th className="text-center px-5 py-3">Actions</th>
          </tr></thead>
          <tbody>
            {subjects.map((s) => (
              <tr key={s.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 text-sm font-semibold">{s.name}</td>
                <td className="px-5 py-3 text-sm font-mono">{s.code || "—"}</td>
                <td className="px-5 py-3 text-center">
                  <div className="flex gap-1 justify-center">
                    <Link href={`/admin/subjects/${s.id}/edit`} className="px-3 py-1 rounded-lg bg-yellow-50 text-yellow-700 text-[11px] font-bold border border-yellow-200 hover:bg-yellow-100">Edit</Link>
                    <Link href={`/admin/subjects/${s.id}/delete`} className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-[11px] font-bold border border-red-200 hover:bg-red-100">Delete</Link>
                  </div>
                </td>
              </tr>
            ))}
            {subjects.length === 0 && <tr><td colSpan={3} className="text-center text-[#94a3b8] text-sm py-8">No subjects found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
