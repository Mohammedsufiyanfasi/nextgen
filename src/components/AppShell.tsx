import { useState } from 'react';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Sparkles,
  ClipboardList,
  GraduationCap,
  Target,
  Bookmark,
  TrendingUp,
  Settings as SettingsIcon,
  Menu,
  X,
  Bell,
  Search,
} from 'lucide-react';
import { Logo } from './Logo';
import { navigate, useNav, type Route } from '../router';
import { useApp } from '../context/AppContext';

interface NavItem {
  route: Route;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV: NavItem[] = [
  { route: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { route: 'profile', label: 'My Profile', icon: User },
  { route: 'internships', label: 'Internships', icon: Briefcase },
  { route: 'ai-match', label: 'AI Match', icon: Sparkles },
  { route: 'assessment', label: 'Skill Assessment', icon: ClipboardList },
  { route: 'roadmap', label: 'Learning Path', icon: GraduationCap },
  { route: 'career', label: 'Career Goals', icon: Target },
  { route: 'saved', label: 'Saved Jobs', icon: Bookmark },
  { route: 'progress', label: 'Progress', icon: TrendingUp },
  { route: 'settings', label: 'Settings', icon: SettingsIcon },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const nav = useNav();
  const { state } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');

  const current = nav.route;
  const activeItem = NAV.find((n) => n.route === current);
  const pageTitle = activeItem?.label ?? 'Next Gen Intern';

  const go = (r: Route) => {
    navigate(r);
    setMobileOpen(false);
  };

  const initials = state.profile.personal.fullName
    ? state.profile.personal.fullName
        .split(' ')
        .map((s) => s[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'NG';

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col fixed inset-y-0 left-0 bg-navy-950 text-white z-30">
        <div className="px-5 py-5 border-b border-white/10">
          <Logo light onClick />
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.map((item) => {
            const active = current === item.route;
            return (
              <button
                key={item.route}
                onClick={() => go(item.route)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-electric text-white shadow-glow'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon size={18} className="shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-electric to-cyan flex items-center justify-center text-sm font-bold text-white shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{state.profile.personal.fullName || 'Student'}</div>
              <div className="text-xs text-white/50 truncate">{state.profile.personal.email || 'No email'}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-navy-950 text-white flex flex-col animate-fadeIn">
            <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
              <Logo light onClick />
              <button onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-white p-1" aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {NAV.map((item) => {
                const active = current === item.route;
                return (
                  <button
                    key={item.route}
                    onClick={() => go(item.route)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active ? 'bg-electric text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon size={18} className="shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/70">
          <div className="flex items-center gap-3 px-4 lg:px-8 h-16">
            <button
              className="lg:hidden p-2 -ml-2 text-ink/70 hover:bg-slate-100 rounded-lg"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div className="lg:hidden">
              <Logo showText={false} onClick />
            </div>
            <h1 className="hidden lg:block text-lg font-semibold text-ink">{pageTitle}</h1>
            <div className="flex-1" />
            <div className="hidden md:flex relative w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input pl-9 py-2 text-sm"
                placeholder="Search internships..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && search.trim()) {
                    navigate('internships', { q: search.trim() });
                  }
                }}
                aria-label="Search internships"
              />
            </div>
            <button className="relative p-2 text-ink/60 hover:bg-slate-100 rounded-lg" aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-electric rounded-full" />
            </button>
            <button
              onClick={() => go('profile')}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-electric to-cyan flex items-center justify-center text-sm font-bold text-white shrink-0"
              aria-label="Your profile"
            >
              {initials}
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
