import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateQuiz, type QuizQuestion } from '../data/quizzes';
import { navigate } from '../router';
import { ProgressBar } from '../components/ProgressBar';
import { Alert } from '../components/ui';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

type Answers = Record<number, 'A' | 'B' | 'C' | 'D'>;

export function QuizInterface({ skill, id }: { skill: string; id?: string }) {
  const { recordQuiz } = useApp();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showError, setShowError] = useState(false);
  const generationRequest = useRef<Promise<QuizQuestion[]> | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setQuestions([]);
    setCurrent(0);
    setAnswers({});
    setShowError(false);

    const loadQuiz = async () => {
      try {
        if (!generationRequest.current) {
          generationRequest.current = fetch('/api/generate-quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skill }),
          }).then(async (response) => {
            if (!response.ok) throw new Error('Quiz generation unavailable');
            const data = await response.json() as { questions?: QuizQuestion[] };
            if (!Array.isArray(data.questions) || data.questions.length !== 10) {
              throw new Error('Invalid generated quiz');
            }
            return data.questions;
          });
        }
        const generated = await generationRequest.current;
        if (active) setQuestions(generated);
      } catch {
        if (active) setQuestions(generateQuiz(skill));
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadQuiz();
    return () => { active = false; };
  }, [skill, id]);

  if (isLoading || questions.length === 0) {
    return <div className="card p-8 text-center text-ink/60">Generating a fresh {skill} quiz...</div>;
  }

  const q = questions[current];
  const answered = answers[q.id];
  const progress = ((current + 1) / questions.length) * 100;
  const allAnswered = questions.every((qq) => answers[qq.id]);

  const select = (opt: 'A' | 'B' | 'C' | 'D') => {
    setAnswers((a) => ({ ...a, [q.id]: opt }));
    setShowError(false);
  };

  const next = () => {
    if (!answered) { setShowError(true); return; }
    if (current < questions.length - 1) setCurrent(current + 1);
  };
  const prev = () => current > 0 && setCurrent(current - 1);

  const submit = () => {
    if (!allAnswered) { setShowError(true); return; }
    let correct = 0;
    questions.forEach((qq) => { if (answers[qq.id] === qq.correctAnswer) correct++; });
    recordQuiz(skill, correct, questions.length, questions, answers);
    navigate('quiz-results', { skill });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('assessment')} className="text-sm text-ink/60 hover:text-electric flex items-center gap-1">
          <ArrowLeft size={16} /> Exit Quiz
        </button>
        <div className="text-sm font-semibold text-ink">{skill} Assessment</div>
      </div>

      {/* Progress */}
      <div className="card p-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-ink/60">Question {current + 1} of {questions.length}</span>
          <span className="font-semibold text-electric">{Math.round(progress)}%</span>
        </div>
        <ProgressBar value={progress} color="electric" shimmer />
      </div>

      {/* Question */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className={`chip text-[10px] ${q.difficulty === 'Beginner' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{q.difficulty}</span>
        </div>
        <h2 className="text-lg font-semibold text-ink mb-5">{q.question}</h2>
        <div className="space-y-3">
          {(['A', 'B', 'C', 'D'] as const).map((opt) => {
            const isSelected = answered === opt;
            return (
              <button
                key={opt}
                onClick={() => select(opt)}
                className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  isSelected ? 'border-electric bg-electric/5' : 'border-slate-200 hover:border-electric/40 hover:bg-slate-50'
                }`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                  isSelected ? 'bg-electric text-white' : 'bg-slate-100 text-ink/60'
                }`}>{opt}</span>
                <span className="text-sm text-ink flex-1">{q.options[opt.charCodeAt(0) - 65]}</span>
                {isSelected && <CheckCircle2 size={18} className="text-electric" />}
              </button>
            );
          })}
        </div>
        {showError && !answered && (
          <div className="mt-4">
            <Alert type="warning"><span className="text-sm">Please answer this question before continuing.</span></Alert>
          </div>
        )}
      </div>

      {/* Nav buttons */}
      <div className="flex justify-between">
        <button onClick={prev} disabled={current === 0} className="btn-secondary disabled:opacity-30">
          <ArrowLeft size={16} /> Previous
        </button>
        <div className="flex gap-2">
          {current < questions.length - 1 ? (
            <button onClick={next} className="btn-primary">Next <ArrowRight size={16} /></button>
          ) : (
            <button onClick={submit} className="btn-primary">Submit Quiz <CheckCircle2 size={16} /></button>
          )}
        </div>
      </div>

      {/* Question palette */}
      <div className="card p-4">
        <div className="text-xs text-ink/50 mb-2 font-medium">Question Palette</div>
        <div className="flex flex-wrap gap-2">
          {questions.map((qq, i) => {
            const isAnswered = !!answers[qq.id];
            const isCurrent = i === current;
            return (
              <button
                key={qq.id}
                onClick={() => setCurrent(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                  isCurrent ? 'bg-electric text-white ring-2 ring-electric/30' :
                  isAnswered ? 'bg-success/15 text-success' : 'bg-slate-100 text-ink/40'
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        {!allAnswered && (
          <div className="text-xs text-ink/40 mt-2 flex items-center gap-1">
            <AlertCircle size={12} /> {questions.filter((qq) => answers[qq.id]).length} of {questions.length} answered
          </div>
        )}
      </div>
    </div>
  );
}
