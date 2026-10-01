import { useApp } from '../context/AppContext';
import { quizBank } from '../data/quizzes';
import { CircularProgress } from '../components/ProgressBar';
import { Badge, Alert } from '../components/ui';
import { navigate } from '../router';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

export function QuizResults({ skill }: { skill: string }) {
  const { state } = useApp();
  const result = state.quizResults.find((r) => r.skill === skill);
  const questions = result?.questions ?? quizBank[skill] ?? [];

  if (!result) {
    return (
      <div className="card p-10 text-center">
        <p className="text-ink/60">No results found. Please take the quiz first.</p>
        <button onClick={() => navigate('quiz', { skill })} className="btn-primary mt-4">Take Quiz</button>
      </div>
    );
  }

  const pct = result.percentage;
  const color = pct >= 75 ? '#16A34A' : pct >= 60 ? '#087CFF' : pct >= 40 ? '#F59E0B' : '#EF4444';

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Score card */}
      <div className="card p-8 text-center">
        <div className="inline-flex items-center gap-2 chip bg-electric/10 text-electric mb-4">
          <Sparkles size={14} /> {skill} Assessment Result
        </div>
        <div className="flex justify-center mb-4">
          <CircularProgress value={pct} size={140} stroke={12} color={color} label={`${pct}%`} sublabel={result.label} />
        </div>
        <div className="text-lg font-semibold text-ink">{result.correct} / {result.total} correct</div>
        <div className="text-sm text-ink/50 mt-1">Knowledge Level: {result.label}</div>
        <div className="mt-2">
          <Badge variant={pct >= 70 ? 'strong' : pct >= 40 ? 'dev' : 'gap'}>{result.label}</Badge>
        </div>
      </div>

      <Alert type="info">
        <span className="text-sm">These labels are informational, not professional certifications. Your score has been saved to your profile.</span>
      </Alert>

      {/* Review answers */}
      <div className="card p-6">
        <h2 className="font-semibold text-ink mb-4">Answer Review</h2>
        <div className="space-y-4">
          {questions.map((q, i) => {
            const userAnswer = result.answers?.[q.id];
            return (
              <div key={q.id} className="bg-slate-50 rounded-xl p-4">
                <div className="flex gap-2 items-start mb-2">
                  <span className="chip bg-ink/10 text-ink/60 text-[10px] shrink-0">Q{i + 1}</span>
                  <span className="text-sm font-medium text-ink">{q.question}</span>
                </div>
                <div className="space-y-1.5 mt-2">
                  {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                    const isCorrect = q.correctAnswer === opt;
                    const isSelected = userAnswer === opt;
                    return (
                      <div key={opt} className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg ${
                        isCorrect ? 'bg-success/10 text-success' : isSelected ? 'bg-red-50 text-red-600' : 'text-ink/60'
                      }`}>
                        {isCorrect ? <CheckCircle2 size={14} /> : isSelected ? <XCircle size={14} /> : <span className="w-[14px]" />}
                        <span className="font-medium">{opt}.</span> {q.options[opt.charCodeAt(0) - 65]}
                        {isSelected && <span className="text-xs">Your answer</span>}
                        {isCorrect && <span className="text-xs">Correct</span>}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 text-xs text-ink/50 bg-white rounded-lg p-2.5 border border-slate-100">
                  <span className="font-semibold text-ink/70">Explanation: </span>{q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button onClick={() => navigate('quiz', { skill })} className="btn-secondary">
          <RotateCcw size={16} /> Retake Quiz
        </button>
        <button onClick={() => navigate('assessment')} className="btn-secondary">
          All Assessments
        </button>
        <button onClick={() => navigate('dashboard')} className="btn-primary">
          View Dashboard <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
