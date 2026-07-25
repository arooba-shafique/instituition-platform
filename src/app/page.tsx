import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f2744] to-[#1a4a7a] text-white p-8">
      <div className="text-center max-w-2xl">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-teal-500/30">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-10 h-10">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <h1 className="font-[Sora] text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Institution <span className="text-[#14b8a6]">Management</span> System
        </h1>
        <p className="text-lg text-white/60 mb-10 leading-relaxed">
          A comprehensive school management platform with role-based dashboards for admins, teachers, students, and parents.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 rounded-xl bg-[#0d9488] hover:bg-[#14b8a6] font-bold text-white transition-all shadow-lg hover:shadow-teal-500/25"
          >
            Sign In
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "👨‍💼", label: "Admin Panel" },
            { icon: "👩‍🏫", label: "Teacher Portal" },
            { icon: "👨‍🎓", label: "Student Portal" },
            { icon: "👨‍👩‍👧", label: "Parent Portal" },
          ].map((item) => (
            <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm">
              <div className="text-3xl mb-3">{item.icon}</div>
              <div className="text-sm font-semibold">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
