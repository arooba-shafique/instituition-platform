import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminResults() {
  const results = await prisma.result.findMany({
    include: { exam: { include: { subject: true, assignedClass: true } }, student: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[15px] font-bold">Grades &amp; Results</h2>
        <span className="text-[12px] text-[#94a3b8] font-medium">View Only</span>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead><tr className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider bg-gray-50">
              <th className="text-left px-5 py-3">Student</th>
              <th className="text-left px-5 py-3">Exam</th>
              <th className="text-left px-5 py-3">Subject</th>
              <th className="text-left px-5 py-3">Class</th>
              <th className="text-center px-5 py-3">Marks</th>
              <th className="text-center px-5 py-3">Grade</th>
            </tr></thead>
            <tbody>
              {results.map((r) => {
                const grade = r.percentage >= 90 ? "A" : r.percentage >= 75 ? "B" : r.percentage >= 60 ? "C" : r.percentage >= 40 ? "D" : "F";
                const gradeColor = r.percentage >= 90 ? "bg-green-100 text-green-700" : r.percentage >= 75 ? "bg-blue-100 text-blue-700" : r.percentage >= 60 ? "bg-teal-100 text-teal-700" : r.percentage >= 40 ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500";
                return (
                  <tr key={r.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                    <td className="px-5 py-3 text-sm font-semibold">{r.student.fullName}</td>
                    <td className="px-5 py-3 text-sm">{r.exam.name}</td>
                    <td className="px-5 py-3 text-sm">{r.exam.subject.name}</td>
                    <td className="px-5 py-3 text-sm">{r.exam.assignedClass.name}</td>
                    <td className="px-5 py-3 text-center text-sm font-mono font-bold">{r.marksObtained}/{r.exam.totalMarks}</td>
                    <td className="px-5 py-3 text-center"><span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-extrabold ${gradeColor}`}>{grade}</span></td>
                  </tr>
                );
              })}
              {results.length === 0 && <tr><td colSpan={6} className="text-center text-[#94a3b8] text-sm py-8">No results found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
