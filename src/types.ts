export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';
export type Duration = '1 month' | '2 months' | '3 months' | '6 months';
export type PayType = 'Paid' | 'Unpaid' | 'Either';

export interface SkillRating {
  skill: string;
  level: SkillLevel;
  percentage: number; // 0-100 self-rated
  assessed?: boolean; // true if quiz taken
  quizScore?: number; // 0-100 from quiz
}

export interface QuizResult {
  skill: string;
  correct: number;
  total: number;
  percentage: number;
  label: string;
  takenAt: string; // ISO
  questions?: import('./data/quizzes/quizTypes').QuizQuestion[];
  answers?: Record<number, 'A' | 'B' | 'C' | 'D'>;
}

export interface Project {
  title: string;
  description: string;
  technologies: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  photoUrl: string;
  location: string;
}

export interface AcademicBackground {
  college: string;
  degree: string;
  branch: string;
  currentYear: string;
  graduationYear: string;
  cgpa: string;
  coursework: string;
}

export interface CareerGoals {
  desiredRole: string;
  shortTerm: string;
  longTerm: string;
  industry: string;
  targetCompanies: string;
  preferredDomain: string;
}

export interface InternshipPreferences {
  type: WorkMode;
  duration: Duration;
  location: string;
  pay: PayType;
  startDate: string;
}

export interface StudentProfile {
  personal: PersonalInfo;
  academic: AcademicBackground;
  interests: string[];
  skills: SkillRating[];
  projects: Project[];
  certifications: Certification[];
  career: CareerGoals;
  preferences: InternshipPreferences;
  onboarded: boolean;
}

export interface RoadmapStep {
  week: number;
  title: string;
  objective: string;
  topics: string[];
  practice: string;
  miniProject: string;
  completed: boolean;
}

export interface AppState {
  profile: StudentProfile;
  quizResults: QuizResult[];
  savedInternships: string[];
  roadmap: RoadmapStep[];
  recommendedRole: string | null;
}
