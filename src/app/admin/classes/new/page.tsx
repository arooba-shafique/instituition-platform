"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddClass() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", section: "", academicYear: "", classTeacherId: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/classes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) router.push("/admin/classes");
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-[15px] font-bold mb-5">Add Class</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-[10.5px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5">Class Name</label><input className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d9488] outline-none text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div><label className="block text-[10.5px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5">Section</label><input className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d9488] outline-none text-sm" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} /></div>
          <div><label className="block text-[10.5px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5">Academic Year</label><input className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d9488] outline-none text-sm" value={form.academicYear} onChange={(e) => setForm({ ...form, academicYear: e.target.value })} /></div>
          <div><label className="block text-[10.5px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5">Class Teacher ID (optional)</label><input className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d9488] outline-none text-sm" value={form.classTeacherId} onChange={(e) => setForm({ ...form, classTeacherId: e.target.value })} /></div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-[#0d9488] text-white text-sm font-bold hover:bg-[#14b8a6] disabled:opacity-60">{loading ? "Saving..." : "Add Class"}</button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200">Cancel</button>
        </div>
      </form>
    </div>
  );
}
