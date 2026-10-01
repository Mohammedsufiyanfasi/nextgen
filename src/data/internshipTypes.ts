import type { WorkMode, Duration, PayType } from '../types';

export interface RequiredSkill {
  skill: string;
  required: number; // 0-100
}

export interface Internship {
  id: string;
  company: string;
  logoColor: string;
  role: string;
  location: string;
  workMode: WorkMode;
  duration: Duration;
  stipend: string;
  paid: PayType;
  deadline: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  preferredSkills: string[];
  requiredSkills: RequiredSkill[];
  technologies: string[];
}
