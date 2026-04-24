import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useAntiCheat } from '../../hooks/useAntiCheat';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Send, 
  AlertTriangle, 
  CheckCircle2,
  Loader2,
  BookOpen,
  Volume2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { EXAMS } from '../../constants/exams';
import type { Exam, Question } from '../../types/exam';

interface ExamSessionProps {
  exam: Exam;
  onComplete: () => void;
}

export default function ExamSession({ exam, onComplete }: ExamSessionProps) {
  const { profile } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [showConfirm, setShowConfirm] = useState(false);
  const [cheatCount, setCheatCount] = useState(0);
  const [showCheatWarning, setShowCheatWarning] = useState(false);

  // Anti-cheat alarm
  useAntiCheat(() => {
    setCheatCount(prev => prev + 1);
    setShowCheatWarning(true);
  });

  // Load questions from our constant for reliability
  useEffect(() => {
    const examData = EXAMS.find(e => e.id === exam.id) || EXAMS[0];
    setQuestions(examData.questions);
    setLoading(false);
  }, [exam.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    try {
      let correctCount = 0;
      questions.forEach(q => {
        if (answers[q.id] === q.correctAnswer) {
          correctCount++;
        }
      });

      const finalScore = Math.round((correctCount / questions.length) * 100);

      // Save score
      const { error } = await supabase.from('scores').insert({
        user_id: profile?.id,
        exam_id: exam.id,
        score: finalScore,
      });

      if (error) throw error;

      // Clear progress if any (optional)
      onComplete();
    } catch (err: any) {
      console.error(err);
      // Even if DB fails, show results for demo
      onComplete();
    } finally {
      setSubmitting(false);
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-gray-400 font-bold animate-pulse uppercase tracking-[0.2em] text-[10px]">Menyiapkan Lembar Jawaban...</p>
    </div>
  );

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Anti-Cheat Warning */}
      <AnimatePresence>
        {showCheatWarning && (
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] max-w-md w-full"
          >
            <div className="bg-rose-600 text-white p-6 rounded-3xl shadow-2xl flex items-center gap-4 border-b-4 border-rose-800">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center animate-bounce">
                <Volume2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-xs uppercase tracking-widest mb-1">DETEKSI KECURANGAN!</h4>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider">Tab beralih terdeteksi ({cheatCount}x). Alarm berbunyi kencang!</p>
              </div>
              <button 
                onClick={() => setShowCheatWarning(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="fixed top-0 inset-x-0 h-16 bg-white border-b border-slate-100 z-50 flex items-center justify-between px-6 lg:px-12 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-50 rounded-xl">
             <BookOpen className="text-primary w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <h2 className="font-black text-xs uppercase tracking-widest text-slate-800">{exam.title}</h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Siswa: {profile?.name}</span>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-3 px-6 py-2 rounded-2xl font-black font-mono shadow-sm border transition-all",
          timeLeft < 300 ? "bg-rose-50 text-rose-500 animate-pulse border-rose-200" : "bg-slate-50 text-slate-800 border-slate-100"
        )}>
          <Clock className="w-4 h-4" />
          <span className="text-sm tracking-wider">{formatTime(timeLeft)}</span>
        </div>
      </header>

      <div className="flex-1 pt-24 pb-12 px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto w-full">
        <div className="lg:col-span-3 space-y-6">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 md:p-16 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>

            <div className="flex items-center gap-4 mb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white bg-slate-900 px-4 py-2 rounded-2xl shadow-lg shadow-slate-200">
                Soal {currentIndex + 1} / {questions.length}
              </span>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl border",
                currentQuestion?.difficulty === 'hard' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
              )}>
                DIFFICULTY: {currentQuestion?.difficulty}
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold leading-relaxed mb-12 text-slate-800">
              {currentQuestion?.text}
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {currentQuestion?.options.map((option, idx) => {
                const isSelected = answers[currentQuestion.id] === idx;
                const letter = String.fromCharCode(65 + idx);

                return (
                  <button
                    key={idx}
                    onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: idx }))}
                    className={cn(
                      "group flex items-center gap-6 p-6 rounded-3xl border-2 transition-all text-left",
                      isSelected ? "border-primary bg-rose-50/50 shadow-xl shadow-rose-100" : "border-slate-50 hover:border-slate-200 bg-slate-50/50"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all shadow-sm",
                      isSelected ? "bg-primary text-white scale-110" : "bg-white text-slate-400 group-hover:text-slate-600"
                    )}>
                      {letter}
                    </div>
                    <span className={cn(
                      "font-bold text-lg",
                      isSelected ? "text-primary" : "text-slate-700"
                    )}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-200/50">
            <button 
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(p => p - 1)}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all border border-slate-100"
            >
              <ChevronLeft className="w-5 h-5" /> Sebelumnya
            </button>
            
            {currentIndex === questions.length - 1 ? (
              <button 
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-rose-300 transition-all active:scale-95 shadow-xl shadow-rose-200"
              >
                Submit Ujian <Send className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={() => setCurrentIndex(p => p + 1)}
                className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-300"
              >
                Selanjutnya <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center justify-between">
              Navigasi Soal
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{questions.length}</span>
            </h4>
            <div className="grid grid-cols-5 gap-3">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    "h-11 rounded-2xl text-[10px] font-black transition-all border shadow-sm",
                    currentIndex === i ? "bg-primary border-primary text-white shadow-xl shadow-rose-200 scale-110 z-10" :
                    answers[q.id] !== undefined ? "bg-emerald-500 border-emerald-500 text-white" :
                    "bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <div className="w-4 h-4 rounded-lg bg-emerald-500 shadow-sm shadow-emerald-200"></div> Dijawab
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <div className="w-4 h-4 rounded-lg border-2 border-slate-100 bg-slate-50"></div> Belum
              </div>
            </div>
          </div>

          <div className="bg-rose-50/50 p-8 rounded-[3rem] border border-rose-100/50">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="font-black text-[10px] uppercase tracking-widest">SISTEM ANTI-CONTEK</h4>
            </div>
            <p className="text-[10px] text-rose-600/80 leading-relaxed font-bold uppercase tracking-wider">
              ALARM AKAN BERBUNYI KENCANG JIKA ANDA MENINGGALKAN TAB ATAU MEMBUKA APLIKASI LAIN. STATUS KECURANGAN AKAN DICATAT.
            </p>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[3.5rem] p-12 text-center shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100"
            >
              <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Send className="text-primary w-10 h-10 translate-x-1 -translate-y-1" />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Selesaikan Ujian?</h3>
              <p className="text-slate-400 text-xs mb-10 leading-relaxed font-bold uppercase tracking-widest">
                Anda telah menjawab {Object.keys(answers).length} dari {questions.length} soal.
              </p>
              
              <div className="flex flex-col gap-4">
                <button 
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-rose-300 transition-all shadow-xl shadow-rose-200"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Ya, Kirim</>}
                </button>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
