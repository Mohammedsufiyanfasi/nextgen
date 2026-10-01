import { useApp } from '../context/AppContext';
import { CircularProgress, ProgressBar } from '../components/ProgressBar';
import { Badge, StatCard } from '../components/ui';
import { profileCompletion, overallSkillPct, careerReadiness, skillEffectivePct } from '../data/engine';
import { navigate } from '../router';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { UserCircle, Brain, TrendingUp, Award, CheckCircle2, ClipboardList, GraduationCap, Target } from 'lucide-react';

export function StudentProgress() {
  const { state } = useApp();
  const p = state.profile;
  const completion = profileCompletion(p);
  const skillPct = overallSkillPct(p.skills);
  const readiness = careerReadiness(p, state.quizResults);

  const roadmapProgress = Math.round((state.roadmap.filter((r) => r.completed).length / state.roadmap.length) * 100);
  const assessedSkills = p.skills.filter((s) => s.assessed);

  // Simulated progress over time based on quiz results
  const progressData = state.quizResults
    .slice()
    .sort((a, b) => new Date(a.takenAt).getTime() - new Date(b.takenAt).getTime())
    .map((r, i) => ({
      name: `Q${i + 1}`,
      score: r.percentage,
      skill: r.skill,
    }));

  const radarData = assessedSkills.map((s) => ({ skill: s.skill, value: skillEffectivePct(s) }));

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-ink">Student Progress</h1>
        <p className="text-ink/60 text-sm mt-1">Track your growth over time.</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={UserCircle} label="Profile Completion" value={`${completion}%`} color="electric" />
        <StatCard icon={Brain} label="Skill Knowledge" value={`${skillPct}%`} color="cyan" />
        <StatCard icon={TrendingUp} label="Career Readiness" value={`${readiness}%`} color="success" />
        <StatCard icon={GraduationCap} label="Roadmap Progress" value={`${roadmapProgress}%`} color="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Readiness donut */}
        <div className="card p-6 flex flex-col items-center">
          <h2 className="font-semibold text-ink self-start mb-4">Overall Readiness</h2>
          <CircularProgress value={readiness} size={140} stroke={12} color={readiness >= 70 ? '#16A34A' : '#087CFF'} label={`${readiness}%`} sublabel="Ready" />
          <div className="mt-4 text-center text-sm text-ink/60">
            {readiness >= 70 ? 'Great progress!' : 'Keep working to improve.'}
          </div>
        </div>

        {/* Radar */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-4">Skill Profile</h2>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: '#64748B' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94A3B8' }} />
                <Radar dataKey="value" stroke="#087CFF" fill="#087CFF" fillOpacity={0.3} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-ink/40 text-center py-12">Take assessments to see your skill radar.</p>}
        </div>

        {/* Quiz summary */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-4">Assessment Summary</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-electric/5 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-electric">{state.quizResults.length}</div>
              <div className="text-xs text-ink/50">Quizzes Taken</div>
            </div>
            <div className="bg-success/5 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-success">{state.quizResults.filter((r) => r.percentage >= 75).length}</div>
              <div className="text-xs text-ink/50">Strong Scores</div>
            </div>
          </div>
          <div className="space-y-2">
            {state.quizResults.slice(0, 4).map((r) => (
              <div key={r.skill} className="flex items-center justify-between text-sm">
                <span className="text-ink/70">{r.skill}</span>
                <div className="flex items-center gap-2">
                  <ProgressBar value={r.percentage} size="sm" color={r.percentage >= 70 ? 'success' : 'warning'} />
                  <span className="font-semibold text-ink text-xs w-10">{r.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress over time */}
      <div className="card p-6">
        <h2 className="font-semibold text-ink mb-4">Score Progress Over Time</h2>
        {progressData.length > 1 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#087CFF" strokeWidth={2} dot={{ fill: '#087CFF', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-ink/40 text-center py-8">Take at least 2 quizzes to see your progress trend.</p>
        )}
      </div>

      {/* Milestones */}
      <div className="card p-6">
        <h2 className="font-semibold text-ink mb-4">Milestones</h2>
        <div className="space-y-3">
          {[
            { label: 'Profile Created', done: p.onboarded, icon: UserCircle },
            { label: 'First Assessment Taken', done: state.quizResults.length >= 1, icon: ClipboardList },
            { label: '3 Assessments Completed', done: state.quizResults.length >= 3, icon: Award },
            { label: 'Roadmap Started', done: state.roadmap.some((r) => r.completed), icon: GraduationCap },
            { label: 'Roadmap 50% Complete', done: roadmapProgress >= 50, icon: Target },
            { label: 'Internship Saved', done: state.savedInternships.length > 0, icon: Award },
          ].map((m, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${m.done ? 'bg-success/5' : 'bg-slate-50'}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${m.done ? 'bg-success text-white' : 'bg-slate-200 text-ink/40'}`}>
                {m.done ? <CheckCircle2 size={18} /> : <m.icon size={16} />}
              </div>
              <span className={`text-sm font-medium ${m.done ? 'text-ink' : 'text-ink/50'}`}>{m.label}</span>
              {m.done && <Badge variant="ready">Done</Badge>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
