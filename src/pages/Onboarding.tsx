import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, GraduationCap, Briefcase, Heart, Code, Target, Settings, User } from 'lucide-react';
import { Logo } from '../components/Logo';
import { ProgressBar } from '../components/ProgressBar';
import { useApp } from '../context/AppContext';
import { navigate } from '../router';
import { ALL_INTERESTS, ONBOARDING_SKILLS } from '../data/demo';
import type { SkillLevel, StudentProfile, WorkMode, Duration, PayType } from '../types';
import type { SkillRating } from '../types';

const STEPS = [
  { title: 'Personal Information', icon: User },
  { title: 'Academic Background', icon: GraduationCap },
  { title: 'Interests', icon: Heart },
  { title: 'Skills', icon: Code },
  { title: 'Career Goals', icon: Target },
  { title: 'Internship Preferences', icon: Settings },
];

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
}

export function Onboarding() {
  const { state, setProfile } = useApp();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profile, setLocal] = useState<StudentProfile>(
    state.profile.onboarded ? state.profile : {
      ...state.profile,
      personal: { fullName: '', email: '', phone: '', photoUrl: '', location: '' },
    }
  );

  const update = (patch: Partial<StudentProfile>) => setLocal((p) => ({ ...p, ...patch }));

  const toggleInterest = (interest: string) => {
    update({
      interests: profile.interests.includes(interest)
        ? profile.interests.filter((i) => i !== interest)
        : [...profile.interests, interest],
    });
  };

  const setSkillLevel = (skill: string, level: SkillLevel) => {
    const pct = level === 'Beginner' ? 30 : level === 'Intermediate' ? 60 : 85;
    update({
      skills: profile.skills.map((s) => (s.skill === skill ? { ...s, level, percentage: pct } : s)),
    });
  };

  const setSkillPct = (skill: string, percentage: number) => {
    update({
      skills: profile.skills.map((s) =>
        s.skill === skill ? { ...s, percentage: Math.max(0, Math.min(100, percentage)) } : s
      ),
    });
  };

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!profile.personal.fullName.trim()) e.fullName = 'This field is required';
      if (!profile.personal.email.trim()) e.email = 'This field is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.personal.email)) e.email = 'Please enter a valid email address';
    }
    if (step === 1) {
      if (!profile.academic.college.trim()) e.college = 'This field is required';
      if (!profile.academic.degree.trim()) e.degree = 'This field is required';
    }
    if (step === 2) {
      if (profile.interests.length === 0) e.interests = 'Select at least one interest';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < 5) setStep(step + 1);
    else {
      const final = { ...profile, onboarded: true };
      setProfile(final);
      navigate('dashboard');
    }
  };
  const prev = () => step > 0 && setStep(step - 1);

  return (
    <div className="min-h-screen bg-navy-950 text-white flex flex-col">
      <header className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo light onClick />
          <button onClick={() => navigate('dashboard')} className="text-sm text-white/60 hover:text-white">
            Skip for now
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-white/60">Step {step + 1} of {STEPS.length}</span>
            <span className="text-cyan font-semibold">{STEPS[step].title}</span>
          </div>
          <ProgressBar value={((step + 1) / STEPS.length) * 100} color="cyan" shimmer />
          <div className="hidden sm:flex justify-between mt-3">
            {STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => i <= step && setStep(i)}
                className={`flex items-center gap-1.5 text-xs ${i <= step ? 'text-cyan' : 'text-white/30'}`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i < step ? 'bg-cyan text-navy-950' : i === step ? 'bg-electric text-white' : 'bg-white/10'}`}>
                  {i < step ? <Check size={12} /> : i + 1}
                </span>
                <span className="hidden lg:inline">{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-dark rounded-2xl p-6 lg:p-8 border border-white/10 animate-fadeIn">
          {/* Step 0: Personal */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name" error={errors.fullName}>
                  <input className="input" value={profile.personal.fullName} onChange={(e) => update({ personal: { ...profile.personal, fullName: e.target.value } })} placeholder="e.g. Mohammed Sufiyan" />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input className="input" type="email" value={profile.personal.email} onChange={(e) => update({ personal: { ...profile.personal, email: e.target.value } })} placeholder="you@example.com" />
                </Field>
                <Field label="Phone">
                  <input className="input" value={profile.personal.phone} onChange={(e) => update({ personal: { ...profile.personal, phone: e.target.value } })} placeholder="+91 98765 43210" />
                </Field>
                <Field label="Location">
                  <input className="input" value={profile.personal.location} onChange={(e) => update({ personal: { ...profile.personal, location: e.target.value } })} placeholder="City, Country" />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Profile Photo URL (optional)">
                    <input className="input" value={profile.personal.photoUrl} onChange={(e) => update({ personal: { ...profile.personal, photoUrl: e.target.value } })} placeholder="https://..." />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Academic */}
          {step === 1 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="College / University" error={errors.college}>
                <input className="input" value={profile.academic.college} onChange={(e) => update({ academic: { ...profile.academic, college: e.target.value } })} placeholder="e.g. BMS College of Engineering" />
              </Field>
              <Field label="Degree" error={errors.degree}>
                <input className="input" value={profile.academic.degree} onChange={(e) => update({ academic: { ...profile.academic, degree: e.target.value } })} placeholder="e.g. B.Tech" />
              </Field>
              <Field label="Branch / Department">
                <input className="input" value={profile.academic.branch} onChange={(e) => update({ academic: { ...profile.academic, branch: e.target.value } })} placeholder="e.g. Computer Science" />
              </Field>
              <Field label="Current Year">
                <select className="input" value={profile.academic.currentYear} onChange={(e) => update({ academic: { ...profile.academic, currentYear: e.target.value } })}>
                  <option value="">Select year</option>
                  <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                </select>
              </Field>
              <Field label="Graduation Year">
                <input className="input" value={profile.academic.graduationYear} onChange={(e) => update({ academic: { ...profile.academic, graduationYear: e.target.value } })} placeholder="e.g. 2027" />
              </Field>
              <Field label="CGPA / Percentage">
                <input className="input" value={profile.academic.cgpa} onChange={(e) => update({ academic: { ...profile.academic, cgpa: e.target.value } })} placeholder="e.g. 8.4" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Relevant Coursework">
                  <textarea className="input min-h-[80px]" value={profile.academic.coursework} onChange={(e) => update({ academic: { ...profile.academic, coursework: e.target.value } })} placeholder="Data Structures, DBMS, Machine Learning..." />
                </Field>
              </div>
            </div>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <div>
              <p className="text-sm text-white/60 mb-4">Select all areas you're interested in. You can choose multiple.</p>
              {errors.interests && <p className="text-xs text-danger mb-3">{errors.interests}</p>}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ALL_INTERESTS.map((interest) => {
                  const active = profile.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        active ? 'bg-electric border-electric text-white' : 'bg-white/5 border-white/15 text-white/70 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {interest}
                        {active && <Check size={16} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Skills */}
          {step === 3 && (
            <div>
              <p className="text-sm text-white/60 mb-4">Rate your technical skills. Be honest — assessments will refine these later.</p>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {profile.skills.map((s: SkillRating) => (
                  <div key={s.skill} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{s.skill}</span>
                      <div className="flex gap-1.5">
                        {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => setSkillLevel(s.skill, lvl)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                              s.level === lvl ? 'bg-cyan text-navy-950' : 'bg-white/10 text-white/60 hover:bg-white/20'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={s.percentage}
                        onChange={(e) => setSkillPct(s.skill, parseInt(e.target.value))}
                        className="flex-1 accent-cyan"
                        aria-label={`${s.skill} percentage`}
                      />
                      <span className="text-sm font-semibold text-cyan w-12 text-right">{s.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Career Goals */}
          {step === 4 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Desired Role"><input className="input" value={profile.career.desiredRole} onChange={(e) => update({ career: { ...profile.career, desiredRole: e.target.value } })} placeholder="e.g. Data Scientist" /></Field>
              <Field label="Preferred Industry"><input className="input" value={profile.career.industry} onChange={(e) => update({ career: { ...profile.career, industry: e.target.value } })} placeholder="e.g. Technology" /></Field>
              <Field label="Short-Term Goal"><input className="input" value={profile.career.shortTerm} onChange={(e) => update({ career: { ...profile.career, shortTerm: e.target.value } })} placeholder="e.g. Secure an internship" /></Field>
              <Field label="Long-Term Goal"><input className="input" value={profile.career.longTerm} onChange={(e) => update({ career: { ...profile.career, longTerm: e.target.value } })} placeholder="e.g. Senior Data Scientist" /></Field>
              <Field label="Target Companies"><input className="input" value={profile.career.targetCompanies} onChange={(e) => update({ career: { ...profile.career, targetCompanies: e.target.value } })} placeholder="Google, Microsoft..." /></Field>
              <Field label="Preferred Technology / Domain"><input className="input" value={profile.career.preferredDomain} onChange={(e) => update({ career: { ...profile.career, preferredDomain: e.target.value } })} placeholder="e.g. Artificial Intelligence" /></Field>
            </div>
          )}

          {/* Step 5: Preferences */}
          {step === 5 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Internship Type">
                <select className="input" value={profile.preferences.type} onChange={(e) => update({ preferences: { ...profile.preferences, type: e.target.value as WorkMode } })}>
                  <option>Remote</option><option>Hybrid</option><option>On-site</option>
                </select>
              </Field>
              <Field label="Duration">
                <select className="input" value={profile.preferences.duration} onChange={(e) => update({ preferences: { ...profile.preferences, duration: e.target.value as Duration } })}>
                  <option>1 month</option><option>2 months</option><option>3 months</option><option>6 months</option>
                </select>
              </Field>
              <Field label="Preferred Location"><input className="input" value={profile.preferences.location} onChange={(e) => update({ preferences: { ...profile.preferences, location: e.target.value } })} placeholder="e.g. Bangalore" /></Field>
              <Field label="Paid / Unpaid">
                <select className="input" value={profile.preferences.pay} onChange={(e) => update({ preferences: { ...profile.preferences, pay: e.target.value as PayType } })}>
                  <option>Paid</option><option>Unpaid</option><option>Either</option>
                </select>
              </Field>
              <Field label="Start Date"><input type="date" className="input" value={profile.preferences.startDate} onChange={(e) => update({ preferences: { ...profile.preferences, startDate: e.target.value } })} /></Field>
            </div>
          )}
        </div>

        {/* Nav buttons */}
        <div className="flex justify-between mt-6">
          <button onClick={prev} disabled={step === 0} className="btn bg-white/10 text-white border border-white/20 hover:bg-white/20 disabled:opacity-30">
            <ArrowLeft size={16} /> Back
          </button>
          <button onClick={next} className="btn-primary">
            {step === 5 ? 'Complete Profile' : 'Continue'} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
