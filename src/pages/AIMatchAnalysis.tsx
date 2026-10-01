import { useApp } from '../context/AppContext';
import { getInternship, matchInternship, matchAll } from '../data/engine';
import { Badge, MatchRing, EmptyState } from '../components/ui';
import { ProgressBar } from '../components/ProgressBar';
import { navigate } from '../router';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, TrendingUp, Bookmark } from 'lucide-react';

export function AIMatchAnalysis({ id }: { id?: string }) {
  const { state } = useApp();

  // If id provided, show single internship analysis. Otherwise show overview of all.
  if (id) {
    const internship = getInternship(id);
    if (!internship) {
      return <EmptyState title="Internship not found" action={<button onClick={() => navigate('ai-match')} className="btn-primary">Back to AI Match</button>} />;
    }
    const match = matchInternship(internship, state.profile);

    const factors: [string, number, string][] = [
      ['Skills', match.breakdown.skill, '40%'],
      ['Interests', match.breakdown.interest, '20%'],
      ['Academic', match.breakdown.academic, '15%'],
      ['Career Goal', match.breakdown.career, '15%'],
      ['Preferences', match.breakdown.preference, '10%'],
    ];

    return (
      <div className="space-y-6 animate-fadeIn">
        <button onClick={() => navigate('internships')} className="text-sm text-ink/60 hover:text-electric">← Back</button>

        {/* Match score */}
        <div className="card p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-radial opacity-5" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 chip bg-electric/10 text-electric mb-4">
              <Sparkles size={14} /> Your Match
            </div>
            <div className="flex items-center justify-center mb-4">
              <MatchRing value={match.breakdown.total} size={120} />
            </div>
            <h1 className="text-2xl font-bold text-ink">{internship.role}</h1>
            <p className="text-ink/60">{internship.company} · {internship.location}</p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-4">Match Breakdown</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {factors.map(([label, val, weight]) => (
              <div key={label} className="bg-slate-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-sm font-medium text-ink">{label}</span>
                    <span className="text-xs text-ink/40 ml-2">(weight: {weight})</span>
                  </div>
                  <span className="text-lg font-bold text-ink">{val}%</span>
                </div>
                <ProgressBar value={val} color={val >= 70 ? 'success' : val >= 40 ? 'electric' : 'warning'} />
              </div>
            ))}
          </div>
        </div>

        {/* Why we recommended this */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-4">Why we recommended this</h2>
          {match.reasons.length > 0 ? (
            <div className="space-y-2">
              {match.reasons.map((r, i) => (
                <div key={i} className="flex gap-2 text-sm text-ink/75"><CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" /> {r}</div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink/40">Not enough profile information to evaluate this factor.</p>
          )}
        </div>

        {/* Strengths & gaps */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="font-semibold text-ink mb-3 flex items-center gap-2"><CheckCircle2 size={18} className="text-success" /> Skills You Already Have</h2>
            {match.hasYou.length > 0 ? (
              <div className="flex flex-wrap gap-2">{match.hasYou.map((s) => <Badge key={s} variant="ready">{s}</Badge>)}</div>
            ) : <p className="text-sm text-ink/40">No matching skills yet. Complete your assessments.</p>}
          </div>
          <div className="card p-6">
            <h2 className="font-semibold text-ink mb-3 flex items-center gap-2"><AlertTriangle size={18} className="text-warning" /> Skills You Need to Develop</h2>
            {match.needToDevelop.length > 0 ? (
              <div className="flex flex-wrap gap-2">{match.needToDevelop.map((s) => <Badge key={s} variant="gap">{s}</Badge>)}</div>
            ) : <p className="text-sm text-success">You meet all required skills!</p>}
          </div>
        </div>

        {/* Recommended prep */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-4">Recommended Preparation</h2>
          <div className="text-sm text-ink/50 mb-3">Estimated time: <span className="font-semibold text-ink">{match.prepWeeks}</span></div>
          <ol className="space-y-2">
            {match.recommendedPrep.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink/75 bg-slate-50 rounded-lg px-3 py-2">{step}</li>
            ))}
          </ol>
          <div className="flex gap-3 mt-4">
            <button onClick={() => navigate('roadmap')} className="btn-primary text-sm">Start Preparation</button>
            <button onClick={() => navigate('skill-gap', { id: internship.id })} className="btn-secondary text-sm">View Skill Gaps</button>
          </div>
        </div>
      </div>
    );
  }

  // Overview: all matches ranked
  const allMatches = matchAll(state.profile);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-ink">AI Match Analysis</h1>
        <p className="text-ink/60 text-sm mt-1">See how every internship matches your profile, with transparent scoring.</p>
      </div>

      <div className="space-y-4">
        {allMatches.map((m, idx) => (
          <div key={m.internship.id} className="card p-5 hover:shadow-card transition cursor-pointer" onClick={() => navigate('ai-match', { id: m.internship.id })}>
            <div className="flex items-center gap-4">
              <div className="text-xs font-bold text-ink/30 w-6">#{idx + 1}</div>
              <MatchRing value={m.breakdown.total} size={56} />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-ink">{m.internship.role}</h3>
                <p className="text-sm text-ink/50">{m.internship.company} · {m.internship.location}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {m.hasYou.slice(0, 3).map((s) => <Badge key={s} variant="ready">{s}</Badge>)}
                  {m.needToDevelop.slice(0, 2).map((s) => <Badge key={s} variant="gap">{s}</Badge>)}
                </div>
              </div>
              <ArrowRight size={18} className="text-ink/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
