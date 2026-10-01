import type { AppState, StudentProfile } from '../types';

export const ALL_INTERESTS = [
  'Artificial Intelligence',
  'Machine Learning',
  'Data Science',
  'Data Analytics',
  'Web Development',
  'Mobile Development',
  'Software Development',
  'Cloud Computing',
  'Cybersecurity',
  'Business Intelligence',
  'Database Management',
  'Java Development',
  'Python Development',
  'UI/UX',
  'DevOps',
];

export const ONBOARDING_SKILLS = [
  'Python',
  'SQL',
  'Machine Learning',
  'TensorFlow',
  'Power BI',
  'Java',
  'HTML',
  'CSS',
  'JavaScript',
  'React',
  'Git',
  'Statistics',
  'Data Structures',
  'Cloud Computing',
];

export const QUIZ_SKILLS = ['Python', 'SQL', 'Machine Learning', 'TensorFlow', 'Power BI', 'Java'];

export function skillLabel(pct: number): string {
  if (pct < 40) return 'Needs Foundation';
  if (pct < 60) return 'Beginner';
  if (pct < 75) return 'Developing';
  if (pct < 90) return 'Strong';
  return 'Advanced';
}

export function emptyProfile(): StudentProfile {
  return {
    personal: {
      fullName: '',
      email: '',
      phone: '',
      photoUrl: '',
      location: '',
    },
    academic: {
      college: '',
      degree: '',
      branch: '',
      currentYear: '',
      graduationYear: '',
      cgpa: '',
      coursework: '',
    },
    interests: [],
    skills: ONBOARDING_SKILLS.map((s) => ({
      skill: s,
      level: 'Beginner' as const,
      percentage: 0,
      assessed: false,
      quizScore: undefined,
    })),
    projects: [],
    certifications: [],
    career: {
      desiredRole: '',
      shortTerm: '',
      longTerm: '',
      industry: '',
      targetCompanies: '',
      preferredDomain: '',
    },
    preferences: {
      type: 'Remote',
      duration: '3 months',
      location: '',
      pay: 'Either',
      startDate: '',
    },
    onboarded: false,
  };
}

export function demoProfile(): StudentProfile {
  return {
    personal: {
      fullName: 'Mohammed Sufiyan Fasi',
      email: 'sufiyan.fasi@example.com',
      phone: '+91 98765 43210',
      photoUrl: '',
      location: 'Bangalore, India',
    },
    academic: {
      college: 'BMS College of Engineering',
      degree: 'B.Tech',
      branch: 'Computer Science',
      currentYear: '3rd Year',
      graduationYear: '2027',
      cgpa: '8.4',
      coursework: 'Data Structures, DBMS, Operating Systems, Machine Learning, Web Technologies',
    },
    interests: ['Artificial Intelligence', 'Data Science', 'Web Development'],
    skills: [
      { skill: 'Python', level: 'Intermediate', percentage: 75, assessed: true, quizScore: 80 },
      { skill: 'SQL', level: 'Intermediate', percentage: 68, assessed: true, quizScore: 70 },
      { skill: 'Machine Learning', level: 'Beginner', percentage: 52, assessed: true, quizScore: 50 },
      { skill: 'TensorFlow', level: 'Beginner', percentage: 34, assessed: false, quizScore: 30 },
      { skill: 'Power BI', level: 'Beginner', percentage: 28, assessed: false, quizScore: 20 },
      { skill: 'Java', level: 'Intermediate', percentage: 62, assessed: true, quizScore: 60 },
      { skill: 'HTML', level: 'Intermediate', percentage: 70, assessed: false },
      { skill: 'CSS', level: 'Intermediate', percentage: 65, assessed: false },
      { skill: 'JavaScript', level: 'Intermediate', percentage: 60, assessed: false },
      { skill: 'React', level: 'Beginner', percentage: 45, assessed: false },
      { skill: 'Git', level: 'Intermediate', percentage: 70, assessed: false },
      { skill: 'Statistics', level: 'Beginner', percentage: 50, assessed: false },
      { skill: 'Data Structures', level: 'Intermediate', percentage: 68, assessed: false },
      { skill: 'Cloud Computing', level: 'Beginner', percentage: 35, assessed: false },
    ],
    projects: [
      {
        title: 'Student Performance Predictor',
        description: 'Built a regression model to predict student scores from academic and demographic features.',
        technologies: 'Python, scikit-learn, Pandas',
      },
      {
        title: 'Personal Portfolio Website',
        description: 'Responsive portfolio built with React and Tailwind CSS.',
        technologies: 'React, TypeScript, Tailwind',
      },
    ],
    certifications: [
      { name: 'Python for Data Science', issuer: 'Coursera', year: '2025' },
      { name: 'SQL Basics', issuer: 'HackerRank', year: '2024' },
    ],
    career: {
      desiredRole: 'Data Scientist / AI Engineer',
      shortTerm: 'Secure a data science internship',
      longTerm: 'Become a Senior Data Scientist',
      industry: 'Technology',
      targetCompanies: 'Google, Microsoft, Amazon, Zoho',
      preferredDomain: 'Artificial Intelligence',
    },
    preferences: {
      type: 'Remote',
      duration: '3 months',
      location: 'Bangalore',
      pay: 'Paid',
      startDate: '2026-12-01',
    },
    onboarded: true,
  };
}

