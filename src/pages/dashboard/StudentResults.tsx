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

  useEffect(() => {
    fetchResults();
  }, [profile]);

  async function fetchResults() {
    if (!profile) return;
    try {
      const { data, error } = await supabase
        .from('scores')
        .select(`
          id,
          score,
          created_at,
          exams ( title )
        `)
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

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
          <h2 className="text-2xl font-bold">Nilai Saya</h2>
          <p className="text-gray-500">Transkrip nilai ujian online Anda</p>
        </div>
        <button className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl border border-gray-100 font-bold text-sm shadow-sm hover:bg-gray-50 transition-all">
          <Download className="w-4 h-4" /> Unduh Rapor Digital
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Column */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Rata-rata Nilai</p>
            <h3 className="text-5xl font-black text-gray-900 leading-none">{averageScore}</h3>
            <div className="mt-6 flex items-center gap-2 text-green-500 font-bold text-xs">
              <TrendingDown className="w-4 h-4 rotate-180" /> +5% dari bulan lalu
            </div>
          </div>

          <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-bold">Keamanan Data</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              Nilai yang ditampilkan telah divalidasi oleh sistem dan tidak dapat diubah tanpa persetujuan Admin.
            </p>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-3xl animate-pulse border border-gray-100"></div>
          )) : results.map((res) => (
            <div key={res.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                <BarChart3 className={cn(
                  "w-8 h-8 transition-colors",
                  res.score >= 75 ? "text-green-500" : "text-primary"
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-lg truncate mb-1">{res.exams?.title || 'Ujian Terhapus'}</h4>
                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(res.created_at).toLocaleDateString('id-ID')}</span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100">{res.score >= 75 ? 'Lulus' : 'Remedial'}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black">{res.score}</p>
                <button className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 justify-end mt-1 uppercase tracking-tighter">
                  Detail <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {results.length === 0 && !loading && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-[2.5rem] p-16 text-center">
              <p className="text-gray-400 font-bold italic">Belum ada nilai ujian tersedia.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
