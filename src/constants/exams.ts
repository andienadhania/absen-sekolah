import { Exam, Question } from '../types/exam';

const generateQuestions = (jurusan: string): Question[] => {
  const easy: Question[] = Array(15).fill(null).map((_, i) => ({
    id: `q-easy-${i}`,
    text: `Pertanyaan Dasar ${jurusan} #${i + 1}: Apa fungsi utama dari perangkat utama di ${jurusan}?`,
    options: ['Fungsi A', 'Fungsi B', 'Fungsi C', 'Fungsi D'],
    correctAnswer: 0,
    difficulty: 'easy'
  }));

  const hard: Question[] = Array(15).fill(null).map((_, i) => ({
    id: `q-hard-${i}`,
    text: `Analisis Kasus ${jurusan} #${i + 1}: Jika terjadi kegagalan sistem pada tingkat lanjut, langkah apa yang paling tepat?`,
    options: ['Solusi Kompleks A', 'Solusi Kompleks B', 'Solusi Kompleks C', 'Solusi Kompleks D'],
    correctAnswer: 1,
    difficulty: 'hard'
  }));

  return [...easy, ...hard];
};

export const EXAMS: Exam[] = [
  {
    id: 'exam-tkj',
    title: 'Ujian Kompetensi Keahlian TKJ',
    description: 'Instalasi Jaringan dan Server',
    jurusan: 'TKJ',
    questions: generateQuestions('TKJ')
  },
  {
    id: 'exam-dkv',
    title: 'Ujian Kompetensi Keahlian DKV',
    description: 'Desain Grafis dan Multimedia',
    jurusan: 'DKV',
    questions: generateQuestions('DKV')
  },
  {
    id: 'exam-ak',
    title: 'Ujian Kompetensi Keahlian AK',
    description: 'Akuntansi Keuangan Dasar',
    jurusan: 'AK',
    questions: generateQuestions('AK')
  },
  {
    id: 'exam-bc',
    title: 'Ujian Kompetensi Keahlian BC',
    description: 'Teknik Produksi Penyiaran',
    jurusan: 'BC',
    questions: generateQuestions('BC')
  },
  {
    id: 'exam-mplb',
    title: 'Ujian Kompetensi Keahlian MPLB',
    description: 'Manajemen Perkantoran',
    jurusan: 'MPLB',
    questions: generateQuestions('MPLB')
  },
  {
    id: 'exam-bd',
    title: 'Ujian Kompetensi Keahlian BD',
    description: 'Pemasaran Digital',
    jurusan: 'BD',
    questions: generateQuestions('BD')
  }
];
