import { useApp } from '../context/AppContext';
import { getInternship, matchInternship } from '../data/engine';
import { Badge, MatchRing, EmptyState } from '../components/ui';
import { navigate } from '../router';
import { Bookmark, BookmarkCheck, MapPin, Clock, Briefcase, DollarSign, ArrowRight, Trash2 } from 'lucide-react';

export function SavedInternships() {
  const { state, toggleSaved } = useApp();
  const saved = state.savedInternships
    .map((id) => getInternship(id))
    .filter(Boolean);

  if (saved.length === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="No saved internships yet"
        description="Browse internships and save the ones you like."
        action={<button onClick={() => navigate('internships')} className="btn-primary">Explore Internships</button>}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-ink">Saved Internships</h1>
        <p className="text-ink/60 text-sm mt-1">{saved.length} internship{saved.length !== 1 ? 's' : ''} saved.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {saved.map((internship) => {
          if (!internship) return null;
          const match = matchInternship(internship, state.profile);
          return (
            <div key={internship.id} className="card p-5 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0" style={{ background: internship.logoColor }}>
                  {internship.company[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-ink truncate">{internship.role}</h3>
                  <p className="text-sm text-ink/60">{internship.company}</p>
                </div>
                <MatchRing value={match.breakdown.total} size={48} />
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-ink/60">
                <span className="flex items-center gap-1"><MapPin size={12} /> {internship.location}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {internship.duration}</span>
                <span className="flex items-center gap-1"><Briefcase size={12} /> {internship.workMode}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {internship.requiredSkills.slice(0, 3).map((s) => <Badge key={s.skill} variant="neutral">{s.skill}</Badge>)}
              </div>
              <div className="flex gap-2 mt-auto pt-2">
                <button onClick={() => navigate('internship-details', { id: internship.id })} className="btn-secondary text-xs flex-1">View Details</button>
                <button onClick={() => toggleSaved(internship.id)} className="btn px-3 text-xs bg-danger/10 text-danger hover:bg-danger/20" aria-label="Remove">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
