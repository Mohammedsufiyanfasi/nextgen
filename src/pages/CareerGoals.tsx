import { useApp } from '../context/AppContext';
import { Badge, EmptyState } from '../components/ui';
import { CircularProgress, ProgressBar } from '../components/ProgressBar';
import { careerReadiness, skillEffectivePct } from '../data/engine';
import { POSSIBLE_ROLES } from '../data/engine';
import { navigate } from '../router';
import { Target, TrendingUp, Sparkles, ArrowRight, CheckCircle2, Briefcase, Building2 } from 'lucide-react';

export function CareerGoals() {
  const { state, recommendation } = useApp();
  const p = state.profile;
  const readiness = careerReadiness(p, state.quizResults);

  const skillsRemaining = p.skills
    .filter((s) => s.assessed && (s.quizScore ?? 0) < 70)
    .sort((a, b) => (a.quizScore ?? 0) - (b.quizScore ?? 0));

  if (!p.career.desiredRole && !p.onboarded) {
    return (
      <EmptyState
        icon={Target}
        title="No career goal selected"
        description="Complete your profile to set career goals and get recommendations."
        action={<button onClick={() => navigate('onboarding')} className="btn-primary">Set Career Goal</button>}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-ink">Career Goals</h1>
        <p className="text-ink/60 text-sm mt-1">Your career roadmap and readiness at a glance.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current goal */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Target size={20} className="text-electric" />
            <h2 className="font-semibold text-ink">Current Career Goal</h2>
          </div>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs text-ink/50 font-medium mb-1">Target Role</div>
                <div className="font-semibold text-ink">{p.career.desiredRole || 'Not set'}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs text-ink/50 font-medium mb-1">Target Industry</div>
                <div className="font-semibold text-ink">{p.career.industry || 'Not set'}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs text-ink/50 font-medium mb-1">Short-Term Goal</div>
                <div className="font-semibold text-ink text-sm">{p.career.shortTerm || 'Not set'}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs text-ink/50 font-medium mb-1">Long-Term Goal</div>
                <div className="font-semibold text-ink text-sm">{p.career.longTerm || 'Not set'}</div>
              </div>
            </div>
            {p.career.targetCompanies && (
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs text-ink/50 font-medium mb-1">Target Companies</div>
                <div className="font-semibold text-ink text-sm">{p.career.targetCompanies}</div>
              </div>
            )}
            <button onClick={() => navigate('profile')} className="btn-secondary text-sm">Edit Career Goals</button>
          </div>
        </div>

        {/* Readiness */}
        <div className="card p-6 flex flex-col items-center">
          <h2 className="font-semibold text-ink self-start mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-electric" /> Readiness</h2>
          <CircularProgress value={readiness} size={120} stroke={10} color={readiness >= 70 ? '#16A34A' : '#087CFF'} label={`${readiness}%`} sublabel="Career Ready" />
          <div className="mt-4 text-center text-sm text-ink/60">
            {readiness >= 70 ? 'You are on track!' : 'Keep building your skills.'}
          </div>
        </div>
      </div>

      {/* Recommended role */}
      {recommendation && (
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-electric" />
            <h2 className="font-semibold text-ink">Recommended Role to Prepare For</h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-electric to-cyan flex items-center justify-center text-white">
              <Briefcase size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-ink">{recommendation.role}</h3>
              <span className="text-sm text-ink/50">{recommendation.score}% compatibility</span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold text-ink mb-2">Why?</div>
              <div className="space-y-2">
                {recommendation.reasons.map((r, i) => (
                  <div key={i} className="flex gap-2 text-sm text-ink/70"><CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" /> {r}</div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-ink mb-2">Skills to Strengthen</div>
              <div className="flex flex-wrap gap-2">
                {recommendation.skillsToStrengthen.map((s) => <Badge key={s} variant="gap">{s}</Badge>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skills remaining */}
      <div className="card p-6">
        <h2 className="font-semibold text-ink mb-4">Skills Remaining</h2>
        {skillsRemaining.length > 0 ? (
          <div className="space-y-3">
            {skillsRemaining.map((s) => (
              <div key={s.skill}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-ink/70">{s.skill}</span>
                  <span className="font-semibold text-warning">{skillEffectivePct(s)}%</span>
                </div>
                <ProgressBar value={skillEffectivePct(s)} size="sm" color="warning" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-success flex items-center gap-2"><CheckCircle2 size={16} /> All assessed skills are above 70%!</p>
        )}
      </div>

      {/* All possible roles */}
      <div className="card p-6">
        <h2 className="font-semibold text-ink mb-4 flex items-center gap-2"><Building2 size={18} className="text-electric" /> Explore Roles</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {POSSIBLE_ROLES.map((role) => (
            <button key={role} onClick={() => navigate('internships')} className={`text-left p-3 rounded-xl border transition ${recommendation?.role === role ? 'border-electric bg-electric/5' : 'border-slate-200 hover:border-electric/40'}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink">{role}</span>
                {recommendation?.role === role && <Badge variant="match">Recommended</Badge>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
