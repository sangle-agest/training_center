export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'learner';
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  creator?: User;
  categories?: Category[];
  progress?: CourseProgress;
}

export interface Category {
  id: number;
  course_id: number;
  parent_id: number | null;
  name: string;
  order: number;
  created_at: string;
  updated_at: string;
  children?: Category[];
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  category_id: number;
  title: string;
  content: string;
  order: number;
  created_at: string;
  updated_at: string;
  files?: LessonFile[];
}

export interface LessonFile {
  id: number;
  lesson_id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

export interface CourseAssignment {
  id: number;
  course_id: number;
  user_id: number;
  assigned_by: number;
  assigned_at: string;
  user?: User;
  course?: Course;
}

export interface LessonProgress {
  id: number;
  user_id: number;
  lesson_id: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CourseProgress {
  total_lessons: number;
  completed_lessons: number;
  percentage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'learner';
}
