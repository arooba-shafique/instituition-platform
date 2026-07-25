import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminParents() {
  const parents = await prisma.parentProfile.findMany({
    include: { students: { include: { studentClass: true } } },
    orderBy: { fullName: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-[15px] font-bold">All Parents</h2>
        <Link href="/admin/parents/new" className="px-4 py-2 rounded-xl bg-[#7c3aed] text-white text-[12px] font-bold hover:opacity-90">+ Add Parent</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parents.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
            <div className="p-5 flex items-center gap-3 border-b border-gray-100">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white text-lg font-bold ${p.relation === "father" ? "bg-[#2563eb]" : p.relation === "mother" ? "bg-[#9333ea]" : "bg-[#d97706]"}`}>{p.fullName[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[14.5px] font-bold truncate">{p.fullName}</div>
                <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${p.relation === "father" ? "bg-[#eff6ff] text-[#2563eb]" : p.relation === "mother" ? "bg-[#fdf4ff] text-[#9333ea]" : "bg-[#fffbeb] text-[#d97706]"}`}>{p.relation}</span>
              </div>
              <div className="text-sm text-[#475569]">{p.phone || "—"}</div>
            </div>
            <div className="p-4">
              <div className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Children ({p.students.length})</div>
              {p.students.map((s) => (
                <div key={s.id} className="flex items-center gap-2.5 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[11px] font-bold text-[#475569]">{s.fullName[0]}</div>
                  <div className="min-w-0 flex-1"><div className="text-[13px] font-semibold truncate">{s.fullName}</div></div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#f0fdf4] text-[#16a34a]">{s.studentClass.name}</span>
                </div>
              ))}
              {p.students.length === 0 && <div className="text-[12px] text-[#94a3b8]">No children linked.</div>}
            </div>
            <div className="px-5 py-3 flex gap-2 border-t border-gray-100">
              <Link href={`/admin/parents/${p.id}/edit`} className="px-3 py-1 rounded-lg bg-yellow-50 text-yellow-700 text-[11px] font-bold border border-yellow-200 hover:bg-yellow-100">Edit</Link>
              <Link href={`/admin/parents/${p.id}/delete`} className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-[11px] font-bold border border-red-200 hover:bg-red-100">Delete</Link>
            </div>
          </div>
        ))}
        {parents.length === 0 && <div className="col-span-full text-center text-[#94a3b8] text-sm py-12">No parents found.</div>}
      </div>
    </div>
  );
}
