import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AppState, StudentProfile, RoadmapStep, QuizResult } from '../types';
import {
  loadState,
  saveState,
  resetState,
  recordQuiz as engineRecordQuiz,
  toggleSaved as engineToggleSaved,
  toggleRoadmapStep as engineToggleRoadmapStep,
  setRoadmap as engineSetRoadmap,
  recommendRole,
  type RoleRecommendation,
} from '../data/engine';

interface AppContextValue {
  state: AppState;
  setProfile: (p: StudentProfile) => void;
  updateProfile: (patch: Partial<StudentProfile>) => void;
  recordQuiz: (skill: string, correct: number, total: number, questions: QuizResult['questions'], answers: QuizResult['answers']) => void;
  toggleSaved: (id: string) => void;
  toggleRoadmapStep: (week: number) => void;
  setRoadmap: (roadmap: RoadmapStep[]) => void;
  reset: () => void;
  recommendation: RoleRecommendation | null;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Keep recommendedRole in sync with profile-derived recommendation.
  const recommendation = useMemo(() => recommendRole(state.profile), [state.profile]);
  useEffect(() => {
    const next = recommendation?.role ?? null;
    if (state.recommendedRole !== next) {
      setState((s) => ({ ...s, recommendedRole: next }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendation]);

  const value = useMemo<AppContextValue>(() => {
    const setProfile = (p: StudentProfile) => setState((s) => ({ ...s, profile: p }));
    const updateProfile = (patch: Partial<StudentProfile>) =>
      setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
    const recordQuiz = (skill: string, correct: number, total: number, questions: QuizResult['questions'], answers: QuizResult['answers']) =>
      setState((s) => engineRecordQuiz(s, skill, correct, total, questions, answers));
    const toggleSaved = (id: string) => setState((s) => engineToggleSaved(s, id));
    const toggleRoadmapStep = (week: number) => setState((s) => engineToggleRoadmapStep(s, week));
    const setRoadmap = (roadmap: RoadmapStep[]) => setState((s) => engineSetRoadmap(s, roadmap));
    const reset = () => setState(resetState());

    return {
      state,
      setProfile,
      updateProfile,
      recordQuiz,
      toggleSaved,
      toggleRoadmapStep,
      setRoadmap,
      reset,
      recommendation,
    };
  }, [state, recommendation]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