export function demoQuizResults() {
  return [
    { skill: 'Python', correct: 8, total: 10, percentage: 80, label: 'Strong', takenAt: '2026-09-20T10:00:00Z' },
    { skill: 'SQL', correct: 7, total: 10, percentage: 70, label: 'Developing', takenAt: '2026-09-21T11:00:00Z' },
    { skill: 'Machine Learning', correct: 5, total: 10, percentage: 50, label: 'Beginner', takenAt: '2026-09-22T09:00:00Z' },
    { skill: 'TensorFlow', correct: 3, total: 10, percentage: 30, label: 'Needs Foundation', takenAt: '2026-09-23T14:00:00Z' },
    { skill: 'Power BI', correct: 2, total: 10, percentage: 20, label: 'Needs Foundation', takenAt: '2026-09-24T16:00:00Z' },
    { skill: 'Java', correct: 6, total: 10, percentage: 60, label: 'Beginner', takenAt: '2026-09-25T12:00:00Z' },
  ];
}

export function demoRoadmap() {
  return [
    {
      week: 1,
      title: 'Python for Data Analysis',
      objective: 'Strengthen Python for data analysis workflows.',
      topics: ['Pandas basics', 'NumPy arrays', 'Data cleaning'],
      practice: 'Clean and analyze a sample CSV dataset',
      miniProject: 'Exploratory Data Analysis on a Kaggle dataset',
      completed: true,
    },
    {
      week: 2,
      title: 'SQL Mastery',
      objective: 'Master intermediate SQL for analytics.',
      topics: ['Joins', 'Aggregations', 'Subqueries'],
      practice: 'Write 20 practice queries',
      miniProject: 'Sales analytics dashboard queries',
      completed: true,
    },
    {
      week: 3,
      title: 'Statistics',
      objective: 'Build statistical intuition for modeling.',
      topics: ['Descriptive stats', 'Distributions', 'Hypothesis testing'],
      practice: 'Solve 15 statistics problems',
      miniProject: 'A/B test analysis',
      completed: false,
    },
    {
      week: 4,
      title: 'Machine Learning',
      objective: 'Learn supervised learning fundamentals.',
      topics: ['Regression', 'Classification', 'Train/test split'],
      practice: 'Train 3 models on sample data',
      miniProject: 'Student Performance Prediction',
      completed: false,
    },
    {
      week: 5,
      title: 'Power BI',
      objective: 'Build interactive dashboards.',
      topics: ['Power Query', 'DAX', 'Visualizations'],
      practice: 'Create a 3-page dashboard',
      miniProject: 'Retail sales dashboard',
      completed: false,
    },
    {
      week: 6,
      title: 'Portfolio Project',
      objective: 'Apply skills in an end-to-end project.',
      topics: ['Project planning', 'Modeling', 'Reporting'],
      practice: 'Document and publish a project',
      miniProject: 'End-to-end data science case study',
      completed: false,
    },
    {
      week: 7,
      title: 'Resume + Interview Preparation',
      objective: 'Prepare for applications and interviews.',
      topics: ['Resume building', 'Mock interviews', 'Behavioral rounds'],
      practice: 'Complete 5 mock interviews',
      miniProject: 'Polished resume + portfolio site',
      completed: false,
    },
  ];
}

export function demoState(): AppState {
  return {
    profile: demoProfile(),
    quizResults: demoQuizResults(),
    savedInternships: ['ds-technova', 'da-finfleet'],
    roadmap: demoRoadmap(),
    recommendedRole: null,
  };
}
