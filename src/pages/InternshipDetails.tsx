import { useApp } from '../context/AppContext';
import { getInternship, matchInternship, analyzeGap, skillEffectivePct, getSkill } from '../data/engine';
import { Badge, MatchRing, Alert } from '../components/ui';
import { ProgressBar } from '../components/ProgressBar';
import { navigate } from '../router';
import {
  Building2, MapPin, Clock, Briefcase, DollarSign, Calendar, CheckCircle2,
  AlertTriangle, ArrowRight, Sparkles, GraduationCap, Bookmark, BookmarkCheck, ExternalLink,
} from 'lucide-react';

export function InternshipDetails({ id }: { id: string }) {
  const { state, toggleSaved } = useApp();
  const internship = getInternship(id);

  if (!internship) {
    return (
      <div className="card p-10 text-center">
        <p className="text-ink/60">Internship not found.</p>
        <button onClick={() => navigate('internships')} className="btn-primary mt-4">Back to Internships</button>
      </div>
    );
  }

  const match = matchInternship(internship, state.profile);
  const gaps = analyzeGap(internship, state.profile.skills);
  const saved = state.savedInternships.includes(internship.id);
  const deadline = new Date(internship.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 animate-fadeIn">
      <button onClick={() => navigate('internships')} className="text-sm text-ink/60 hover:text-electric flex items-center gap-1">
        ← Back to Internships
      </button>

      {/* Header */}
      <div className="card overflow-hidden">
        <div className="h-24" style={{ background: `linear-gradient(135deg, ${internship.logoColor}, #061326)` }} />
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0 -mt-12 border-4 border-white shadow-lg" style={{ background: internship.logoColor }}>
              {internship.company[0]}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-ink">{internship.role}</h1>
              <p className="text-ink/60 flex items-center gap-1.5"><Building2 size={16} /> {internship.company}</p>
              <div className="flex flex-wrap gap-3 mt-3 text-sm text-ink/60">
                <span className="flex items-center gap-1"><MapPin size={14} /> {internship.location}</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {internship.duration}</span>
                <span className="flex items-center gap-1"><Briefcase size={14} /> {internship.workMode}</span>
                <span className="flex items-center gap-1"><DollarSign size={14} /> {internship.stipend}</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> Deadline: {deadline}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleSaved(internship.id)} className={`btn px-3 ${saved ? 'bg-success/10 text-success' : 'bg-slate-100 text-ink/60'}`} aria-label={saved ? 'Unsave' : 'Save'}>
                {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              </button>
              <a href="#" onClick={(e) => e.preventDefault()} className="btn-primary text-sm">
                Apply <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="font-semibold text-ink mb-3">Description</h2>
            <p className="text-sm text-ink/70 leading-relaxed">{internship.description}</p>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-ink mb-3">Responsibilities</h2>
            <ul className="space-y-2">
              {internship.responsibilities.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink/70"><CheckCircle2 size={16} className="text-electric shrink-0 mt-0.5" /> {r}</li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-ink mb-3">Requirements</h2>
            <ul className="space-y-2">
              {internship.requirements.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink/70"><span className="text-electric shrink-0">•</span> {r}</li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-ink mb-3">Preferred Skills</h2>
            <div className="flex flex-wrap gap-2">
              {internship.preferredSkills.map((s) => <Badge key={s} variant="neutral">{s}</Badge>)}
            </div>
          </div>
        </div>

        {/* Sidebar: AI match */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-electric" />
              <h2 className="font-semibold text-ink">Your AI Match</h2>
            </div>
            <div className="flex items-center justify-center mb-4">
              <MatchRing value={match.breakdown.total} size={100} />
            </div>
            <div className="space-y-2">
              {[
                ['Skills', match.breakdown.skill],
                ['Interests', match.breakdown.interest],
                ['Academic', match.breakdown.academic],
                ['Career Goal', match.breakdown.career],
                ['Preferences', match.breakdown.preference],
              ].map(([label, val]) => (
                <div key={label as string}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink/60">{label}</span>
                    <span className="font-semibold text-ink">{val}%</span>
                  </div>
                  <ProgressBar value={val as number} size="sm" color={(val as number) >= 70 ? 'success' : (val as number) >= 40 ? 'electric' : 'warning'} />
                </div>
              ))}
            </div>
            <button onClick={() => navigate('ai-match', { id: internship.id })} className="btn-secondary text-xs w-full mt-4">
              Full Match Analysis <ArrowRight size={14} />
            </button>
          </div>

          {/* Role readiness */}
          <div className="card p-6">
            <h2 className="font-semibold text-ink mb-4">Role Readiness</h2>
            <div className="space-y-3">
              {gaps.map((g) => (
                <div key={g.skill}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink/70 font-medium">{g.skill}</span>
                    <span className={`font-semibold ${g.status === 'Ready' ? 'text-success' : 'text-warning'}`}>{g.current}%</span>
                  </div>
                  <ProgressBar value={g.current} size="sm" color={g.status === 'Ready' ? 'success' : 'warning'} />
                  <div className="text-[10px] text-ink/40 mt-0.5">Required: {g.required}%</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="text-xs text-ink/50 mb-1">Recommended preparation:</div>
              <div className="text-sm font-semibold text-ink">{match.prepWeeks}</div>
            </div>
            <button onClick={() => navigate('roadmap')} className="btn-primary text-xs w-full mt-4">
              Start Preparation <GraduationCap size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
