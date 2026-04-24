import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Search, ShieldAlert, Trash2, Mail, BadgeCheck, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { UserProfile } from '../../types';

export default function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Peringatan: Menghapus user akan menghapus semua data terkait. Lanjutkan?')) return;
    try {
      // Logic for hard delete would usually involve an edge function in Supabase,
      // but for demonstration we delete from our public users table.
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
      fetchUsers();
    } catch (err) {
      alert('Gagal menghapus user');
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">User Management</h2>
        <p className="text-gray-500">Kelola akses dan perizinan akun sistem</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input 
              type="text" 
              placeholder="Cari email atau nama pengguna..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
            />
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
            Total User: {users.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Informasi Akun</th>
                <th className="px-6 py-4 text-center">Hak Akses Sistem</th>
                <th className="px-6 py-4 text-right">Manajemen</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600 divide-y divide-slate-50">
              {loading ? Array(5).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={3} className="px-6 py-8">
                    <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
                  </td>
                </tr>
              )) : users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 flex items-center gap-1.5">
                          {u.name}
                          {u.role === 'admin' && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <span className={cn(
                        "px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        u.role === 'admin' ? "bg-slate-900 text-white" :
                        u.role === 'guru' ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500"
                      )}>
                        {u.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right text-slate-300">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 hover:text-slate-600 transition-colors">
                         <ShieldAlert className="w-5 h-5" />
                       </button>
                       <button 
                        onClick={() => handleDelete(u.id)}
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
    </div>
  );
}
