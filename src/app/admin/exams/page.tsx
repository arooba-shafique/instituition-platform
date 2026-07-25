import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminExams() {
  const exams = await prisma.exam.findMany({
    include: { subject: true, assignedClass: true, createdBy: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[15px] font-bold">Exams</h2>
        <span className="text-[12px] text-[#94a3b8] font-medium">View Only — managed by teachers</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map((e) => {
          const borderColor = e.examType === "monthly" ? "#2563eb" : e.examType === "midterm" ? "#d97706" : e.examType === "final" ? "#dc2626" : "#9333ea";
          const badgeColor = e.examType === "monthly" ? "bg-[#eff6ff] text-[#2563eb]" : e.examType === "midterm" ? "bg-[#fffbeb] text-[#d97706]" : e.examType === "final" ? "bg-[#fef2f2] text-[#dc2626]" : "bg-[#fdf4ff] text-[#9333ea]";
          return (
            <div key={e.id} className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden" style={{ borderTop: `3px solid ${borderColor}` }}>
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-[14.5px] font-bold">{e.name}</div>
                  <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${badgeColor}`}>{e.examType}</span>
                </div>
                <div className="text-[12px] text-[#475569]">{e.subject.name} · {e.assignedClass.name} {e.assignedClass.section}</div>
              </div>
              <div className="p-4 text-[12px] text-[#475569] space-y-1">
                <div>Total Marks: <span className="font-bold">{e.totalMarks}</span></div>
                {e.date && <div>Date: {new Date(e.date).toLocaleDateString()}</div>}
              </div>
            </div>
          );
        })}
        {exams.length === 0 && <div className="col-span-full text-center text-[#94a3b8] text-sm py-12 bg-white rounded-2xl">No exams found.</div>}
      </div>
    </div>
  );
}
