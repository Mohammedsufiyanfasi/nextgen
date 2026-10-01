import { useApp } from '../context/AppContext';
import { Alert, Badge } from '../components/ui';
import { navigate } from '../router';
import { RotateCcw, Trash2, Info, Download, User, Bell, Shield } from 'lucide-react';

export function Settings() {
  const { state, reset } = useApp();
  const profile = state.profile;

  const handleReset = () => {
    if (confirm('Reset all demo data? This will restore the original sample student profile and clear your changes.')) {
      reset();
      navigate('dashboard');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-ink">Settings</h1>
        <p className="text-ink/60 text-sm mt-1">Manage your account and demo data.</p>
      </div>

      {/* Profile settings */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <User size={20} className="text-electric" />
          <h2 className="font-semibold text-ink">Account</h2>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-ink/50">Name</span><span className="font-medium text-ink">{profile.personal.fullName || '—'}</span></div>
          <div className="flex justify-between"><span className="text-ink/50">Email</span><span className="font-medium text-ink">{profile.personal.email || '—'}</span></div>
          <div className="flex justify-between"><span className="text-ink/50">Profile Status</span><Badge variant={profile.onboarded ? 'ready' : 'gap'}>{profile.onboarded ? 'Onboarded' : 'Incomplete'}</Badge></div>
        </div>
        <button onClick={() => navigate('profile')} className="btn-secondary text-sm mt-4">Edit Profile</button>
      </div>

      {/* Data management */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={20} className="text-electric" />
          <h2 className="font-semibold text-ink">Data Management</h2>
        </div>
        <Alert type="info" title="Local Storage">
          Your profile, quiz results, saved internships, and learning progress are stored in your browser's localStorage. This data persists across page refreshes.
        </Alert>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div>
              <div className="text-sm font-medium text-ink">Reset Demo Data</div>
              <div className="text-xs text-ink/50">Restore the original sample student profile</div>
            </div>
            <button onClick={handleReset} className="btn bg-warning/10 text-warning hover:bg-warning/20 text-sm">
              <RotateCcw size={14} /> Reset
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div>
              <div className="text-sm font-medium text-ink">Clear All Data</div>
              <div className="text-xs text-ink/50">Remove everything and start fresh</div>
            </div>
            <button
              onClick={() => {
                if (confirm('Clear ALL data? This cannot be undone.')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="btn bg-danger/10 text-danger hover:bg-danger/20 text-sm"
            >
              <Trash2 size={14} /> Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={20} className="text-electric" />
          <h2 className="font-semibold text-ink">Notifications</h2>
        </div>
        <div className="space-y-3">
          {['New internship matches', 'Assessment reminders', 'Roadmap progress updates'].map((n) => (
            <div key={n} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-ink/70">{n}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-electric"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info size={20} className="text-electric" />
          <h2 className="font-semibold text-ink">About</h2>
        </div>
        <div className="text-sm text-ink/60 space-y-2">
          <p><span className="font-semibold text-ink">Next Gen Intern</span> — AI-powered internship matching that understands your skills, interests, education, and career goals.</p>
          <p className="text-xs text-ink/40">Your Skills. Your Interests. The Right Internship.</p>
          <p className="text-xs text-ink/40 pt-2 border-t border-slate-100">Assessment labels (Needs Foundation, Beginner, Developing, Strong, Advanced) are informational only and not professional certifications.</p>
        </div>
      </div>
    </div>
  );
}
