import {
  ArrowRight,
  Sparkles,
  Brain,
  Target,
  GraduationCap,
  ClipboardCheck,
  TrendingUp,
  MapPin,
  Briefcase,
  CheckCircle2,
  User,
  Zap,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { navigate } from '../router';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-white">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-navy-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Logo light onClick />
          <div className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <a href="#how" className="hover:text-white transition">How It Works</a>
            <a href="#matching" className="hover:text-white transition">AI Matching</a>
            <a href="#why" className="hover:text-white transition">Why Us</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('dashboard')} className="text-sm text-white/80 hover:text-white font-medium">
              Sign In
            </button>
            <button onClick={() => navigate('onboarding')} className="btn-primary text-sm">
              Get Started <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-hero-radial" />
        <div className="absolute inset-0 bg-grid-cyan bg-grid opacity-30" />
        <img
          src="/banner.svg"
          alt="Next Gen Intern technology banner"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-navy-950/60 to-navy-950" />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fadeIn">
            <div className="inline-flex items-center gap-2 chip bg-cyan/15 text-cyan border border-cyan/30 mb-6">
              <Sparkles size={14} /> AI-Powered Career Platform
            </div>
            <h1 className="font-display text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              NEXT GEN <span className="text-cyan">INTERN</span>
            </h1>
            <p className="mt-4 text-xl lg:text-2xl text-white/80 font-medium">
              Your Skills. Your Interests. The Right Internship.
            </p>
            <p className="mt-4 text-white/60 text-base lg:text-lg max-w-xl leading-relaxed">
              AI-powered internship matching that understands your skills, interests, education, and career goals.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button onClick={() => navigate('onboarding')} className="btn-primary text-base px-6 py-3">
                Build My Profile <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('internships')}
                className="btn text-base px-6 py-3 bg-white/10 text-white border border-white/20 hover:bg-white/20"
              >
                Explore Internships
              </button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-white/50">
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-cyan" /> 10+ Internships</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-cyan" /> 6 Skill Assessments</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-cyan" /> Personalized Roadmaps</div>
            </div>
          </div>

          {/* AI matching flow card */}
          <div className="relative animate-fadeIn">
            <div className="glass-dark rounded-2xl p-6 border border-white/10 shadow-glow">
              <div className="text-sm font-semibold text-cyan mb-4 flex items-center gap-2">
                <Zap size={16} /> AI Matching Pipeline
              </div>
              <div className="space-y-3">
                {[
                  { icon: User, label: 'Student Profile', desc: 'Skills, interests, academics', color: 'from-electric to-cyan' },
                  { icon: Brain, label: 'AI Skill Analysis', desc: 'Quizzes & gap detection', color: 'from-cyan to-electric' },
                  { icon: Briefcase, label: 'Internship Matching', desc: 'Transparent match scores', color: 'from-electric to-bright' },
                  { icon: GraduationCap, label: 'Personalized Roadmap', desc: 'Week-by-week plan', color: 'from-bright to-cyan' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shrink-0 animate-floaty`} style={{ animationDelay: `${i * 0.5}s` }}>
                      <step.icon size={18} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{step.label}</div>
                      <div className="text-xs text-white/50">{step.desc}</div>
                    </div>
                    {i < 3 && <ArrowRight size={16} className="text-white/30" />}
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/50">Example match</span>
                <span className="chip bg-success/20 text-success font-bold">92% Match</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 bg-navy-900/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-bold">How It Works</h2>
            <p className="mt-3 text-white/60 max-w-2xl mx-auto">From profile to placement — a guided journey powered by AI.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: User, title: 'Create Profile', desc: 'Add your academics, skills, interests, and career goals.' },
              { icon: ClipboardCheck, title: 'Take Assessments', desc: 'Quiz-based skill scoring across 6 technical domains.' },
              { icon: Brain, title: 'AI Matches You', desc: 'Transparent scoring explains why each internship fits.' },
              { icon: TrendingUp, title: 'Improve & Apply', desc: 'Follow a personalized roadmap, then apply with confidence.' },
            ].map((s, i) => (
              <div key={i} className="glass-dark rounded-2xl p-6 hover:border-cyan/40 transition group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric to-cyan flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <s.icon size={22} className="text-white" />
                </div>
                <div className="text-sm text-cyan font-semibold mb-1">Step {i + 1}</div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-white/60">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Internship Matching */}
      <section id="matching" className="py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 chip bg-electric/15 text-cyan border border-cyan/30 mb-4">
              <Sparkles size={14} /> AI Internship Matching
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">Transparent matching, not black boxes</h2>
            <p className="text-white/60 mb-6 leading-relaxed">
              Every match score is broken down so you understand exactly why an internship was recommended — by skills, interests, academics, career goals, and preferences.
            </p>
            <div className="space-y-3">
              {[
                { label: 'Skill Compatibility', weight: '40%', w: 'w-[40%]' },
                { label: 'Interest Compatibility', weight: '20%', w: 'w-[20%]' },
                { label: 'Academic Compatibility', weight: '15%', w: 'w-[15%]' },
                { label: 'Career Goal Compatibility', weight: '15%', w: 'w-[15%]' },
                { label: 'Preference Compatibility', weight: '10%', w: 'w-[10%]' },
              ].map((row, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/80">{row.label}</span>
                    <span className="text-cyan font-semibold">{row.weight}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full bg-gradient-to-r from-electric to-cyan rounded-full ${row.w}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-dark rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold">Data Science Intern</div>
                <div className="text-xs text-white/50">TechNova Technologies · Remote</div>
              </div>
              <div className="chip bg-success/20 text-success font-bold text-base px-4 py-1.5">92% Match</div>
            </div>
            <div className="text-sm font-semibold text-cyan mb-2">Why this opportunity is for you</div>
            <ul className="space-y-2 text-sm text-white/75">
              {[
                'Your Python knowledge of 80% meets a core requirement.',
                'Your Computer Science background matches the role.',
                'Your interest in Data Science aligns with this internship.',
                'The role supports your goal of becoming a Data Scientist.',
              ].map((r, i) => (
                <li key={i} className="flex gap-2">
                  <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" /> {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Skill Assessment + Learning */}
      <section className="py-20 bg-navy-900/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: ClipboardCheck, title: 'Skill Assessment', desc: '10-question quizzes in Python, SQL, ML, TensorFlow, Power BI, and Java with instant knowledge scoring.' },
            { icon: GraduationCap, title: 'Personalized Learning', desc: 'A week-by-week roadmap with topics, practice activities, and mini-projects tailored to your gaps.' },
            { icon: Target, title: 'Career Role Recommendations', desc: 'AI computes role compatibility from your full profile and recommends the best role to prepare for.' },
          ].map((f, i) => (
            <div key={i} className="glass-dark rounded-2xl p-6 hover:border-cyan/40 transition">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric to-cyan flex items-center justify-center mb-4">
                <f.icon size={22} className="text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-white/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section id="why" className="py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-bold">Why Next Gen Intern</h2>
            <p className="mt-3 text-white/60 max-w-2xl mx-auto">Built for students who want clarity, not guesswork.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: 'AI that explains itself', desc: 'Every recommendation is traceable to your actual profile data — no fabricated qualifications.' },
              { icon: MapPin, title: 'Skill gap analysis', desc: 'See exactly where you stand versus what each role requires, with constructive guidance.' },
              { icon: TrendingUp, title: 'Progress tracking', desc: 'Watch your readiness score improve as you complete assessments and roadmap steps.' },
              { icon: Target, title: 'Role recommendations', desc: 'Get the single best role to prepare for, with reasons and skills to strengthen.' },
              { icon: ClipboardCheck, title: 'Adaptive-ready quizzes', desc: 'A growing question bank with a scoring architecture ready for adaptive testing.' },
              { icon: Zap, title: 'Fast & focused', desc: 'No fluff, no dead ends. Every page tells you what to do next.' },
            ].map((f, i) => (
              <div key={i} className="glass-dark rounded-2xl p-6">
                <f.icon size={24} className="text-cyan mb-3" />
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-white/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Success Journey */}
      <section className="py-20 bg-navy-900/50">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-bold">Student Success Journey</h2>
            <p className="mt-3 text-white/60">Your path from profile to placement.</p>
          </div>
          <div className="relative">
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-electric via-cyan to-transparent" />
            {[
              { title: 'Create Profile', desc: 'Add academics, interests, skills, goals & preferences.' },
              { title: 'Take Skill Quizzes', desc: 'Get knowledge percentages across 6 domains.' },
              { title: 'AI Analyzes Gaps', desc: 'Identify missing skills versus internship requirements.' },
              { title: 'Get Role Recommendation', desc: 'AI recommends the best role to prepare for.' },
              { title: 'Follow Learning Roadmap', desc: 'Week-by-week plan with projects and practice.' },
              { title: 'Apply with Confidence', desc: 'Improved readiness score and targeted applications.' },
            ].map((step, i) => (
              <div key={i} className={`relative flex gap-6 mb-8 ${i % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="lg:w-1/2" />
                <div className="absolute left-4 lg:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-navy-950 border-2 border-cyan flex items-center justify-center text-xs font-bold text-cyan z-10">
                  {i + 1}
                </div>
                <div className={`flex-1 lg:w-1/2 ${i % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:pl-12'} pl-12 lg:pl-0`}>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-sm text-white/60 mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">Ready to find your internship?</h2>
          <p className="text-white/60 mb-8">Build your profile in minutes and let AI match you with the right opportunities.</p>
          <button onClick={() => navigate('onboarding')} className="btn-primary text-base px-8 py-3.5">
            Build My Profile <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo light showText />
          <p className="text-sm text-white/40">Your Skills. Your Interests. The Right Internship.</p>
        </div>
      </footer>
    </div>
  );
}
