import { useState } from 'react';
import { User, GraduationCap, Code, Heart, Briefcase, Target, Settings, Edit3, Save, X, Plus, Trash2, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProgressBar } from '../components/ProgressBar';
import { Badge } from '../components/ui';
import { profileCompletion, skillEffectivePct } from '../data/engine';
import { ALL_INTERESTS, ONBOARDING_SKILLS, skillLabel } from '../data/demo';
import { navigate } from '../router';
import type { Project, Certification, SkillLevel, StudentProfile } from '../types';

type Section = 'personal' | 'academic' | 'interests' | 'skills' | 'projects' | 'certifications' | 'career' | 'preferences' | null;

export function ProfilePage() {
  const { state, setProfile } = useApp();
  const [editing, setEditing] = useState<Section>(null);
  const [draft, setDraft] = useState<StudentProfile>(state.profile);

  const p = state.profile;
  const completion = profileCompletion(p);
  const missingHint = completion < 100 ? 'Complete all sections to reach 100%.' : 'Your profile is complete!';

  const startEdit = (s: Section) => { setDraft(state.profile); setEditing(s); };
  const saveEdit = () => { setProfile(draft); setEditing(null); };
  const cancelEdit = () => { setEditing(null); };
  const upd = (patch: Partial<StudentProfile>) => setDraft((d) => ({ ...d, ...patch }));

  const initials = p.personal.fullName.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase() || '?';

  const SectionHeader = ({ title, icon: Icon, section }: { title: string; icon: typeof User; section: Section }) => (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-semibold text-lg flex items-center gap-2"><Icon size={20} className="text-electric" /> {title}</h2>
      {editing === section ? (
        <div className="flex gap-2">
          <button onClick={saveEdit} className="btn-primary py-1.5 px-3 text-xs"><Save size={14} /> Save</button>
          <button onClick={cancelEdit} className="btn-ghost py-1.5 px-3 text-xs"><X size={14} /> Cancel</button>
        </div>
      ) : (
        <button onClick={() => startEdit(section)} className="btn-ghost py-1.5 px-3 text-xs"><Edit3 size={14} /> Edit</button>
      )}
    </div>
  );

  const In = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} className={`input ${props.className ?? ''}`} />;
  const Ta = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} className={`input min-h-[70px] ${props.className ?? ''}`} />;
  const Sel = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => <select {...props} className={`input ${props.className ?? ''}`} />;

  const data = editing ? draft : p;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header card */}
      <div className="card overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-navy-950 via-navy-800 to-electric relative">
          <div className="absolute inset-0 bg-grid-cyan bg-grid opacity-20" />
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-electric to-cyan flex items-center justify-center text-3xl font-bold text-white border-4 border-white shadow-lg shrink-0">
              {initials}
            </div>
            <div className="flex-1 pt-2">
              <h1 className="text-2xl font-bold text-ink">{p.personal.fullName || 'Student'}</h1>
              <p className="text-ink/60 text-sm">{p.academic.degree} {p.academic.branch} · {p.academic.college}</p>
              <p className="text-ink/50 text-sm">{p.personal.location}</p>
            </div>
            <button onClick={() => navigate('onboarding')} className="btn-secondary text-sm">
              <Edit3 size={16} /> Full Edit
            </button>
          </div>

          {/* Completion */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-ink">Profile Completion</span>
              <span className="text-sm font-bold text-electric">{completion}%</span>
            </div>
            <ProgressBar value={completion} color={completion >= 80 ? 'success' : 'electric'} shimmer />
            <p className="text-xs text-ink/50 mt-2">{missingHint}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Personal */}
        <div className="card p-6">
          <SectionHeader title="Personal Information" icon={User} section="personal" />
          {editing === 'personal' ? (
            <div className="space-y-3">
              <In value={draft.personal.fullName} onChange={(e) => upd({ personal: { ...draft.personal, fullName: e.target.value } })} placeholder="Full Name" />
              <In value={draft.personal.email} onChange={(e) => upd({ personal: { ...draft.personal, email: e.target.value } })} placeholder="Email" />
              <In value={draft.personal.phone} onChange={(e) => upd({ personal: { ...draft.personal, phone: e.target.value } })} placeholder="Phone" />
              <In value={draft.personal.location} onChange={(e) => upd({ personal: { ...draft.personal, location: e.target.value } })} placeholder="Location" />
            </div>
          ) : (
            <dl className="space-y-2 text-sm">
              {[['Email', p.personal.email], ['Phone', p.personal.phone], ['Location', p.personal.location]].map(([k, v]) => (
                <div key={k} className="flex justify-between"><dt className="text-ink/50">{k}</dt><dd className="font-medium text-ink">{v || '—'}</dd></div>
              ))}
            </dl>
          )}
        </div>

        {/* Academic */}
        <div className="card p-6">
          <SectionHeader title="Academic Background" icon={GraduationCap} section="academic" />
          {editing === 'academic' ? (
            <div className="space-y-3">
              <In value={draft.academic.college} onChange={(e) => upd({ academic: { ...draft.academic, college: e.target.value } })} placeholder="College" />
              <div className="grid grid-cols-2 gap-3">
                <In value={draft.academic.degree} onChange={(e) => upd({ academic: { ...draft.academic, degree: e.target.value } })} placeholder="Degree" />
                <In value={draft.academic.branch} onChange={(e) => upd({ academic: { ...draft.academic, branch: e.target.value } })} placeholder="Branch" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <In value={draft.academic.currentYear} onChange={(e) => upd({ academic: { ...draft.academic, currentYear: e.target.value } })} placeholder="Current Year" />
                <In value={draft.academic.graduationYear} onChange={(e) => upd({ academic: { ...draft.academic, graduationYear: e.target.value } })} placeholder="Graduation Year" />
              </div>
              <In value={draft.academic.cgpa} onChange={(e) => upd({ academic: { ...draft.academic, cgpa: e.target.value } })} placeholder="CGPA" />
              <Ta value={draft.academic.coursework} onChange={(e) => upd({ academic: { ...draft.academic, coursework: e.target.value } })} placeholder="Relevant Coursework" />
            </div>
          ) : (
            <dl className="space-y-2 text-sm">
              {[['College', p.academic.college], ['Degree', p.academic.degree], ['Branch', p.academic.branch], ['Year', p.academic.currentYear], ['Graduation', p.academic.graduationYear], ['CGPA', p.academic.cgpa]].map(([k, v]) => (
                <div key={k} className="flex justify-between"><dt className="text-ink/50">{k}</dt><dd className="font-medium text-ink">{v || '—'}</dd></div>
              ))}
              {p.academic.coursework && <div className="pt-2"><dt className="text-ink/50 text-xs mb-1">Coursework</dt><dd className="text-sm text-ink">{p.academic.coursework}</dd></div>}
            </dl>
          )}
        </div>

        {/* Interests */}
        <div className="card p-6">
          <SectionHeader title="Interests" icon={Heart} section="interests" />
          {editing === 'interests' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_INTERESTS.map((i) => {
                const active = draft.interests.includes(i);
                return (
                  <button key={i} onClick={() => upd({ interests: active ? draft.interests.filter((x) => x !== i) : [...draft.interests, i] })} className={`px-3 py-2 rounded-lg text-xs font-medium border transition ${active ? 'bg-electric border-electric text-white' : 'bg-slate-50 border-slate-200 text-ink/70 hover:border-electric'}`}>{i}</button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {p.interests.length ? p.interests.map((i) => <Badge key={i} variant="match">{i}</Badge>) : <p className="text-sm text-ink/40">No interests selected.</p>}
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="card p-6">
          <SectionHeader title="Technical Skills" icon={Code} section="skills" />
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            {data.skills.map((s) => {
              const pct = skillEffectivePct(s);
              return (
                <div key={s.skill}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-ink">{s.skill}</span>
                      {s.assessed && <Badge variant="dev">Assessed</Badge>}
                    </div>
                    <span className="text-xs font-bold text-ink/70">{pct}%</span>
                  </div>
                  <ProgressBar value={pct} size="sm" color={pct >= 70 ? 'success' : pct >= 40 ? 'electric' : 'warning'} />
                  {editing === 'skills' && (
                    <div className="flex gap-1.5 mt-1.5">
                      {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((lvl) => (
                        <button key={lvl} onClick={() => upd({ skills: draft.skills.map((x) => x.skill === s.skill ? { ...x, level: lvl, percentage: lvl === 'Beginner' ? 30 : lvl === 'Intermediate' ? 60 : 85 } : x) })} className={`px-2 py-0.5 rounded text-[10px] font-medium ${s.level === lvl ? 'bg-cyan text-navy-950' : 'bg-slate-100 text-ink/50'}`}>{lvl}</button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Projects */}
        <div className="card p-6">
          <SectionHeader title="Projects" icon={Briefcase} section="projects" />
          {editing === 'projects' ? (
            <div className="space-y-3">
              {draft.projects.map((proj, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3 space-y-2">
                  <div className="flex gap-2">
                    <In value={proj.title} onChange={(e) => upd({ projects: draft.projects.map((x, j) => j === i ? { ...x, title: e.target.value } : x) })} placeholder="Project title" />
                    <button onClick={() => upd({ projects: draft.projects.filter((_, j) => j !== i) })} className="btn-ghost px-2"><Trash2 size={16} /></button>
                  </div>
                  <Ta value={proj.description} onChange={(e) => upd({ projects: draft.projects.map((x, j) => j === i ? { ...x, description: e.target.value } : x) })} placeholder="Description" />
                  <In value={proj.technologies} onChange={(e) => upd({ projects: draft.projects.map((x, j) => j === i ? { ...x, technologies: e.target.value } : x) })} placeholder="Technologies" />
                </div>
              ))}
              <button onClick={() => upd({ projects: [...draft.projects, { title: '', description: '', technologies: '' } as Project] })} className="btn-secondary text-xs w-full"><Plus size={14} /> Add Project</button>
            </div>
          ) : (
            <div className="space-y-3">
              {p.projects.length ? p.projects.map((proj, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-4">
                  <div className="font-semibold text-sm text-ink">{proj.title}</div>
                  <p className="text-sm text-ink/60 mt-1">{proj.description}</p>
                  <p className="text-xs text-electric mt-2 font-medium">{proj.technologies}</p>
                </div>
              )) : <p className="text-sm text-ink/40">No projects added yet.</p>}
            </div>
          )}
        </div>

        {/* Certifications */}
        <div className="card p-6">
          <SectionHeader title="Certifications" icon={Award} section="certifications" />
          {editing === 'certifications' ? (
            <div className="space-y-3">
              {draft.certifications.map((c, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <In value={c.name} onChange={(e) => upd({ certifications: draft.certifications.map((x, j) => j === i ? { ...x, name: e.target.value } : x) })} placeholder="Name" />
                  <In value={c.issuer} onChange={(e) => upd({ certifications: draft.certifications.map((x, j) => j === i ? { ...x, issuer: e.target.value } : x) })} placeholder="Issuer" />
                  <In value={c.year} onChange={(e) => upd({ certifications: draft.certifications.map((x, j) => j === i ? { ...x, year: e.target.value } : x) })} placeholder="Year" />
                  <button onClick={() => upd({ certifications: draft.certifications.filter((_, j) => j !== i) })} className="btn-ghost px-2"><Trash2 size={16} /></button>
                </div>
              ))}
              <button onClick={() => upd({ certifications: [...draft.certifications, { name: '', issuer: '', year: '' } as Certification] })} className="btn-secondary text-xs w-full"><Plus size={14} /> Add Certification</button>
            </div>
          ) : (
            <div className="space-y-2">
              {p.certifications.length ? p.certifications.map((c, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <Award size={16} className="text-warning shrink-0" />
                  <span className="font-medium text-ink">{c.name}</span>
                  <span className="text-ink/50">— {c.issuer}, {c.year}</span>
                </div>
              )) : <p className="text-sm text-ink/40">No certifications added yet.</p>}
            </div>
          )}
        </div>

        {/* Career Goals */}
        <div className="card p-6">
          <SectionHeader title="Career Goals" icon={Target} section="career" />
          {editing === 'career' ? (
            <div className="space-y-3">
              <In value={draft.career.desiredRole} onChange={(e) => upd({ career: { ...draft.career, desiredRole: e.target.value } })} placeholder="Desired Role" />
              <In value={draft.career.shortTerm} onChange={(e) => upd({ career: { ...draft.career, shortTerm: e.target.value } })} placeholder="Short-term goal" />
              <In value={draft.career.longTerm} onChange={(e) => upd({ career: { ...draft.career, longTerm: e.target.value } })} placeholder="Long-term goal" />
              <In value={draft.career.industry} onChange={(e) => upd({ career: { ...draft.career, industry: e.target.value } })} placeholder="Preferred industry" />
              <In value={draft.career.targetCompanies} onChange={(e) => upd({ career: { ...draft.career, targetCompanies: e.target.value } })} placeholder="Target companies" />
              <In value={draft.career.preferredDomain} onChange={(e) => upd({ career: { ...draft.career, preferredDomain: e.target.value } })} placeholder="Preferred domain" />
            </div>
          ) : (
            <dl className="space-y-2 text-sm">
              {[['Desired Role', p.career.desiredRole], ['Short-term', p.career.shortTerm], ['Long-term', p.career.longTerm], ['Industry', p.career.industry], ['Target Companies', p.career.targetCompanies], ['Preferred Domain', p.career.preferredDomain]].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4"><dt className="text-ink/50 shrink-0">{k}</dt><dd className="font-medium text-ink text-right">{v || '—'}</dd></div>
              ))}
            </dl>
          )}
        </div>

        {/* Preferences */}
        <div className="card p-6">
          <SectionHeader title="Internship Preferences" icon={Settings} section="preferences" />
          {editing === 'preferences' ? (
            <div className="grid grid-cols-2 gap-3">
              <Sel value={draft.preferences.type} onChange={(e) => upd({ preferences: { ...draft.preferences, type: e.target.value as StudentProfile['preferences']['type'] } })}><option>Remote</option><option>Hybrid</option><option>On-site</option></Sel>
              <Sel value={draft.preferences.duration} onChange={(e) => upd({ preferences: { ...draft.preferences, duration: e.target.value as StudentProfile['preferences']['duration'] } })}><option>1 month</option><option>2 months</option><option>3 months</option><option>6 months</option></Sel>
              <In value={draft.preferences.location} onChange={(e) => upd({ preferences: { ...draft.preferences, location: e.target.value } })} placeholder="Location" />
              <Sel value={draft.preferences.pay} onChange={(e) => upd({ preferences: { ...draft.preferences, pay: e.target.value as StudentProfile['preferences']['pay'] } })}><option>Paid</option><option>Unpaid</option><option>Either</option></Sel>
              <In type="date" value={draft.preferences.startDate} onChange={(e) => upd({ preferences: { ...draft.preferences, startDate: e.target.value } })} />
            </div>
          ) : (
            <dl className="space-y-2 text-sm">
              {[['Type', p.preferences.type], ['Duration', p.preferences.duration], ['Location', p.preferences.location], ['Pay', p.preferences.pay], ['Start Date', p.preferences.startDate]].map(([k, v]) => (
                <div key={k} className="flex justify-between"><dt className="text-ink/50">{k}</dt><dd className="font-medium text-ink">{v || '—'}</dd></div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}
