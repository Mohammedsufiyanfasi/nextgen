import { useApp } from '../context/AppContext';
import { Badge, EmptyState } from '../components/ui';
import { navigate } from '../router';
import { GraduationCap, CheckCircle2, Circle, Target, BookOpen, Award, ArrowRight } from 'lucide-react';

export function LearningRoadmap() {
  const { state, toggleRoadmapStep } = useApp();
  const roadmap = state.roadmap;
  const completedCount = roadmap.filter((r) => r.completed).length;
  const progress = Math.round((completedCount / roadmap.length) * 100);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Learning Roadmap</h1>
          <p className="text-ink/60 text-sm mt-1">Your personalized week-by-week preparation plan.</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-electric">{progress}%</div>
          <div className="text-xs text-ink/50">{completedCount} of {roadmap.length} weeks complete</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card p-4">
        <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-electric to-cyan rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Timeline */}
      {roadmap.length > 0 ? (
        <div className="relative">
          <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-electric via-cyan to-transparent" />
          <div className="space-y-4">
            {roadmap.map((step, i) => (
              <div key={step.week} className="relative flex gap-4 sm:gap-6">
                <button
                  onClick={() => toggleRoadmapStep(step.week)}
                  className="relative z-10 w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-110"
                  aria-label={step.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {step.completed ? (
                    <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-success flex items-center justify-center text-white">
                      <CheckCircle2 size={22} />
                    </div>
                  ) : (
                    <div className="w-10 sm:w-12 h-12 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-ink/40 hover:border-electric">
                      <Circle size={22} />
                    </div>
                  )}
                </button>

                <div className={`flex-1 card p-5 transition-all ${step.completed ? 'opacity-70' : ''}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="text-xs font-bold text-electric uppercase tracking-wide">Week {step.week}</div>
                      <h3 className="font-semibold text-ink text-lg mt-0.5">{step.title}</h3>
                    </div>
                    {step.completed && <Badge variant="ready">Completed</Badge>}
                  </div>

                  <p className="text-sm text-ink/60 mb-4">{step.objective}</p>

                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-xs font-semibold text-ink/50 uppercase mb-1.5 flex items-center gap-1"><BookOpen size={12} /> Topics</div>
                      <ul className="space-y-1">
                        {step.topics.map((t, j) => <li key={j} className="text-ink/70 text-xs">• {t}</li>)}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-ink/50 uppercase mb-1.5 flex items-center gap-1"><Target size={12} /> Practice</div>
                      <p className="text-ink/70 text-xs">{step.practice}</p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-ink/50 uppercase mb-1.5 flex items-center gap-1"><Award size={12} /> Mini Project</div>
                      <p className="text-ink/70 text-xs font-medium">{step.miniProject}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleRoadmapStep(step.week)}
                    className={`text-xs mt-4 font-medium ${step.completed ? 'text-ink/40 hover:text-ink' : 'text-electric hover:underline'}`}
                  >
                    {step.completed ? '← Mark as not done' : 'Mark as complete ✓'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState icon={GraduationCap} title="No roadmap yet" description="Complete your profile and assessments to generate a roadmap." action={<button onClick={() => navigate('assessment')} className="btn-primary">Take Assessment</button>} />
      )}

      {/* Next steps */}
      <div className="card p-6 text-center">
        <GraduationCap size={28} className="text-electric mx-auto mb-2" />
        <h2 className="font-semibold text-ink">Keep Going!</h2>
        <p className="text-sm text-ink/60 mt-1 mb-4">Complete all weeks to maximize your career readiness.</p>
        <button onClick={() => navigate('dashboard')} className="btn-primary text-sm">View Dashboard <ArrowRight size={14} /></button>
      </div>
    </div>
  );
}
