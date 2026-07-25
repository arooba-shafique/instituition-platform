import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminTimetable() {
  const classes = await prisma.class.findMany({ orderBy: { name: "asc" } });
  const slots = await prisma.timetableSlot.findMany({
    include: { assignedClass: true, subject: true, teacher: true },
    orderBy: [{ day: "asc" }, { startTime: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[15px] font-bold">Timetable</h2>
        <span className="text-[11.5px] text-[#0d9488] font-semibold bg-[#f0fdfa] border border-[#99f6e4] px-3 py-1 rounded-full">View Only</span>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden p-5">
        {slots.length === 0 ? (
          <div className="text-center text-[#94a3b8] text-sm py-8">No timetable entries found. Teachers and admins can manage timetable from their dashboards.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead><tr className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider bg-gray-50">
                <th className="text-left px-4 py-3">Day</th>
                <th className="text-left px-4 py-3">Period</th>
                <th className="text-left px-4 py-3">Time</th>
                <th className="text-left px-4 py-3">Class</th>
                <th className="text-left px-4 py-3">Subject</th>
                <th className="text-left px-4 py-3">Teacher</th>
              </tr></thead>
              <tbody>
                {slots.map((s) => (
                  <tr key={s.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm font-semibold">{s.day}</td>
                    <td className="px-4 py-3 text-sm">{s.periodLabel || "—"}</td>
                    <td className="px-4 py-3 text-sm font-mono">{s.startTime} – {s.endTime}</td>
                    <td className="px-4 py-3 text-sm">{s.assignedClass.name} {s.assignedClass.section}</td>
                    <td className="px-4 py-3 text-sm">{s.subject?.name || "—"}</td>
                    <td className="px-4 py-3 text-sm">{s.teacher?.fullName || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
