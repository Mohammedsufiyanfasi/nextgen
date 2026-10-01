import { navigate, type Route } from '../router';

interface LogoProps {
  size?: number;
  showText?: boolean;
  onClick?: boolean;
  light?: boolean;
}

export function Logo({ size = 40, showText = true, onClick = false, light = false }: LogoProps) {
  const handleClick = () => {
    if (onClick) navigate('landing');
  };
  return (
    <div
      className={`flex items-center gap-2.5 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      aria-label="Next Gen Intern home"
    >
      <img src="/logo.svg" alt="Next Gen Intern logo" width={size} height={size} className="shrink-0" />
      {showText && (
        <div className="leading-none">
          <div className={`font-display font-bold text-base tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
            NEXT GEN
          </div>
          <div className="font-display font-semibold text-xs tracking-[0.2em] text-cyan">INTERN</div>
        </div>
      )}
    </div>
  );
}

export type { Route };
