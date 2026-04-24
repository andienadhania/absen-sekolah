export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'hard';
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  jurusan: string;
  questions: Question[];
}
