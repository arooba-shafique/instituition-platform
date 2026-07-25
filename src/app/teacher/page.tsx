import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TeacherDashboard() {
  const teachers = await prisma.teacherProfile.findMany({ include: { assignments: { include: { subject: true, assignedClass: true } } } });
  const teacher = teachers[0]; // In real app, get from session

  const assignedClasses = teacher ? (teacher.assignments as any[]).reduce((acc: any[], a: any) => { if (!acc.find((c: any) => c.id === a.assignedClass.id)) acc.push(a.assignedClass); return acc; }, []) : [];
  const mySubjects = teacher ? (teacher.assignments as any[]).reduce((acc: any[], a: any) => { if (!acc.find((s: any) => s.id === a.subject.id)) acc.push(a.subject); return acc; }, []) : [];

  const hometasks = await prisma.homeTask.findMany({
    where: teacher ? { createdById: teacher.userId } : {},
    include: { subject: true, assignedClass: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-white/15 p-8 md:p-10 mb-8 bg-gradient-to-br from-[#0f2744] to-[#1a4a7a] text-white">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase text-[#14b8a6] bg-[rgba(20,184,166,.12)] border border-[rgba(20,184,166,.25)] px-3 py-1 rounded-full mb-4">Teacher Portal</div>
          <div className="font-[Sora] text-2xl md:text-3xl font-extrabold tracking-tight mb-2">Welcome back,<br/><span className="text-[#14b8a6]">{teacher?.fullName || "Teacher"}</span></div>
          <div className="text-sm text-white/55">{mySubjects.map(s => s.name).join(", ") || "No subjects assigned"}</div>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 z-10">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/6 border border-white/10 backdrop-blur-sm"><div className="font-[Sora] text-xl font-extrabold text-[#14b8a6]">{assignedClasses.length}</div><div className="text-[10px] text-white/40">Classes</div></div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/6 border border-white/10 backdrop-blur-sm"><div className="font-[Sora] text-xl font-extrabold text-[#60a5fa]">{mySubjects.length}</div><div className="text-[10px] text-white/40">Subjects</div></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <div className="text-[13.5px] font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#0d9488]"/>Recent Home Tasks</div>
          </div>
          {hometasks.length === 0 ? <div className="text-center text-[#94a3b8] text-sm py-10">No tasks uploaded yet.</div> :
            hometasks.map(t => (
              <div key={t.id} className="px-5 py-3.5 flex items-center gap-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(13,148,136,.1)]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div className="flex-1 min-w-0"><div className="text-[13.5px] font-semibold truncate">{t.title}</div><div className="text-[11.5px] text-[#94a3b8]">{t.assignedClass.name} · {t.subject.name}</div></div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-600">Due {new Date(t.dueDate).toLocaleDateString()}</span>
              </div>
            ))
          }
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
            <div className="text-[13.5px] font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#14b8a6]"/>My Classes</div>
          </div>
          {assignedClasses.length === 0 ? <div className="text-center text-[#94a3b8] text-sm py-10">No classes assigned.</div> :
            assignedClasses.map((cls: any) => (
              <div key={cls.id} className="px-5 py-3.5 flex items-center justify-between border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <div>
                  <div className="text-[13.5px] font-semibold">{cls.name} {cls.section}</div>
                  <div className="text-[11.5px] text-[#94a3b8]">{cls.academicYear || "—"}</div>
                </div>
                <span className="text-[12px] font-bold text-[#2563eb]">{cls._count?.students || 0} students</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
