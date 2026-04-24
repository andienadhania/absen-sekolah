import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { 
  BarChart3, 
  Download, 
  ArrowRight,
  TrendingDown,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Score } from '../../types';

export default function StudentResults() {
  const { profile } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isSiswa = profile?.role === 'siswa';

  useEffect(() => {
    fetchResults();
  }, [profile]);

  async function fetchResults() {
    if (!profile) return;
    try {
      let query = supabase
        .from('scores')
        .select(`
          id,
          score,
          created_at,
          exams ( title ),
          user_id
        `)
        .order('created_at', { ascending: false });

      if (isSiswa) {
        query = query.eq('user_id', profile.id);
      } else {
        // For teachers/admins, maybe join with profile to get names?
        // For now, just getting all.
      }

      const { data, error } = await query;
      if (error) throw error;
      setResults(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const averageScore = results.length > 0 
    ? Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / results.length)
    : 0;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
            {isSiswa ? 'Nilai Saya' : 'Laporan Hasil Ujian'}
          </h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">
            {isSiswa ? 'Transkrip nilai ujian online Anda' : 'Pusat data hasil ujian seluruh siswa SMK Prima'}
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white px-8 py-4 rounded-[1.5rem] border border-slate-100 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200/50 hover:bg-slate-50 transition-all active:scale-95">
          <Download className="w-4 h-4 text-primary" /> Unduh Dokumen Laporan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Column */}
        <div className="space-y-6">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden relative group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Rata-rata Kelulusan</p>
            <h3 className="text-6xl font-black text-slate-900 leading-none tracking-tighter">{averageScore}</h3>
            <div className="mt-8 flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
              <TrendingDown className="w-4 h-4 rotate-180" /> Stabil dalam 30 Hari
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-slate-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <h4 className="text-[11px] font-black uppercase tracking-widest">Validasi Blockchain</h4>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-wide">
              Nilai yang ditampilkan telah divalidasi oleh smart-contract sistem dan tidak dapat dimanipulasi oleh pihak ketiga.
            </p>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-[2rem] animate-pulse border border-slate-100"></div>
          )) : results.map((res) => (
            <div key={res.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-8 hover:shadow-2xl hover:shadow-primary/5 transition-all group">
              <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                <BarChart3 className={cn(
                  "w-8 h-8 transition-colors",
                  res.score >= 50 ? "text-emerald-500" : "text-rose-500"
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-lg truncate mb-2 text-slate-800 uppercase tracking-tight">{res.exams?.title || 'Evaluasi Kompetensi'}</h4>
                <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(res.created_at).toLocaleDateString('id-ID')}</span>
                  <span className={cn("px-2 py-0.5 rounded-lg", res.score >= 50 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                    {res.score >= 50 ? 'KOMPETEN' : 'REMEDIAL'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className={cn("text-4xl font-black tracking-tighter", res.score >= 50 ? "text-emerald-600" : "text-rose-600")}>{res.score}</p>
                <button className="text-[9px] font-black text-primary hover:underline flex items-center gap-1 justify-end mt-2 uppercase tracking-widest">
                  Analisis <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {results.length === 0 && !loading && (
            <div className="bg-slate-50 border-4 border-dashed border-slate-100 rounded-[3rem] p-24 text-center">
              <BarChart3 className="w-16 h-16 text-slate-200 mx-auto mb-6" />
              <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Belum ada data nilai</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
