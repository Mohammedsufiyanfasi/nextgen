interface ProgressProps {
  value: number; // 0-100
  max?: number;
  color?: 'electric' | 'cyan' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  shimmer?: boolean;
}

const colorMap = {
  electric: 'bg-electric',
  cyan: 'bg-cyan',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3.5',
};

export function ProgressBar({
  value,
  max = 100,
  color = 'electric',
  size = 'md',
  showLabel = false,
  label,
  shimmer = false,
}: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1 text-xs font-medium text-ink/70">
          <span>{label}</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className={`w-full ${sizeMap[size]} rounded-full bg-slate-200 overflow-hidden`}>
        <div
          className={`${sizeMap[size]} ${colorMap[color]} rounded-full transition-all duration-700 ease-out ${shimmer ? 'progress-shimmer' : ''}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export function CircularProgress({
  value,
  size = 120,
  stroke = 10,
  color = '#087CFF',
  label,
  sublabel,
}: CircularProgressProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value));
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && <span className="text-2xl font-bold text-ink">{label}</span>}
        {sublabel && <span className="text-xs text-ink/60 mt-0.5">{sublabel}</span>}
      </div>
    </div>
  );
}
