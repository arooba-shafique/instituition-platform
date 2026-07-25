"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddStudent() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", admissionNumber: "", rollNumber: "", studentClassId: "", dateOfBirth: "", gender: "M", phone: "", address: "", guardianName: "", parentId: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/students", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) router.push("/admin/students");
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-[15px] font-bold mb-5">Add Student</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-[10.5px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5">Full Name</label><input className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d9488] outline-none text-sm" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></div>
          <div><label className="block text-[10.5px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5">Admission No</label><input className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d9488] outline-none text-sm" value={form.admissionNumber} onChange={(e) => setForm({ ...form, admissionNumber: e.target.value })} /></div>
          <div><label className="block text-[10.5px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5">Roll Number</label><input className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d9488] outline-none text-sm" value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} /></div>
          <div><label className="block text-[10.5px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5">Class ID</label><input type="number" className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d9488] outline-none text-sm" value={form.studentClassId} onChange={(e) => setForm({ ...form, studentClassId: e.target.value })} required /></div>
          <div><label className="block text-[10.5px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5">Date of Birth</label><input type="date" className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d9488] outline-none text-sm" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} /></div>
          <div><label className="block text-[10.5px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5">Gender</label><select className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d9488] outline-none text-sm" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}><option value="M">Male</option><option value="F">Female</option></select></div>
          <div><label className="block text-[10.5px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5">Phone</label><input className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d9488] outline-none text-sm" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="block text-[10.5px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5">Guardian Name</label><input className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d9488] outline-none text-sm" value={form.guardianName} onChange={(e) => setForm({ ...form, guardianName: e.target.value })} /></div>
        </div>
        <div><label className="block text-[10.5px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5">Address</label><textarea className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d9488] outline-none text-sm min-h-[80px]" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-[#0d9488] text-white text-sm font-bold hover:bg-[#14b8a6] disabled:opacity-60">{loading ? "Saving..." : "Add Student"}</button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200">Cancel</button>
        </div>
      </form>
    </div>
  );
}
