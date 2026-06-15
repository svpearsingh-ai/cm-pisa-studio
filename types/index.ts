// ═══════════════════════════════════════
//  CM PISA Studio — Type Definitions
// ═══════════════════════════════════════

// ── Subject ──────────────────────────
export type SubjectCode = 'SCI' | 'MAT' | 'THA' | 'ENG' | 'SOC'
export type GradeLevel = 'ป.4' | 'ป.5' | 'ป.6' | 'ม.1' | 'ม.2' | 'ม.3'
export type Difficulty = 'ง่าย' | 'ปานกลาง' | 'ยาก'
export type BloomLevel = 'ความรู้ความจำ' | 'ความเข้าใจ' | 'การประยุกต์' | 'การวิเคราะห์' | 'การประเมิน'

export const SUBJECT_CONFIG: Record<SubjectCode, {
  label: string
  color: string
  bg: string
  textColor: string
}> = {
  SCI: { label: 'วิทยาศาสตร์',  color: '#10B981', bg: '#DCFCE7', textColor: '#166534' },
  MAT: { label: 'คณิตศาสตร์',   color: '#F59E0B', bg: '#FEF3C7', textColor: '#92400E' },
  THA: { label: 'ภาษาไทย',      color: '#EC4899', bg: '#FCE7F3', textColor: '#9D174D' },
  ENG: { label: 'ภาษาอังกฤษ',   color: '#3B82F6', bg: '#DBEAFE', textColor: '#1D4ED8' },
  SOC: { label: 'สังคมศึกษา',   color: '#8B5CF6', bg: '#EDE9FE', textColor: '#5B21B6' },
}

// ── User / Teacher ────────────────────
export interface Teacher {
  id: string
  email: string
  full_name: string
  school_id: string
  school_name?: string
  subject: SubjectCode
  grade_level: GradeLevel
  phone?: string
  pisa_trained: boolean
  role: 'teacher' | 'admin' | 'supervisor'
  created_at: string
  last_active?: string
}

// ── School ────────────────────────────
export interface School {
  id: string
  name: string
  district: string
  province: string
  teacher_count: number
  exam_count: number
  plan_count: number
  status: 'active' | 'inactive' | 'follow_up'
}

// ── Exam ──────────────────────────────
export interface ExamQuestion {
  num: number
  situation: string
  question: string
  choices: Record<'ก' | 'ข' | 'ค' | 'ง', string>
  answer: 'ก' | 'ข' | 'ค' | 'ง'
  reason: string
  bloom: BloomLevel
  pisa: string
}

export interface ExamRequest {
  subject: SubjectCode
  grade: GradeLevel
  count: number
  types: string[]
  context?: string
  difficulty: Difficulty
  teacher_id: string
}

export interface ExamRecord {
  id: string
  teacher_id: string
  subject: SubjectCode
  grade: GradeLevel
  title: string
  questions: ExamQuestion[]
  created_at: string
  status: 'draft' | 'published'
}

// ── Lesson Plan ───────────────────────
export interface LessonActivity {
  step: string
  desc: string
}

export interface RubricLevel {
  level: string
  criteria: string
}

export interface LessonPlan {
  title: string
  subject: string
  level: string
  time: string
  core_concept: string
  objectives: string[]
  pisa_situation: string
  activities: LessonActivity[]
  guiding_questions: string[]
  worksheet: string
  assessment: string
  rubric: RubricLevel[]
  teacher_notes: string
}

export interface LessonRequest {
  subject: SubjectCode
  grade: GradeLevel
  unit: string
  indicator?: string
  time: string
  context?: string
  methods: string[]
  teacher_id: string
}

export interface LessonRecord {
  id: string
  teacher_id: string
  subject: SubjectCode
  grade: GradeLevel
  title: string
  plan: LessonPlan
  created_at: string
  status: 'draft' | 'published'
}

// ── Dashboard Stats ───────────────────
export interface DashboardStats {
  teacher_count: number
  school_count: number
  exam_count: number
  lesson_count: number
  monthly_exams: number
  monthly_lessons: number
  monthly_teachers: number
}

// ── API Response ──────────────────────
export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: string
  code?: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError
