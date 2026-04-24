import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';
import { Search, Plus, Filter, MoreHorizontal, GraduationCap, X, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Student } from '../../types';

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newStudent, setNewStudent] = useState({ nis: '', name: '', class: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      const { data, error } = await supabase.from('students').select('*').order('name');
      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase.from('students').insert(newStudent);
      if (error) throw error;
      setShowAdd(false);
      setNewStudent({ nis: '', name: '', class: '' });
      fetchStudents();
    } catch (err) {
      alert('Gagal menambah siswa');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus data siswa ini?')) return;
    try {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error;
      fetchStudents();
    } catch (err) {
      alert('Gagal menghapus data');
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold">Data Siswa</h2>
          <p className="text-gray-500">Manajemen database siswa SMK Prima Unggul</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all primary-gradient"
        >
          <Plus className="w-5 h-5" /> Tambah Siswa
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input 
              type="text" 
              placeholder="Cari berdasarkan nama atau NIS..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Semua Kelas</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Siswa</th>
                <th className="px-6 py-4">Nomor Induk (NIS)</th>
                <th className="px-6 py-4 text-right">Manajemen</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600 divide-y divide-slate-50">
              {loading ? Array(5).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={3} className="px-6 py-8">
                    <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
                  </td>
                </tr>
              )) : students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs uppercase">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{s.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.class}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-mono font-bold text-slate-400 px-2 py-1 bg-slate-50 rounded-md">{s.nis}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-300">
                      <button className="p-2 hover:text-slate-600 transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(s.id)}
                        className="p-2 hover:text-primary transition-colors outline-none"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-200"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">Form Tambah Siswa</h3>
              <button onClick={() => setShowAdd(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest ml-1 uppercase">Nama Lengkap Siswa</label>
                <input 
                  required
                  type="text"
                  value={newStudent.name}
                  onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 outline-none font-medium"
                  placeholder="Masukkan nama lengkap..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 tracking-widest ml-1 uppercase">Nomor Induk (NIS)</label>
                  <input 
                    required
                    type="text"
                    value={newStudent.nis}
                    onChange={e => setNewStudent({...newStudent, nis: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 outline-none font-mono"
                    placeholder="2223101"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 tracking-widest ml-1 uppercase">Kelas</label>
                  <input 
                    required
                    type="text"
                    value={newStudent.class}
                    onChange={e => setNewStudent({...newStudent, class: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 outline-none font-bold text-primary uppercase"
                    placeholder="XII TKJ 1"
                  />
                </div>
              </div>
              <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 shadow-lg shadow-rose-200 mt-4 transition-all uppercase tracking-wider text-sm">
                SIMPAN DATA SISWA
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

const Trash2 = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
