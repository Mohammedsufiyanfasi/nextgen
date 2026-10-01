import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/AppShell';
import { useNav, navigate } from './router';
import { LandingPage } from './pages/LandingPage';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { ProfilePage } from './pages/ProfilePage';
import { InternshipExplorer } from './pages/InternshipExplorer';
import { InternshipDetails } from './pages/InternshipDetails';
import { AIMatchAnalysis } from './pages/AIMatchAnalysis';
import { SkillAssessment } from './pages/SkillAssessment';
import { QuizInterface } from './pages/QuizInterface';
import { QuizResults } from './pages/QuizResults';
import { SkillGapAnalysis } from './pages/SkillGapAnalysis';
import { LearningRoadmap } from './pages/LearningRoadmap';
import { CareerGoals } from './pages/CareerGoals';
import { SavedInternships } from './pages/SavedInternships';
import { StudentProgress } from './pages/StudentProgress';
import { Settings } from './pages/Settings';

function Router() {
  const nav = useNav();
  const { state } = useApp();

  // Landing and onboarding are full-page (no sidebar)
  if (nav.route === 'landing') return <LandingPage />;
  if (nav.route === 'onboarding') return <Onboarding />;

  // If not onboarded, redirect to onboarding
  if (!state.profile.onboarded) {
    navigate('onboarding');
    return null;
  }

  const page = (() => {
    switch (nav.route) {
      case 'dashboard': return <Dashboard />;
      case 'profile': return <ProfilePage />;
      case 'internships': return <InternshipExplorer />;
      case 'internship-details': return <InternshipDetails id={nav.params.id} />;
      case 'ai-match': return <AIMatchAnalysis id={nav.params.id} />;
      case 'assessment': return <SkillAssessment />;
      case 'quiz': return <QuizInterface key={`${nav.params.skill || 'Python'}-${nav.params.id || ''}`} skill={nav.params.skill || 'Python'} id={nav.params.id} />;
      case 'quiz-results': return <QuizResults skill={nav.params.skill || 'Python'} />;
      case 'skill-gap': return <SkillGapAnalysis id={nav.params.id} />;
      case 'roadmap': return <LearningRoadmap />;
      case 'career': return <CareerGoals />;
      case 'saved': return <SavedInternships />;
      case 'progress': return <StudentProgress />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  })();

  return <AppShell>{page}</AppShell>;
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
