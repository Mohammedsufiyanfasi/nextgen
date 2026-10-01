import { useState } from 'react';
import { Clock, FileText, CheckCircle2, Bookmark, BookmarkCheck, Building2, MapPin, Briefcase, DollarSign, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge, MatchRing } from '../components/ui';
import { matchAll } from '../data/engine';
import type { MatchResult } from '../data/engine';
import { navigate } from '../router';

export function InternshipCard({ m, onSave }: { m: MatchResult; onSave?: () => void }) {
  const { state, toggleSaved } = useApp();
  const i = m.internship;
  const saved = state.savedInternships.includes(i.id);
  const matchColor = m.breakdown.total >= 75 ? 'success' : m.breakdown.total >= 50 ? 'match' : 'gap';

  const handleSave = () => {
    toggleSaved(i.id);
    onSave?.();
  };

  return (
    <div className="card p-5 hover:shadow-card transition-shadow flex flex-col gap-4 animate-fadeIn">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0" style={{ background: i.logoColor }}>
          {i.company[0]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-ink truncate">{i.role}</h3>
          <p className="text-sm text-ink/60 flex items-center gap-1"><Building2 size={13} /> {i.company}</p>
        </div>
        <MatchRing value={m.breakdown.total} size={56} />
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-ink/60">
        <span className="flex items-center gap-1"><MapPin size={13} /> {i.location}</span>
        <span className="flex items-center gap-1"><Clock size={13} /> {i.duration}</span>
        <span className="flex items-center gap-1"><Briefcase size={13} /> {i.workMode}</span>
        <span className="flex items-center gap-1"><DollarSign size={13} /> {i.stipend}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {i.requiredSkills.slice(0, 4).map((s) => (
          <Badge key={s.skill} variant="neutral">{s.skill}</Badge>
        ))}
      </div>

      {m.reasons.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-3 text-xs text-ink/70 space-y-1">
          <div className="font-semibold text-ink mb-1 flex items-center gap-1"><Sparkles size={12} className="text-electric" /> Why this is for you</div>
          {m.reasons.slice(0, 2).map((r, idx) => (
            <div key={idx} className="flex gap-1.5"><CheckCircle2 size={14} className="text-success shrink-0 mt-0.5" /> {r}</div>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-auto pt-2">
        <button onClick={() => navigate('internship-details', { id: i.id })} className="btn-secondary text-xs flex-1">View</button>
        <button onClick={() => navigate('ai-match', { id: i.id })} className="btn text-xs flex-1 bg-electric/10 text-electric hover:bg-electric/20">Match Analysis</button>
        <button onClick={handleSave} className={`btn px-3 text-xs ${saved ? 'bg-success/10 text-success' : 'bg-slate-100 text-ink/60 hover:bg-slate-200'}`} aria-label={saved ? 'Unsave' : 'Save'}>
          {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </button>
      </div>
    </div>
  );
}

export function InternshipExplorer() {
  const { state } = useApp();
  const allMatches = matchAll(state.profile);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [modeFilter, setModeFilter] = useState('');
  const [payFilter, setPayFilter] = useState('');
  const [minMatch, setMinMatch] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const roles = [...new Set(allMatches.map((m) => m.internship.role))];
  const techs = [...new Set(allMatches.flatMap((m) => m.internship.technologies))];
  const locations = [...new Set(allMatches.map((m) => m.internship.location))];
  const durations = ['1 month', '2 months', '3 months', '6 months'];

  const filtered = allMatches.filter((m) => {
    const i = m.internship;
    if (search && !`${i.role} ${i.company} ${i.location}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter && i.role !== roleFilter) return false;
    if (techFilter && !i.technologies.includes(techFilter)) return false;
    if (locationFilter && i.location !== locationFilter) return false;
    if (durationFilter && i.duration !== durationFilter) return false;
    if (modeFilter && i.workMode !== modeFilter) return false;
    if (payFilter && i.paid !== payFilter) return false;
    if (m.breakdown.total < minMatch) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-ink">Internship Explorer</h1>
        <p className="text-ink/60 text-sm mt-1">Discover internships matched to your profile. {filtered.length} opportunities found.</p>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="flex gap-3">
          <input className="input flex-1" placeholder="Search internships..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary text-sm whitespace-nowrap">
            Filters {showFilters ? '▲' : '▼'}
          </button>
        </div>

        {showFilters && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 animate-fadeIn">
            <select className="input text-sm" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}><option value="">All Roles</option>{roles.map((r) => <option key={r}>{r}</option>)}</select>
            <select className="input text-sm" value={techFilter} onChange={(e) => setTechFilter(e.target.value)}><option value="">All Technologies</option>{techs.map((t) => <option key={t}>{t}</option>)}</select>
            <select className="input text-sm" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}><option value="">All Locations</option>{locations.map((l) => <option key={l}>{l}</option>)}</select>
            <select className="input text-sm" value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)}><option value="">All Durations</option>{durations.map((d) => <option key={d}>{d}</option>)}</select>
            <select className="input text-sm" value={modeFilter} onChange={(e) => setModeFilter(e.target.value)}><option value="">All Work Modes</option><option>Remote</option><option>Hybrid</option><option>On-site</option></select>
            <select className="input text-sm" value={payFilter} onChange={(e) => setPayFilter(e.target.value)}><option value="">All Pay Types</option><option>Paid</option><option>Unpaid</option><option>Either</option></select>
            <div className="space-y-1">
              <label className="text-xs text-ink/60 font-medium">Min Match: {minMatch}%</label>
              <input type="range" min={0} max={100} value={minMatch} onChange={(e) => setMinMatch(parseInt(e.target.value))} className="w-full accent-electric" />
            </div>
            <button onClick={() => { setSearch(''); setRoleFilter(''); setTechFilter(''); setLocationFilter(''); setDurationFilter(''); setModeFilter(''); setPayFilter(''); setMinMatch(0); }} className="btn-ghost text-sm">Clear Filters</button>
          </div>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <FileText size={32} className="mx-auto text-slate-300 mb-3" />
          <p className="text-ink/60">No internships match your filters. Try adjusting them.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((m) => <InternshipCard key={m.internship.id} m={m} />)}
        </div>
      )}
    </div>
  );
}
