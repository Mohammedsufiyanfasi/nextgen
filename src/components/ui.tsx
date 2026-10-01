import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'match' | 'strong' | 'gap' | 'major' | 'ready' | 'dev' | 'neutral';
}

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  const map: Record<string, string> = {
    match: 'badge-match',
    strong: 'badge-strong',
    gap: 'badge-gap',
    major: 'badge-major',
    ready: 'badge-ready',
    dev: 'badge-dev',
    neutral: 'chip bg-slate-100 text-ink/70',
  };
  return <span className={map[variant]}>{children}</span>;
}

export function EmptyState({
  icon: Icon = Info,
  title,
  description,
  action,
}: {
  icon?: typeof Info;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="card p-10 text-center flex flex-col items-center gap-3 animate-fadeIn">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
        <Icon size={26} />
      </div>
      <div>
        <h3 className="font-semibold text-ink text-lg">{title}</h3>
        {description && <p className="text-sm text-ink/60 mt-1 max-w-md">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = 'electric',
}: {
  icon: typeof Info;
  label: string;
  value: ReactNode;
  sub?: string;
  color?: 'electric' | 'cyan' | 'success' | 'warning';
}) {
  const colorMap = {
    electric: 'bg-electric/10 text-electric',
    cyan: 'bg-cyan/10 text-cyan',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
  };
  return (
    <div className="card p-5 flex items-start gap-4 hover:shadow-card transition-shadow">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color]}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-medium text-ink/60 uppercase tracking-wide">{label}</div>
        <div className="text-2xl font-bold text-ink mt-0.5">{value}</div>
        {sub && <div className="text-xs text-ink/50 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

export function Alert({
  type = 'info',
  title,
  children,
}: {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
}) {
  const map = {
    info: { icon: Info, cls: 'bg-electric/5 border-electric/30 text-electric' },
    success: { icon: CheckCircle2, cls: 'bg-success/5 border-success/30 text-success' },
    warning: { icon: AlertTriangle, cls: 'bg-warning/5 border-warning/30 text-warning' },
    error: { icon: XCircle, cls: 'bg-danger/5 border-danger/30 text-danger' },
  };
  const { icon: Icon, cls } = map[type];
  return (
    <div className={`rounded-xl border p-4 flex gap-3 ${cls}`}>
      <Icon size={18} className="shrink-0 mt-0.5" />
      <div>
        {title && <div className="font-semibold text-sm">{title}</div>}
        <div className="text-sm text-ink/80">{children}</div>
      </div>
    </div>
  );
}

export function MatchRing({ value, size = 64 }: { value: number; size?: number }) {
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const c = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value));
  const offset = c - (pct / 100) * c;
  const color = pct >= 75 ? '#16A34A' : pct >= 50 ? '#087CFF' : pct >= 30 ? '#F59E0B' : '#EF4444';
  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute text-xs font-bold text-ink">{Math.round(pct)}%</span>
    </div>
  );
}
