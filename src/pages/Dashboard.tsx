import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useDashboardData } from '../hooks/useDashboardData';
import { CircularProgress, ProgressBar } from '../components/ProgressBar';
import { StatCard, MatchRing, Badge } from '../components/ui';
import { navigate } from '../router';
import {
  UserCircle,
  Brain,
  Briefcase,
  TrendingUp,
  ArrowRight,
  Target,
  Bookmark,
  Sparkles,
  ClipboardList,
  Zap,
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from 'recharts';
import { skillEffectivePct } from '../data/engine';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function Dashboard() {
  const { state } = useApp();
  const data = useDashboardData();
  const [showAllMatches, setShowAllMatches] = useState(false);

  const firstName = state.profile.personal.fullName.split(' ')[0] || 'Student';
  const radarData = state.profile.skills
    .filter((s) => s.percentage > 0)
    .slice(0, 8)
    .map((s) => ({ skill: s.skill, value: skillEffectivePct(s) }));

  const skillBars = state.profile.skills
    .filter((s) => s.assessed)
    .map((s) => ({ skill: s.skill, pct: skillEffectivePct(s) }));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Greeting header */}
      <div className="relative overflow-hidden rounded-2xl bg-navy-950 text-white p-6 lg:p-8">
        <div className="absolute inset-0 bg-hero-radial" />
        <div className="absolute inset-0 bg-grid-cyan bg-grid opacity-20" />
        <img src="/banner.svg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" aria-hidden="true" />
        <div className="relative">
          <h1 className="text-2xl lg:text-3xl font-display font-bold">
            {greeting()}, {firstName} 👋
          </h1>
          <p className="text-white/60 mt-1 text-sm lg:text-base">Here is your personalized internship and career overview.</p>
          <div className="mt-4 inline-flex items-center gap-2 chip bg-cyan/15 text-cyan border border-cyan/30">
            <Zap size={14} /> Next Action: {data.action}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={UserCircle} label="Profile Completion" value={`${data.completion}%`} sub={data.completion < 100 ? 'Keep going!' : 'Complete'} color="electric" />
        <StatCard icon={Brain} label="Overall Skill Knowledge" value={`${data.skillPct}%`} sub={`${state.quizResults.length} assessments`} color="cyan" />
        <StatCard icon={Briefcase} label="Internship Matches" value={data.matchesCount} sub={data.bestMatch ? `Best: ${data.bestMatch.breakdown.total}%` : ''} color="success" />
        <StatCard icon={TrendingUp} label="Career Readiness" value={`${data.readiness}%`} sub={data.readiness >= 70 ? 'On track' : 'Building up'} color="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Radar chart */}
        <div className="card p-6 lg:col-span-1">
          <h2 className="font-semibold text-ink mb-4">Skill Profile</h2>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: '#64748B' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94A3B8' }} />
                <Radar dataKey="value" stroke="#087CFF" fill="#087CFF" fillOpacity={0.3} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-ink/40 text-center py-10">Add skills to see your profile.</p>
          )}
        </div>

        {/* Skill bars */}
        <div className="card p-6 lg:col-span-1">
          <h2 className="font-semibold text-ink mb-4">Assessed Skills</h2>
          {skillBars.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={skillBars} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis type="category" dataKey="skill" tick={{ fontSize: 10, fill: '#64748B' }} width={90} />
                <Tooltip cursor={{ fill: '#F1F5F9' }} />
                <Bar dataKey="pct" radius={[0, 6, 6, 0]}>
                  {skillBars.map((entry, i) => (
                    <Cell key={i} fill={entry.pct >= 70 ? '#16A34A' : entry.pct >= 40 ? '#087CFF' : '#F59E0B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-10">
              <p className="text-sm text-ink/40 mb-3">No skill assessments completed yet.</p>
              <button onClick={() => navigate('assessment')} className="btn-primary text-sm">Take Skill Assessment</button>
            </div>
          )}
        </div>

        {/* Readiness donut */}
        <div className="card p-6 lg:col-span-1 flex flex-col items-center justify-center">
          <h2 className="font-semibold text-ink mb-4 self-start">Career Readiness</h2>
          <CircularProgress value={data.readiness} size={140} stroke={12} color={data.readiness >= 70 ? '#16A34A' : '#087CFF'} label={`${data.readiness}%`} sublabel="Ready" />
          <div className="mt-4 grid grid-cols-2 gap-3 w-full text-sm">
            <div className="text-center">
              <div className="text-xs text-ink/50">Strongest Skill</div>
              <div className="font-semibold text-ink">{data.strongest?.skill ?? '—'}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-ink/50">Needs Work</div>
              <div className="font-semibold text-ink">{data.weakest?.skill ?? '—'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Best match + recommended role */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Best match */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink">Best Internship Match</h2>
            <button onClick={() => navigate('internships')} className="text-xs text-electric font-medium hover:underline">View all →</button>
          </div>
          {data.bestMatch ? (
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0" style={{ background: data.bestMatch.internship.logoColor }}>
                {data.bestMatch.internship.company[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-ink">{data.bestMatch.internship.role}</h3>
                <p className="text-sm text-ink/60">{data.bestMatch.internship.company}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="strong">{data.bestMatch.breakdown.total}% Match</Badge>
                  <span className="text-xs text-ink/50">{data.bestMatch.internship.workMode} · {data.bestMatch.internship.duration}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => navigate('ai-match', { id: data.bestMatch.internship.id })} className="btn-primary text-xs">Match Analysis</button>
                  <button onClick={() => navigate('internship-details', { id: data.bestMatch.internship.id })} className="btn-secondary text-xs">Details</button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink/40">No matches yet. Complete your profile.</p>
          )}
        </div>

        {/* Recommended role */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink">Recommended Role</h2>
            <Target size={18} className="text-electric" />
          </div>
          {data.recommendation ? (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric to-cyan flex items-center justify-center text-white">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-ink text-lg">{data.recommendation.role}</h3>
                  <span className="text-xs text-ink/50">{data.recommendation.score}% compatibility</span>
                </div>
              </div>
              <div className="space-y-1.5 mb-3">
                {data.recommendation.reasons.slice(0, 3).map((r, i) => (
                  <div key={i} className="flex gap-2 text-sm text-ink/70">
                    <span className="text-success">✓</span> {r}
                  </div>
                ))}
              </div>
              {data.recommendation.skillsToStrengthen.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs text-ink/50">Strengthen:</span>
                  {data.recommendation.skillsToStrengthen.map((s) => (
                    <Badge key={s} variant="gap">{s}</Badge>
                  ))}
                </div>
              )}
              <button onClick={() => navigate('career')} className="btn-secondary text-xs mt-3 w-full">View Career Goals</button>
            </div>
          ) : (
            <p className="text-sm text-ink/40">Complete your profile for a role recommendation.</p>
          )}
        </div>
      </div>

      {/* Top matches list */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-ink">Top Internship Matches</h2>
          <button onClick={() => navigate('internships')} className="text-xs text-electric font-medium hover:underline">Explore all →</button>
        </div>
        <div className="space-y-3">
          {(showAllMatches ? data.matches : data.matches.slice(0, 5)).map((m) => (
            <div key={m.internship.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition cursor-pointer" onClick={() => navigate('internship-details', { id: m.internship.id })}>
              <MatchRing value={m.breakdown.total} size={48} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-ink text-sm">{m.internship.role}</div>
                <div className="text-xs text-ink/50">{m.internship.company} · {m.internship.location}</div>
              </div>
              <div className="hidden sm:flex gap-1.5">
                {m.internship.requiredSkills.slice(0, 3).map((s) => (
                  <Badge key={s.skill} variant="neutral">{s.skill}</Badge>
                ))}
              </div>
              <ArrowRight size={16} className="text-ink/30" />
            </div>
          ))}
        </div>
        {data.matches.length > 5 && (
          <button onClick={() => setShowAllMatches(!showAllMatches)} className="btn-ghost text-xs w-full mt-3">
            {showAllMatches ? 'Show less' : `Show all ${data.matches.length} matches`}
          </button>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <button onClick={() => navigate('assessment')} className="card p-5 text-left hover:shadow-card transition group">
          <ClipboardList size={24} className="text-electric mb-2 group-hover:scale-110 transition" />
          <div className="font-semibold text-ink text-sm">Take Assessment</div>
          <div className="text-xs text-ink/50">Quiz your skills</div>
        </button>
        <button onClick={() => navigate('roadmap')} className="card p-5 text-left hover:shadow-card transition group">
          <Target size={24} className="text-cyan mb-2 group-hover:scale-110 transition" />
          <div className="font-semibold text-ink text-sm">Learning Path</div>
          <div className="text-xs text-ink/50">Your roadmap</div>
        </button>
        <button onClick={() => navigate('saved')} className="card p-5 text-left hover:shadow-card transition group">
          <Bookmark size={24} className="text-success mb-2 group-hover:scale-110 transition" />
          <div className="font-semibold text-ink text-sm">Saved Jobs</div>
          <div className="text-xs text-ink/50">{state.savedInternships.length} saved</div>
        </button>
      </div>
    </div>
  );
}
