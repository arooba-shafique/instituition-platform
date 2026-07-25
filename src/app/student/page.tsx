import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function StudentDashboard() {
  const students = await prisma.studentProfile.findMany({
    include: { studentClass: true, results: { include: { exam: { include: { subject: true } } } } },
  });
  const student = students[0]; // In real app, get from session

  const attendance = student ? await prisma.attendance.findMany({ where: { studentId: student.id } }) : [];
  const present = attendance.filter(a => a.status === "present").length;
  const absent = attendance.filter(a => a.status === "absent").length;
  const leave = attendance.filter(a => a.status === "leave").length;
  const total = present + absent + leave;
  const attPct = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-white/15 p-8 md:p-10 mb-8 bg-gradient-to-br from-[#0f2744] to-[#1a4a7a] text-white">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase text-[#fbbf24] bg-[rgba(217,119,6,.12)] border border-[rgba(217,119,6,.25)] px-3 py-1 rounded-full mb-4">Student Portal</div>
          <div className="font-[Sora] text-2xl md:text-3xl font-extrabold tracking-tight mb-2">Welcome back,<br/><span className="text-[#fbbf24]">{student?.fullName || "Student"}</span></div>
          <div className="text-sm text-white/55">{student?.studentClass.name} {student?.studentClass.section}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5"><div className="text-2xl font-[Sora] font-extrabold text-[#16a34a]">{present}</div><div className="text-sm font-semibold mt-1">Present</div></div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5"><div className="text-2xl font-[Sora] font-extrabold text-[#dc2626]">{absent}</div><div className="text-sm font-semibold mt-1">Absent</div></div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5"><div className="text-2xl font-[Sora] font-extrabold text-[#0d9488]">{leave}</div><div className="text-sm font-semibold mt-1">Leave</div></div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5"><div className="text-2xl font-[Sora] font-extrabold text-[#2563eb]">{attPct}%</div><div className="text-sm font-semibold mt-1">Attendance</div></div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 text-[13.5px] font-bold">Recent Results</div>
        {student?.results && student.results.length > 0 ? student.results.slice(0, 5).map(r => {
          const grade = r.percentage >= 90 ? "A" : r.percentage >= 75 ? "B" : r.percentage >= 60 ? "C" : r.percentage >= 40 ? "D" : "F";
          return (
            <div key={r.id} className="px-5 py-3 flex items-center justify-between border-b border-gray-50 last:border-0">
              <div><div className="text-[13px] font-semibold">{r.exam.name}</div><div className="text-[11px] text-[#94a3b8]">{r.exam.subject.name}</div></div>
              <div className="text-right"><div className="text-sm font-bold font-mono">{r.marksObtained}/{r.exam.totalMarks}</div><div className="text-[11px] text-[#94a3b8]">{r.percentage.toFixed(1)}% · {grade}</div></div>
            </div>
          );
        }) : <div className="text-center text-[#94a3b8] text-sm py-10">No results yet.</div>}
      </div>
    </div>
  );
}
