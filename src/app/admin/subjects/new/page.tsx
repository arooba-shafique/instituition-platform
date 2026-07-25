"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddSubject() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", code: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/subjects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) router.push("/admin/subjects");
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-[15px] font-bold mb-5">Add Subject</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-[10.5px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5">Subject Name</label><input className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d9488] outline-none text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div><label className="block text-[10.5px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5">Subject Code</label><input className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d9488] outline-none text-sm" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-[#0d9488] text-white text-sm font-bold hover:bg-[#14b8a6] disabled:opacity-60">{loading ? "Saving..." : "Add Subject"}</button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200">Cancel</button>
        </div>
      </form>
    </div>
  );
}
