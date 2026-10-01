import { useApp } from '../context/AppContext';
import { quizSkills, quizBank } from '../data/quizzes';
import { Badge, EmptyState } from '../components/ui';
import { ProgressBar, CircularProgress } from '../components/ProgressBar';
import { navigate } from '../router';
import { skillEffectivePct } from '../data/engine';
import { skillLabel } from '../data/demo';
import { ClipboardList, ArrowRight, CheckCircle2, Clock, Award } from 'lucide-react';

export function SkillAssessment() {
  const { state } = useApp();

  const getResult = (skill: string) => state.quizResults.find((r) => r.skill === skill);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-ink">Skill Assessment</h1>
        <p className="text-ink/60 text-sm mt-1">Test your knowledge with quizzes. Each has 10 questions and takes ~5 minutes.</p>
      </div>

      {/* Overall */}
      <div className="card p-6 flex items-center gap-6">
        <CircularProgress
          value={state.quizResults.length ? Math.round(state.quizResults.reduce((s, r) => s + r.percentage, 0) / state.quizResults.length) : 0}
          size={100}
          stroke={10}
          label={state.quizResults.length ? `${Math.round(state.quizResults.reduce((s, r) => s + r.percentage, 0) / state.quizResults.length)}%` : '—'}
          sublabel="Avg Score"
        />
        <div className="flex-1">
          <h2 className="font-semibold text-ink">Overall Knowledge</h2>
          <p className="text-sm text-ink/60 mt-1">{state.quizResults.length} of {quizSkills.length} assessments completed.</p>
          <div className="flex gap-2 mt-3">
            <Badge variant="dev">{quizSkills.length} Quizzes</Badge>
            <Badge variant="neutral">10 Questions Each</Badge>
          </div>
        </div>
      </div>

      {/* Quiz cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {quizSkills.map((skill) => {
          const result = getResult(skill);
          const questions = quizBank[skill];
          return (
            <div key={skill} className="card p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-electric to-cyan flex items-center justify-center text-white">
                  <ClipboardList size={20} />
                </div>
                {result && <Badge variant={result.percentage >= 70 ? 'strong' : result.percentage >= 40 ? 'dev' : 'gap'}>{result.label}</Badge>}
              </div>
              <div>
                <h3 className="font-semibold text-ink">{skill}</h3>
                <p className="text-xs text-ink/50">{questions.length} questions · Beginner → Intermediate</p>
              </div>
              {result ? (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink/60">Score: {result.correct}/{result.total}</span>
                    <span className="font-bold text-ink">{result.percentage}%</span>
                  </div>
                  <ProgressBar value={result.percentage} size="sm" color={result.percentage >= 70 ? 'success' : result.percentage >= 40 ? 'electric' : 'warning'} />
                </div>
              ) : (
                <div className="text-xs text-ink/40 flex items-center gap-1"><Clock size={12} /> Not attempted yet</div>
              )}
              <button onClick={() => navigate('quiz', { skill })} className={result ? 'btn-secondary text-xs w-full' : 'btn-primary text-xs w-full'}>
                {result ? 'Retake Quiz' : 'Start Quiz'} <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Skill dashboard summary */}
      <div className="card p-6">
        <h2 className="font-semibold text-ink mb-4">Skill Dashboard</h2>
        {state.quizResults.length > 0 ? (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              {(() => {
                const assessed = state.profile.skills.filter((s) => s.assessed);
                if (!assessed.length) return null;
                const strongest = assessed.reduce((a, b) => ((b.quizScore ?? 0) > (a.quizScore ?? 0) ? b : a));
                const weakest = assessed.reduce((a, b) => ((b.quizScore ?? 0) < (a.quizScore ?? 0) ? b : a));
                const unassessed = quizSkills.find((q) => !assessed.some((a) => a.skill === q));
                return (
                  <>
                    <div className="bg-success/5 rounded-xl p-4">
                      <div className="text-xs text-success font-semibold mb-1">Strongest Skill</div>
                      <div className="font-bold text-ink">{strongest.skill}</div>
                      <div className="text-sm text-ink/60">{strongest.quizScore}%</div>
                    </div>
                    <div className="bg-warning/5 rounded-xl p-4">
                      <div className="text-xs text-warning font-semibold mb-1">Needs Most Improvement</div>
                      <div className="font-bold text-ink">{weakest.skill}</div>
                      <div className="text-sm text-ink/60">{weakest.quizScore}%</div>
                    </div>
                    <div className="bg-electric/5 rounded-xl p-4">
                      <div className="text-xs text-electric font-semibold mb-1">Recommended Next</div>
                      <div className="font-bold text-ink">{unassessed || 'All assessed!'}</div>
                      <div className="text-sm text-ink/60">{unassessed ? 'Take this quiz' : 'Keep practicing'}</div>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="space-y-2">
              {state.profile.skills.filter((s) => s.assessed).map((s) => (
                <div key={s.skill}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink/70">{s.skill}</span>
                    <span className="font-semibold text-ink">{skillEffectivePct(s)}% · {skillLabel(skillEffectivePct(s))}</span>
                  </div>
                  <ProgressBar value={skillEffectivePct(s)} size="sm" color={skillEffectivePct(s) >= 70 ? 'success' : skillEffectivePct(s) >= 40 ? 'electric' : 'warning'} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState icon={Award} title="No skill assessments completed yet" description="Take a quiz to see your skill dashboard." action={<button onClick={() => navigate('quiz', { skill: 'Python' })} className="btn-primary">Take Skill Assessment</button>} />
        )}
      </div>
    </div>
  );
}
