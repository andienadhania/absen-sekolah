export type UserRole = 'admin' | 'guru' | 'tenaga' | 'siswa';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  nisn?: string;
  name: string;
  created_at: string;
}

export interface Student {
  id: string;
  nis: string;
  name: string;
  class: string;
}

export interface AttendanceEmployee {
  id: string;
  user_id: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha';
  date: string;
  created_at: string;
}

export interface AttendanceStudent {
  id: string;
  student_id: string;
  teacher_id: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha';
  date: string;
  created_at: string;
}

export interface Exam {
  id: string;
  title: string;
  created_at: string;
}

export interface Question {
  id: string;
  exam_id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  difficulty: 'easy' | 'hard';
}

export interface Answer {
  id: string;
  user_id: string;
  question_id: string;
  selected_answer: string;
}

export interface Score {
  id: string;
  user_id: string;
  exam_id: string;
  score: number;
  created_at: string;
}
