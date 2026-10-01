import { useApp } from '../context/AppContext';
import { matchAll, profileCompletion, overallSkillPct, careerReadiness, nextAction } from '../data/engine';

export function useDashboardData() {
  const { state, recommendation } = useApp();
  const profile = state.profile;
  const completion = profileCompletion(profile);
  const skillPct = overallSkillPct(profile.skills);
  const matches = matchAll(profile);
  const matchesCount = matches.filter((m) => m.breakdown.total >= 50).length;
  const bestMatch = matches[0];
  const readiness = careerReadiness(profile, state.quizResults);
  const action = nextAction(profile, state.quizResults);

  const assessed = profile.skills.filter((s) => s.assessed);
  const strongest = assessed.length
    ? assessed.reduce((a, b) => ((b.quizScore ?? 0) > (a.quizScore ?? 0) ? b : a))
    : profile.skills[0];
  const weakest = assessed.length
    ? assessed.reduce((a, b) => ((b.quizScore ?? 0) < (a.quizScore ?? 0) ? b : a))
    : profile.skills.find((s) => s.percentage < 50) ?? profile.skills[0];

  return {
    profile,
    completion,
    skillPct,
    matches,
    matchesCount,
    bestMatch,
    readiness,
    action,
    strongest,
    weakest,
    recommendation,
    quizResults: state.quizResults,
    saved: state.savedInternships,
  };
}
