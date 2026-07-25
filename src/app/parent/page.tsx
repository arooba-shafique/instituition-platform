import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ParentDashboard() {
  const parents = await prisma.parentProfile.findMany({
    include: { students: { include: { studentClass: true, results: { include: { exam: { include: { subject: true } } } }, attendance: true } } },
  });
  const parent = parents[0];

  const students = parent?.students || [];
  const allResults = students.flatMap(s => s.results.map(r => ({ ...r, studentName: s.fullName })));
  const allAttendance = students.flatMap(s => s.attendance.map(a => ({ ...a, studentName: s.fullName })));
  const present = allAttendance.filter(a => a.status === "present").length;
  const total = allAttendance.length;
  const attPct = total > 0 ? Math.round((present / total) * 100) : 0;

  const totalExams = new Set(allResults.map(r => r.examId)).size;

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-white/15 p-8 md:p-10 mb-8 bg-gradient-to-br from-[#0f2744] to-[#1a4a7a] text-white">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase text-[#fbbf24] bg-[rgba(217,119,6,.12)] border border-[rgba(217,119,6,.25)] px-3 py-1 rounded-full mb-4">Parent Portal</div>
          <div className="font-[Sora] text-2xl md:text-3xl font-extrabold tracking-tight mb-2">Welcome back,<br/><span className="text-[#fbbf24]">{parent?.fullName || "Parent"}</span></div>
          <div className="text-sm text-white/55">Tracking {students.length} child{students.length !== 1 ? "ren" : ""}</div>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 z-10">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/6 border border-white/10 backdrop-blur-sm"><div className="font-[Sora] text-xl font-extrabold text-[#fbbf24]">{students.length}</div><div className="text-[10px] text-white/40">Children</div></div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/6 border border-white/10 backdrop-blur-sm"><div className="font-[Sora] text-xl font-extrabold text-[#60a5fa]">{totalExams}</div><div className="text-[10px] text-white/40">Exams</div></div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5"><div className="text-2xl font-[Sora] font-extrabold text-[#d97706]">{students.length}</div><div className="text-sm font-semibold mt-1">Children</div></div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5"><div className="text-2xl font-[Sora] font-extrabold text-[#0d9488]">{attPct}%</div><div className="text-sm font-semibold mt-1">Avg Attendance</div></div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5"><div className="text-2xl font-[Sora] font-extrabold text-[#2563eb]">{totalExams}</div><div className="text-sm font-semibold mt-1">Exams</div></div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5"><div className="text-2xl font-[Sora] font-extrabold text-[#e11d48]">{allResults.length}</div><div className="text-sm font-semibold mt-1">Results</div></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 text-[13.5px] font-bold">Recent Results</div>
          {allResults.length > 0 ? allResults.slice(0, 5).map(r => {
            const grade = r.percentage >= 90 ? "A" : r.percentage >= 75 ? "B" : r.percentage >= 60 ? "C" : r.percentage >= 40 ? "D" : "F";
            return (
              <div key={r.id} className="px-5 py-3 flex items-center justify-between border-b border-gray-50 last:border-0">
                <div><div className="text-[13px] font-semibold">{r.exam.name}</div><div className="text-[11px] text-[#94a3b8]">{r.studentName} · {r.exam.subject.name}</div></div>
                <div className="text-right"><div className="w-7 h-7 rounded-lg bg-green-100 text-green-700 text-xs font-extrabold flex items-center justify-center">{grade}</div><div className="text-[10px] text-[#94a3b8] font-mono mt-1">{r.percentage.toFixed(0)}%</div></div>
              </div>
            );
          }) : <div className="text-center text-[#94a3b8] text-sm py-10">No results yet.</div>}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 text-[13.5px] font-bold">My Children</div>
          {students.length > 0 ? students.map(s => (
            <div key={s.id} className="px-5 py-4 flex items-center gap-3 border-b border-gray-50 last:border-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d97706] to-[#14b8a6] flex items-center justify-center text-white font-bold text-sm">{s.fullName[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold">{s.fullName}</div>
                <div className="text-[11px] text-[#94a3b8]">{s.studentClass.name} · Roll: {s.rollNumber || "N/A"}</div>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#eff6ff] text-[#2563eb]">{s.studentClass.name}</span>
            </div>
          )) : <div className="text-center text-[#94a3b8] text-sm py-10">No children linked.</div>}
        </div>
      </div>
    </div>
  );
}
