"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

const navItems = [
  { label: "Dashboard", href: "/student", icon: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" },
  { label: "My Attendance", href: "/student/attendance", icon: "M9 11l3 3L22 4" },
  { label: "Results", href: "/student/results", icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
  { label: "Home Tasks", href: "/student/tasks", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
  { label: "Timetable", href: "/student/timetable", icon: "M3 4h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM3 10h21" },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-[199] backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed top-0 left-0 h-full w-[260px] bg-[#0f2744] z-[200] flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 pb-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center mb-3 shadow-lg shadow-teal-500/30">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div className="font-[Sora] text-sm font-bold text-white leading-tight">Institution Management</div>
          <div className="text-[11px] text-white/40 mt-1">Student Portal</div>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-5 py-2.5 text-[13px] font-semibold transition-all border-l-3 ${isActive ? "text-white bg-white/10 border-[#14b8a6]" : "text-white/50 hover:text-white/85 hover:bg-white/5 border-transparent"}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`flex-shrink-0 ${isActive ? "opacity-100" : "opacity-60"}`}><path d={item.icon}/></svg>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/55 text-sm font-semibold hover:bg-red-500/15 hover:text-red-300 hover:border-red-500/25 transition-all">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Log Out
          </button>
        </div>
      </aside>
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        <header className="h-14 bg-[#0f2744] border-b border-white/8 px-4 flex items-center justify-between sticky top-0 z-[100]">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-lg bg-white/8 border border-white/12 flex items-center justify-center text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div className="font-[Sora] text-sm font-bold text-white">Student Dashboard</div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
