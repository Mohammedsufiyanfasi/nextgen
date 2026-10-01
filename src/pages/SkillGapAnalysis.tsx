import { useApp } from '../context/AppContext';
import { getInternship, analyzeGap, matchAll } from '../data/engine';
import { Badge, EmptyState } from '../components/ui';
import { ProgressBar } from '../components/ProgressBar';
import { navigate } from '../router';
import { AlertTriangle, CheckCircle2, GraduationCap, Target, ArrowRight, RotateCcw, BookOpen } from 'lucide-react';

export function SkillGapAnalysis({ id }: { id?: string }) {
  const { state } = useApp();

  // If id provided, show gap analysis for specific internship
  if (id) {
    const internship = getInternship(id);
    if (!internship) {
      return <EmptyState title="Internship not found" action={<button onClick={() => navigate('skill-gap')} className="btn-primary">Back</button>} />;
    }
    const gaps = analyzeGap(internship, state.profile.skills);

    return (
      <div className="space-y-6 animate-fadeIn">
        <button onClick={() => navigate('internship-details', { id })} className="text-sm text-ink/60 hover:text-electric">← Back</button>

        <div>
          <h1 className="text-2xl font-bold text-ink">Skill Gap Analysis</h1>
          <p className="text-ink/60 text-sm mt-1">{internship.role} · {internship.company}</p>
        </div>

        {/* Summary table */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-4">Skill Comparison</h2>
          <div className="space-y-4">
            {gaps.map((g) => (
              <div key={g.skill} className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-ink text-sm">{g.skill}</span>
                  <Badge variant={g.status === 'Ready' ? 'ready' : g.status === 'Improve slightly' ? 'dev' : g.status === 'Skill gap' ? 'gap' : 'major'}>
                    {g.status === 'Ready' ? '✓ Ready' : g.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                  <div><span className="text-ink/50">Current: </span><span className="font-semibold text-ink">{g.current}%</span></div>
                  <div><span className="text-ink/50">Required: </span><span className="font-semibold text-ink">{g.required}%</span></div>
                  <div><span className="text-ink/50">Gap: </span><span className={`font-semibold ${g.gap > 0 ? 'text-warning' : 'text-success'}`}>{g.gap > 0 ? `${g.gap}%` : 'None'}</span></div>
                </div>
                <div className="flex gap-1">
                  <div className="flex-1"><ProgressBar value={g.current} size="sm" color="electric" /></div>
                  <div className="flex-1"><ProgressBar value={g.required} size="sm" color="cyan" /></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed improvement plans */}
        <div className="space-y-4">
          <h2 className="font-semibold text-ink text-lg">How to Improve</h2>
          {gaps.filter((g) => g.gap > 0).map((g) => (
            <div key={g.skill} className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${g.gap > 25 ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'}`}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-ink">{g.skill}</h3>
                  <p className="text-xs text-ink/50">Your current knowledge is {g.current >= 40 ? 'developing' : 'at foundation level'}.</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-2">Recommended Topics</div>
                  <ol className="space-y-1.5">
                    {g.topics.map((t, i) => <li key={i} className="flex gap-2 text-ink/70"><span className="text-electric font-bold">{i + 1}.</span> {t}</li>)}
                  </ol>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Practice Activity</div>
                    <p className="text-sm text-ink/70">{g.practice}</p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Mini Project</div>
                    <p className="text-sm text-ink/70 font-medium">{g.miniProject}</p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-1">Estimated Duration</div>
                    <p className="text-sm text-ink/70 font-medium">{g.estimatedWeeks}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => navigate('quiz', { skill: g.skill })} className="btn-secondary text-xs mt-4">
                <RotateCcw size={14} /> Retake {g.skill} Assessment
              </button>
            </div>
          ))}
          {gaps.every((g) => g.gap === 0) && (
            <div className="card p-6 text-center">
              <CheckCircle2 size={32} className="text-success mx-auto mb-2" />
              <p className="text-ink font-medium">You meet all required skill levels for this role!</p>
            </div>
          )}
        </div>

        <button onClick={() => navigate('roadmap')} className="btn-primary w-full">
          <GraduationCap size={16} /> Go to Learning Roadmap
        </button>
      </div>
    );
  }

  // Overview: show gap analysis for top match
  const matches = matchAll(state.profile);
  const topMatch = matches[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-ink">Skill Gap Analysis</h1>
        <p className="text-ink/60 text-sm mt-1">Compare your skills against internship requirements.</p>
      </div>

      {topMatch ? (
        <div className="space-y-4">
          <p className="text-sm text-ink/60">Showing gaps for your top match: <span className="font-semibold text-ink">{topMatch.internship.role}</span></p>
          <SkillGapAnalysis id={topMatch.internship.id} />
        </div>
      ) : (
        <EmptyState icon={Target} title="No internship matches yet" description="Complete your profile to get matched." action={<button onClick={() => navigate('profile')} className="btn-primary">Complete Your Profile</button>} />
      )}

      {/* All internships gap selector */}
      <div className="card p-6">
        <h2 className="font-semibold text-ink mb-3">Analyze Another Internship</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {matches.slice(0, 6).map((m) => (
            <button key={m.internship.id} onClick={() => navigate('skill-gap', { id: m.internship.id })} className="text-left p-3 rounded-xl bg-slate-50 hover:bg-electric/5 transition flex items-center gap-3">
              <BookOpen size={16} className="text-electric shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ink truncate">{m.internship.role}</div>
                <div className="text-xs text-ink/50">{m.internship.company}</div>
              </div>
              <ArrowRight size={14} className="text-ink/30" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
