import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { BookOpen, Clock, AlertCircle, Play, CheckCircle, ChevronRight, GraduationCap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EXAMS } from '../../constants/exams';
import type { Exam } from '../../types/exam';
import ExamSession from './ExamSession';

interface ScoreRecord {
  exam_id: string;
  score: number;
}

export default function ExamList() {
  const { profile } = useAuth();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [activeExam, setActiveExam] = useState<Exam | null>(null);

  // Filter exams based on student jurusan
  const filteredExams = profile?.role === 'siswa' 
    ? EXAMS.filter(e => e.jurusan === profile.jurusan)
    : EXAMS;

  useEffect(() => {
    fetchScores();
  }, [profile]);

  async function fetchScores() {
    setLoading(true);
    try {
      if (profile) {
        const { data, error } = await supabase
          .from('scores')
          .select('exam_id, score')
          .eq('user_id', profile.id);
        
        if (error) throw error;
        
        const scoreMap: Record<string, number> = {};
        data?.forEach((s: ScoreRecord) => {
          scoreMap[s.exam_id] = s.score;
        });
        setScores(scoreMap);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (activeExam) {
    return <ExamSession exam={activeExam} onComplete={() => { setActiveExam(null); fetchScores(); }} />;
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Portal Ujian Online</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">
            Masa Depan {profile?.role === 'siswa' ? `Jurusan ${profile?.jurusan}` : 'Akademik'} Dimulai di Sini
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
          <GraduationCap className="text-primary w-5 h-5" />
          <div className="text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KKM Kelulusan</p>
            <p className="text-lg font-black text-slate-800 leading-none">50 Poin</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? Array(3).fill(0).map((_, i) => (
          <div key={i} className="h-72 bg-white rounded-[3rem] animate-pulse border border-slate-100 shadow-sm"></div>
        )) : filteredExams.map((exam) => {
          const score = scores[exam.id];
          const hasTaken = score !== undefined;
          const isPassed = hasTaken && score >= 50;

          return (
            <div key={exam.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col hover:shadow-2xl hover:shadow-primary/5 transition-all group relative overflow-hidden">
              {/* Decorative background circle */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-10 -translate-y-10 group-hover:bg-primary/5 transition-colors"></div>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500",
                  hasTaken 
                    ? (isPassed ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-rose-500 text-white shadow-rose-200") 
                    : "bg-slate-900 text-white shadow-slate-200"
                )}>
                  <BookOpen className="w-6 h-6" />
                </div>
                {hasTaken && (
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hasil Ujian</p>
                    <p className={cn(
                      "text-3xl font-black",
                      isPassed ? "text-emerald-600" : "text-rose-600"
                    )}>{score}</p>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-black mb-2 text-slate-800 leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">{exam.title}</h3>
              <p className="text-[10px] text-slate-400 font-black mb-8 flex items-center gap-2 uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5" />
                DURASI: 60 MENIT • JURUSAN: {exam.jurusan}
              </p>

              <div className="mt-auto relative z-10">
                {hasTaken ? (
                  <div className={cn(
                    "flex items-center justify-between p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest",
                    isPassed ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  )}>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {isPassed ? 'LULUS KOMPETENSI' : 'TIDAK LULUS'}
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-30" />
                  </div>
                ) : (
                  <button 
                    onClick={() => setActiveExam(exam)}
                    className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-xl shadow-slate-300 hover:shadow-rose-300 active:scale-95"
                  >
                    Kerjakan Soal <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredExams.length === 0 && !loading && (
          <div className="col-span-full border-4 border-dashed border-slate-200 rounded-[4rem] p-24 text-center bg-slate-50/50">
            <AlertCircle className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <h3 className="text-slate-400 font-black uppercase tracking-[0.3em] text-sm">Ujian Belum Tersedia</h3>
            <p className="text-slate-300 text-xs font-bold mt-2 uppercase">Hubungi admin atau wali kelas Anda</p>
          </div>
        )}
      </div>
    </div>
  );
}
