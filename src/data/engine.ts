import type {
  AppState,
  QuizResult,
  RoadmapStep,
  SkillRating,
  StudentProfile,
} from '../types';
import { internships } from './internships';
import type { Internship, RequiredSkill } from './internshipTypes';
import { demoState, skillLabel } from './demo';

/* ---------- Persistence ---------- */

const KEY = 'next-gen-intern-state-v1';

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = demoState();
      saveState(s);
      return s;
    }
    return JSON.parse(raw) as AppState;
  } catch {
    return demoState();
  }
}

export function saveState(state: AppState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function resetState(): AppState {
  const s = demoState();
  saveState(s);
  return s;
}

/* ---------- Skill helpers ---------- */

export function skillEffectivePct(s: SkillRating): number {
  if (s.assessed && typeof s.quizScore === 'number') {
    // blend quiz (70%) with self-rating (30%) for assessed skills
    return Math.round(s.quizScore * 0.7 + s.percentage * 0.3);
  }
  return s.percentage;
}

export function overallSkillPct(skills: SkillRating[]): number {
  const assessed = skills.filter((s) => s.assessed || s.percentage > 0);
  if (!assessed.length) return 0;
  const total = assessed.reduce((sum, s) => sum + skillEffectivePct(s), 0);
  return Math.round(total / assessed.length);
}

export function getSkill(skills: SkillRating[], name: string): SkillRating | undefined {
  return skills.find((s) => s.skill.toLowerCase() === name.toLowerCase());
}

/* ---------- Profile completion ---------- */

export function profileCompletion(p: StudentProfile): number {
  let filled = 0;
  let total = 0;
  const check = (val: string) => {
    total++;
    if (val && val.trim().length > 0) filled++;
  };
  const checkArr = (arr: unknown[]) => {
    total++;
    if (arr.length > 0) filled++;
  };

  check(p.personal.fullName);
  check(p.personal.email);
  check(p.personal.phone);
  check(p.personal.location);
  check(p.academic.college);
  check(p.academic.degree);
  check(p.academic.branch);
  check(p.academic.currentYear);
  check(p.academic.graduationYear);
  check(p.academic.cgpa);
  check(p.academic.coursework);
  checkArr(p.interests);
  checkArr(p.skills.filter((s) => s.percentage > 0));
  checkArr(p.projects);
  checkArr(p.certifications);
  check(p.career.desiredRole);
  check(p.career.shortTerm);
  check(p.career.longTerm);
  check(p.career.industry);
  check(p.career.preferredDomain);
  check(p.preferences.location);

  return Math.round((filled / total) * 100);
}

/* ---------- Matching engine ---------- */

export interface MatchBreakdown {
  skill: number;
  interest: number;
  academic: number;
  career: number;
  preference: number;
  total: number;
}

export interface MatchResult {
  internship: Internship;
  breakdown: MatchBreakdown;
  reasons: string[];
  strengths: string[];
  gaps: RequiredSkill[];
  hasYou: string[];
  needToDevelop: string[];
  recommendedPrep: string[];
  prepWeeks: string;
}

function interestMatch(profileInterests: string[], internshipTech: string[]): number {
  if (!profileInterests.length || !internshipTech.length) return 0;
  const norm = (s: string) => s.toLowerCase();
  const pi = new Set(profileInterests.map(norm));
  const matches = internshipTech.filter((t) => pi.has(norm(t)));
  // also partial keyword overlap
  const keywordMatch = internshipTech.filter((t) =>
    profileInterests.some((i) => norm(i).includes(norm(t)) || norm(t).includes(norm(i)))
  );
  const denom = internshipTech.length;
  const hits = new Set([...matches, ...keywordMatch]);
  return Math.min(100, Math.round((hits.size / denom) * 100));
}

function academicMatch(internship: Internship, p: StudentProfile): number {
  let score = 50; // neutral baseline
  const branch = p.academic.branch.toLowerCase();
  if (branch.includes('computer') || branch.includes('software')) score += 30;
  if (branch.includes('data') || branch.includes('ai')) score += 25;
  if (branch.includes('information')) score += 20;
  if (p.academic.cgpa) {
    const cgpa = parseFloat(p.academic.cgpa);
    if (!isNaN(cgpa)) {
      if (cgpa >= 8) score += 15;
      else if (cgpa >= 7) score += 10;
      else if (cgpa >= 6) score += 5;
    }
  }
  // requirements text alignment
  const reqText = internship.requirements.join(' ').toLowerCase();
  if (reqText.includes('computer') && branch.includes('computer')) score += 10;
  if (reqText.includes('quantitative') && (branch.includes('math') || branch.includes('stat'))) score += 10;
  return Math.min(100, score);
}

function careerMatch(internship: Internship, p: StudentProfile): number {
  let score = 50;
  const role = internship.role.toLowerCase();
  const desired = p.career.desiredRole.toLowerCase();
  const domain = p.career.preferredDomain.toLowerCase();
  const longTerm = p.career.longTerm.toLowerCase();

  const keywordPairs: [string, string[]][] = [
    ['data scientist', ['data science', 'machine learning', 'ai/ml', 'ai']],
    ['data analyst', ['data analytics', 'business intelligence', 'analyst']],
    ['machine learning', ['machine learning', 'ai/ml', 'ai']],
    ['ai/ml', ['machine learning', 'ai', 'artificial intelligence']],
    ['python developer', ['python', 'software']],
    ['java developer', ['java', 'software']],
    ['web developer', ['web', 'software', 'full stack']],
    ['business intelligence', ['business intelligence', 'data analytics', 'analyst']],
    ['database', ['database', 'data', 'sql']],
    ['cloud', ['cloud', 'devops', 'software']],
  ];

  for (const [kw, related] of keywordPairs) {
    if (role.includes(kw)) {
      if (desired.includes(kw) || related.some((r) => desired.includes(r))) score += 25;
      if (domain.includes(kw) || related.some((r) => domain.includes(r))) score += 15;
      if (longTerm.includes(kw) || related.some((r) => longTerm.includes(r))) score += 10;
    }
  }
  return Math.min(100, score);
}

function preferenceMatch(internship: Internship, p: StudentProfile): number {
  let score = 50;
  if (internship.workMode === p.preferences.type) score += 20;
  if (internship.duration === p.preferences.duration) score += 15;
  if (p.preferences.pay === 'Either') score += 10;
  else if (internship.paid === p.preferences.pay) score += 15;
  if (
    p.preferences.location &&
    internship.location.toLowerCase().includes(p.preferences.location.toLowerCase())
  ) {
    score += 15;
  } else if (!p.preferences.location) {
    score += 5;
  }
  return Math.min(100, score);
}

function skillMatch(internship: Internship, skills: SkillRating[]): { score: number; met: RequiredSkill[]; gaps: RequiredSkill[]; have: string[]; need: string[] } {
  if (!internship.requiredSkills.length) return { score: 60, met: [], gaps: [], have: [], need: [] };
  let totalWeighted = 0;
  let maxWeighted = 0;
  const met: RequiredSkill[] = [];
  const gaps: RequiredSkill[] = [];
  const have: string[] = [];
  const need: string[] = [];

  for (const rs of internship.requiredSkills) {
    const studentSkill = getSkill(skills, rs.skill);
    const studentPct = studentSkill ? skillEffectivePct(studentSkill) : 0;
    maxWeighted += rs.required;
    const contribution = Math.min(studentPct, rs.required);
    totalWeighted += contribution;
    if (studentPct >= rs.required) {
      met.push(rs);
      have.push(rs.skill);
    } else {
      gaps.push(rs);
      need.push(rs.skill);
    }
  }
  const score = Math.round((totalWeighted / maxWeighted) * 100);
  return { score: Math.min(100, score), met, gaps, have, need };
}

function buildReasons(internship: Internship, p: StudentProfile, sm: ReturnType<typeof skillMatch>, breakdown: MatchBreakdown): string[] {
  const reasons: string[] = [];
  for (const rs of sm.met.slice(0, 3)) {
    const sk = getSkill(p.skills, rs.skill);
    const pct = sk ? skillEffectivePct(sk) : 0;
    reasons.push(`Your ${rs.skill} knowledge of ${pct}% meets the role's requirement of ${rs.required}%.`);
  }
  const branchMatch = internship.requirements.some((r) =>
    r.toLowerCase().includes('computer') && p.academic.branch.toLowerCase().includes('computer')
  );
  if (branchMatch) {
    reasons.push(`Your ${p.academic.branch} academic background matches the role's requirements.`);
  }
  const interestOverlap = internship.technologies.filter((t) =>
    p.interests.some((i) => i.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(i.toLowerCase()))
  );
  if (interestOverlap.length) {
    reasons.push(`Your interest in ${interestOverlap[0]} aligns with this internship.`);
  }
  if (breakdown.career >= 70) {
    reasons.push(`The role supports your goal of becoming a ${p.career.desiredRole || 'professional in this field'}.`);
  }
  if (internship.workMode === p.preferences.type) {
    reasons.push(`This is a ${internship.workMode} role matching your preference.`);
  }
  if (reasons.length === 0) {
    reasons.push('This opportunity overlaps with parts of your profile. Completing more assessments will improve accuracy.');
  }
  return reasons;
}

function buildPrep(gaps: RequiredSkill[], skills: SkillRating[]): string[] {
  const prepMap: Record<string, string[]> = {
    Python: ['Practice Pandas and NumPy workflows', 'Build a small data analysis script', 'Review exception handling and OOP'],
    SQL: ['Practice JOINs and aggregations', 'Write 20 analytical queries', 'Study subqueries and indexing'],
    'Machine Learning': ['Learn supervised learning', 'Practice regression and classification', 'Study evaluation metrics', 'Build a prediction project'],
    TensorFlow: ['Learn tensor basics', 'Build a Sequential model', 'Train on a sample dataset', 'Study loss functions and optimizers'],
    'Power BI': ['Learn Power Query', 'Study DAX basics', 'Build a 3-page dashboard', 'Practice data modeling'],
    Java: ['Review OOP concepts', 'Practice collections', 'Build a small backend service', 'Study exception handling'],
    Statistics: ['Learn descriptive statistics', 'Study distributions', 'Practice hypothesis testing', 'Solve 15 problems'],
    'Data Structures': ['Review arrays, linked lists, stacks', 'Practice trees and graphs', 'Solve 20 DSA problems'],
    Git: ['Learn branching and merging', 'Practice pull requests', 'Study rebasing and conflict resolution'],
    'Cloud Computing': ['Learn cloud fundamentals', 'Deploy a sample app', 'Study CI/CD basics'],
    JavaScript: ['Practice DOM manipulation', 'Build a small interactive UI', 'Study ES6+ features'],
    React: ['Learn components and props', 'Practice hooks', 'Build a small SPA'],
    HTML: ['Practice semantic HTML', 'Build accessible forms', 'Study HTML5 features'],
    CSS: ['Practice Flexbox and Grid', 'Build a responsive layout', 'Study animations'],
    'Database Management': ['Study normalization', 'Practice schema design', 'Learn indexing and constraints'],
  };
  const steps: string[] = [];
  gaps.forEach((g, i) => {
    const items = prepMap[g.skill] || [`Strengthen ${g.skill} fundamentals`, `Practice ${g.skill}`, `Build a ${g.skill} mini-project`];
    steps.push(`${i + 1}. ${items[0]}`);
    if (items[1]) steps.push(`${i + 2}. ${items[1]}`);
    if (items[2]) steps.push(`${i + 3}. ${items[2]}`);
  });
  return steps.slice(0, 6);
}

export function matchInternship(internship: Internship, p: StudentProfile): MatchResult {
  const sm = skillMatch(internship, p.skills);
  const interest = interestMatch(p.interests, internship.technologies);
  const academic = academicMatch(internship, p);
  const career = careerMatch(internship, p);
  const preference = preferenceMatch(internship, p);

  const total = Math.round(
    sm.score * 0.4 + interest * 0.2 + academic * 0.15 + career * 0.15 + preference * 0.1
  );

  const breakdown: MatchBreakdown = {
    skill: sm.score,
    interest,
    academic,
    career,
    preference,
    total,
  };

  const reasons = buildReasons(internship, p, sm, breakdown);
  const prepWeeks = sm.gaps.length === 0 ? '1–2 weeks (polish)' : `${2 + sm.gaps.length * 1.5 | 0}–${3 + sm.gaps.length * 2} weeks`;

  return {
    internship,
    breakdown,
    reasons,
    strengths: sm.have,
    gaps: sm.gaps,
    hasYou: sm.have,
    needToDevelop: sm.need,
    recommendedPrep: buildPrep(sm.gaps, p.skills),
    prepWeeks,
  };
}

export function matchAll(p: StudentProfile): MatchResult[] {
  return internships
    .map((i) => matchInternship(i, p))
    .sort((a, b) => b.breakdown.total - a.breakdown.total);
}

/* ---------- Recommended role ---------- */

export const POSSIBLE_ROLES = [
  'Data Analyst Intern',
  'Data Science Intern',
  'Machine Learning Intern',
  'AI/ML Intern',
  'Python Developer Intern',
  'Java Developer Intern',
  'Business Intelligence Intern',
  'Software Developer Intern',
  'Web Developer Intern',
  'Database Intern',
];

export interface RoleRecommendation {
  role: string;
  score: number;
  reasons: string[];
  skillsToStrengthen: string[];
}

export function recommendRole(p: StudentProfile): RoleRecommendation | null {
  if (!p.onboarded) return null;
  const scores: { role: string; score: number; reasons: string[]; skillsToStrengthen: string[] }[] = [];

  const python = getSkill(p.skills, 'Python');
  const sql = getSkill(p.skills, 'SQL');
  const ml = getSkill(p.skills, 'Machine Learning');
  const tf = getSkill(p.skills, 'TensorFlow');
  const pbi = getSkill(p.skills, 'Power BI');
  const java = getSkill(p.skills, 'Java');
  const stats = getSkill(p.skills, 'Statistics');
  const js = getSkill(p.skills, 'JavaScript');
  const react = getSkill(p.skills, 'React');
  const ds = getSkill(p.skills, 'Data Structures');

  const pyPct = python ? skillEffectivePct(python) : 0;
  const sqlPct = sql ? skillEffectivePct(sql) : 0;
  const mlPct = ml ? skillEffectivePct(ml) : 0;
  const tfPct = tf ? skillEffectivePct(tf) : 0;
  const pbiPct = pbi ? skillEffectivePct(pbi) : 0;
  const javaPct = java ? skillEffectivePct(java) : 0;
  const statsPct = stats ? skillEffectivePct(stats) : 0;
  const jsPct = js ? skillEffectivePct(js) : 0;
  const reactPct = react ? skillEffectivePct(react) : 0;
  const dsPct = ds ? skillEffectivePct(ds) : 0;

  const interests = p.interests.map((i) => i.toLowerCase());
  const hasInterest = (k: string) => interests.some((i) => i.includes(k));
  const desired = p.career.desiredRole.toLowerCase();

  const evaluate = (
    role: string,
    score: number,
    reasons: string[],
    skillsToStrengthen: string[]
  ) => {
    scores.push({ role, score: Math.min(100, score), reasons, skillsToStrengthen });
  };

  // Data Analyst
  {
    let s = 40; const r: string[] = []; const ss: string[] = [];
    if (sqlPct >= 60) { s += 20; r.push('Strong SQL foundation'); } else { ss.push('SQL'); }
    if (pyPct >= 60) { s += 15; r.push('Good Python knowledge'); } else { ss.push('Python'); }
    if (pbiPct >= 50) { s += 10; r.push('Power BI familiarity'); } else { ss.push('Power BI'); }
    if (hasInterest('data analytics') || hasInterest('business intelligence')) { s += 15; r.push('Interest in Data Analytics'); }
    if (desired.includes('analyst')) { s += 10; r.push('Career goal matches the role'); }
    if (statsPct >= 50) s += 5; else ss.push('Statistics');
    evaluate('Data Analyst Intern', s, r, ss);
  }
  // Data Science
  {
    let s = 40; const r: string[] = []; const ss: string[] = [];
    if (pyPct >= 65) { s += 20; r.push('Strong Python knowledge'); } else { ss.push('Python'); }
    if (sqlPct >= 55) { s += 10; r.push('SQL foundation'); } else { ss.push('SQL'); }
    if (mlPct >= 55) { s += 15; r.push('Machine Learning exposure'); } else { ss.push('Machine Learning'); }
    if (hasInterest('data science')) { s += 15; r.push('Interest in Data Science'); }
    if (desired.includes('data scientist')) { s += 15; r.push('Career goal matches the role'); }
    if (statsPct >= 50) s += 5; else ss.push('Statistics');
    if (tfPct < 50) ss.push('TensorFlow');
    evaluate('Data Science Intern', s, r, ss);
  }
  // Machine Learning
  {
    let s = 40; const r: string[] = []; const ss: string[] = [];
    if (pyPct >= 65) { s += 20; r.push('Strong Python knowledge'); } else { ss.push('Python'); }
    if (mlPct >= 60) { s += 20; r.push('Machine Learning fundamentals'); } else { ss.push('Machine Learning'); }
    if (tfPct >= 50) { s += 10; r.push('TensorFlow exposure'); } else { ss.push('TensorFlow'); }
    if (hasInterest('machine learning')) { s += 15; r.push('Interest in Machine Learning'); }
    if (desired.includes('machine learning') || desired.includes('ai')) { s += 10; r.push('Career goal alignment'); }
    if (statsPct < 55) ss.push('Statistics');
    evaluate('Machine Learning Intern', s, r, ss);
  }
  // AI/ML
  {
    let s = 40; const r: string[] = []; const ss: string[] = [];
    if (pyPct >= 70) { s += 20; r.push('Advanced Python'); } else { ss.push('Python'); }
    if (mlPct >= 65) { s += 20; r.push('Strong ML fundamentals'); } else { ss.push('Machine Learning'); }
    if (tfPct >= 55) { s += 15; r.push('TensorFlow capability'); } else { ss.push('TensorFlow'); }
    if (hasInterest('artificial intelligence') || hasInterest('machine learning')) { s += 15; r.push('Interest in AI/ML'); }
    if (desired.includes('ai') || desired.includes('ml')) { s += 10; r.push('Career goal alignment'); }
    evaluate('AI/ML Intern', s, r, ss);
  }
  // Python Developer
  {
    let s = 40; const r: string[] = []; const ss: string[] = [];
    if (pyPct >= 65) { s += 25; r.push('Strong Python knowledge'); } else { ss.push('Python'); }
    if (dsPct >= 55) { s += 15; r.push('Data Structures foundation'); } else { ss.push('Data Structures'); }
    if (sqlPct >= 50) { s += 10; r.push('SQL basics'); } else { ss.push('SQL'); }
    if (hasInterest('python') || hasInterest('software')) { s += 15; r.push('Interest in Python development'); }
    if (desired.includes('python') || desired.includes('developer')) { s += 10; r.push('Career goal alignment'); }
    evaluate('Python Developer Intern', s, r, ss);
  }
  // Java Developer
  {
    let s = 40; const r: string[] = []; const ss: string[] = [];
    if (javaPct >= 65) { s += 25; r.push('Strong Java knowledge'); } else { ss.push('Java'); }
    if (dsPct >= 55) { s += 15; r.push('Data Structures foundation'); } else { ss.push('Data Structures'); }
    if (sqlPct >= 50) { s += 10; r.push('SQL basics'); } else { ss.push('SQL'); }
    if (hasInterest('java')) { s += 15; r.push('Interest in Java development'); }
    if (desired.includes('java')) { s += 10; r.push('Career goal alignment'); }
    evaluate('Java Developer Intern', s, r, ss);
  }
  // Business Intelligence
  {
    let s = 40; const r: string[] = []; const ss: string[] = [];
    if (pbiPct >= 55) { s += 25; r.push('Power BI knowledge'); } else { ss.push('Power BI'); }
    if (sqlPct >= 55) { s += 20; r.push('SQL foundation'); } else { ss.push('SQL'); }
    if (statsPct >= 45) { s += 10; r.push('Statistics basics'); } else { ss.push('Statistics'); }
    if (hasInterest('business intelligence') || hasInterest('data analytics')) { s += 15; r.push('Interest in BI'); }
    if (desired.includes('bi') || desired.includes('business')) { s += 10; r.push('Career goal alignment'); }
    evaluate('Business Intelligence Intern', s, r, ss);
  }
  // Software Developer
  {
    let s = 40; const r: string[] = []; const ss: string[] = [];
    if (pyPct >= 60) { s += 15; r.push('Python knowledge'); } else { ss.push('Python'); }
    if (javaPct >= 60) { s += 15; r.push('Java knowledge'); } else if (javaPct > 0) { r.push('Java exposure'); } else { ss.push('Java'); }
    if (dsPct >= 55) { s += 15; r.push('Data Structures'); } else { ss.push('Data Structures'); }
    if (hasInterest('software')) { s += 15; r.push('Interest in Software Development'); }
    if (desired.includes('software') || desired.includes('developer')) { s += 10; r.push('Career goal alignment'); }
    evaluate('Software Developer Intern', s, r, ss);
  }
  // Web Developer
  {
    let s = 40; const r: string[] = []; const ss: string[] = [];
    if (jsPct >= 60) { s += 20; r.push('JavaScript knowledge'); } else { ss.push('JavaScript'); }
    if (reactPct >= 50) { s += 15; r.push('React exposure'); } else { ss.push('React'); }
    if (hasInterest('web')) { s += 20; r.push('Interest in Web Development'); }
    if (desired.includes('web') || desired.includes('front')) { s += 10; r.push('Career goal alignment'); }
    if (dsPct < 50) ss.push('Data Structures');
    evaluate('Web Developer Intern', s, r, ss);
  }
  // Database Intern
  {
    let s = 40; const r: string[] = []; const ss: string[] = [];
    if (sqlPct >= 65) { s += 30; r.push('Strong SQL knowledge'); } else { ss.push('SQL'); }
    if (hasInterest('database')) { s += 20; r.push('Interest in Database Management'); }
    if (desired.includes('database') || desired.includes('data')) { s += 10; r.push('Career goal alignment'); }
    if (pbiPct >= 45) s += 5; else ss.push('Power BI');
    evaluate('Database Intern', s, r, ss);
  }

  scores.sort((a, b) => b.score - a.score);
  const best = scores[0];
  if (!best) return null;
  return {
    role: best.role,
    score: best.score,
    reasons: best.reasons.length ? best.reasons : ['Profile partially aligns with this role.'],
    skillsToStrengthen: best.skillsToStrengthen.length ? best.skillsToStrengthen : ['Continue building skills'],
  };
}

/* ---------- Skill gap analysis ---------- */

export interface SkillGapItem {
  skill: string;
  current: number;
  required: number;
  gap: number;
  status: 'Ready' | 'Improve slightly' | 'Skill gap' | 'Major skill gap';
  topics: string[];
  practice: string;
  miniProject: string;
  estimatedWeeks: string;
}

export function analyzeGap(internship: Internship, skills: SkillRating[]): SkillGapItem[] {
  const prepMap: Record<string, { topics: string[]; practice: string; miniProject: string }> = {
    Python: { topics: ['Pandas & NumPy', 'Exception handling', 'OOP'], practice: 'Build a data analysis script', miniProject: 'EDA on a public dataset' },
    SQL: { topics: ['JOINs', 'Aggregations', 'Subqueries'], practice: 'Write 20 analytical queries', miniProject: 'Sales analytics queries' },
    'Machine Learning': { topics: ['Supervised learning', 'Regression', 'Classification', 'Evaluation metrics'], practice: 'Train 3 models', miniProject: 'Student Performance Prediction' },
    TensorFlow: { topics: ['Tensors', 'Sequential API', 'Loss & optimizers'], practice: 'Train a neural network', miniProject: 'Image classifier' },
    'Power BI': { topics: ['Power Query', 'DAX', 'Data modeling'], practice: 'Build a dashboard', miniProject: 'Retail sales dashboard' },
    Java: { topics: ['OOP', 'Collections', 'Exception handling'], practice: 'Build a small service', miniProject: 'Library management system' },
    Statistics: { topics: ['Descriptive stats', 'Distributions', 'Hypothesis testing'], practice: 'Solve 15 problems', miniProject: 'A/B test analysis' },
    'Data Structures': { topics: ['Arrays', 'Linked lists', 'Trees'], practice: 'Solve 20 DSA problems', miniProject: 'Implement a balanced tree' },
    Git: { topics: ['Branching', 'Merging', 'Pull requests'], practice: 'Contribute to a repo', miniProject: 'Open source PR' },
    'Cloud Computing': { topics: ['Cloud fundamentals', 'IaC', 'CI/CD'], practice: 'Deploy a sample app', miniProject: 'CI/CD pipeline' },
    JavaScript: { topics: ['ES6+', 'DOM', 'Async'], practice: 'Build interactive UI', miniProject: 'Todo app with localStorage' },
    React: { topics: ['Components', 'Hooks', 'State'], practice: 'Build a SPA', miniProject: 'Portfolio site' },
    HTML: { topics: ['Semantic HTML', 'Forms', 'Accessibility'], practice: 'Build accessible pages', miniProject: 'Form-heavy landing page' },
    CSS: { topics: ['Flexbox', 'Grid', 'Animations'], practice: 'Build responsive layouts', miniProject: 'Responsive landing page' },
    'Database Management': { topics: ['Normalization', 'Indexing', 'Schema design'], practice: 'Design a schema', miniProject: 'Normalized DB schema' },
  };

  return internship.requiredSkills.map((rs) => {
    const sk = getSkill(skills, rs.skill);
    const current = sk ? skillEffectivePct(sk) : 0;
    const gap = Math.max(0, rs.required - current);
    let status: SkillGapItem['status'] = 'Ready';
    if (gap > 0 && gap <= 10) status = 'Improve slightly';
    else if (gap > 10 && gap <= 25) status = 'Skill gap';
    else if (gap > 25) status = 'Major skill gap';
    const prep = prepMap[rs.skill] || { topics: [`${rs.skill} fundamentals`], practice: `Practice ${rs.skill}`, miniProject: `${rs.skill} mini-project` };
    const weeks = gap === 0 ? '0 weeks' : gap <= 10 ? '1 week' : gap <= 25 ? '2–3 weeks' : '4–6 weeks';
    return {
      skill: rs.skill,
      current,
      required: rs.required,
      gap,
      status,
      topics: prep.topics,
      practice: prep.practice,
      miniProject: prep.miniProject,
      estimatedWeeks: weeks,
    };
  });
}

/* ---------- Quiz helpers ---------- */

export function recordQuiz(
  state: AppState,
  skill: string,
  correct: number,
  total: number,
  questions: QuizResult['questions'],
  answers: QuizResult['answers'],
): AppState {
  const percentage = Math.round((correct / total) * 100);
  const result: QuizResult = {
    skill,
    correct,
    total,
    percentage,
    label: skillLabel(percentage),
    takenAt: new Date().toISOString(),
    questions,
    answers,
  };
  const quizResults = [...state.quizResults.filter((r) => r.skill !== skill), result];
  const hasSkill = state.profile.skills.some((s) => s.skill.toLowerCase() === skill.toLowerCase());
  const skills = state.profile.skills.map((s) =>
    s.skill.toLowerCase() === skill.toLowerCase()
      ? { ...s, assessed: true, quizScore: percentage, percentage }
      : s
  );
  if (!hasSkill) {
    skills.push({
      skill,
      level: percentage >= 70 ? 'Intermediate' : 'Beginner',
      percentage,
      assessed: true,
      quizScore: percentage,
    });
  }
  return {
    ...state,
    quizResults,
    profile: { ...state.profile, skills },
  };
}

export function toggleSaved(state: AppState, id: string): AppState {
  const saved = state.savedInternships.includes(id)
    ? state.savedInternships.filter((s) => s !== id)
    : [...state.savedInternships, id];
  return { ...state, savedInternships: saved };
}

export function toggleRoadmapStep(state: AppState, week: number): AppState {
  const roadmap = state.roadmap.map((r) => (r.week === week ? { ...r, completed: !r.completed } : r));
  return { ...state, roadmap };
}

export function setRoadmap(state: AppState, roadmap: RoadmapStep[]): AppState {
  return { ...state, roadmap };
}

export function getInternship(id: string): Internship | undefined {
  return internships.find((i) => i.id === id);
}

export function careerReadiness(p: StudentProfile, quizResults: QuizResult[]): number {
  const completion = profileCompletion(p);
  const skills = overallSkillPct(p.skills);
  const assessedAvg = quizResults.length
    ? Math.round(quizResults.reduce((s, r) => s + r.percentage, 0) / quizResults.length)
    : 0;
  const projectsScore = Math.min(100, p.projects.length * 25);
  const certsScore = Math.min(100, p.certifications.length * 20);
  const careerScore = p.career.desiredRole ? 80 : 30;
  return Math.round(
    completion * 0.2 + skills * 0.25 + assessedAvg * 0.25 + projectsScore * 0.1 + certsScore * 0.1 + careerScore * 0.1
  );
}

export function nextAction(p: StudentProfile, quizResults: QuizResult[]): string {
  const completion = profileCompletion(p);
  if (completion < 60) return 'Complete your profile to improve match accuracy';
  if (quizResults.length < 3) return 'Take more skill assessments';
  const assessed = new Set(quizResults.map((r) => r.skill));
  const lowSkill = p.skills.find((s) => assessed.has(s.skill) && (s.quizScore ?? 0) < 60);
  if (lowSkill) return `Retake ${lowSkill.skill} assessment to improve readiness`;
  if (p.projects.length < 2) return 'Add projects to strengthen your profile';
  return 'Apply to your top internship match';
}
