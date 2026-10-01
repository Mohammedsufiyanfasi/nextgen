import { useEffect, useState } from 'react';

export type Route =
  | 'landing'
  | 'onboarding'
  | 'dashboard'
  | 'profile'
  | 'internships'
  | 'internship-details'
  | 'ai-match'
  | 'assessment'
  | 'quiz'
  | 'quiz-results'
  | 'skill-gap'
  | 'roadmap'
  | 'career'
  | 'saved'
  | 'progress'
  | 'settings';

export interface NavState {
  route: Route;
  params: Record<string, string>;
}

function parseHash(): NavState {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const [path, query] = hash.split('?');
  const segments = path.split('/').filter(Boolean);
  const route = (segments[0] as Route) || 'landing';
  const params: Record<string, string> = {};
  if (query) {
    new URLSearchParams(query).forEach((v, k) => (params[k] = v));
  }
  if (segments[1]) params.id = segments[1];
  if (segments[2]) params.sub = segments[2];
  return { route, params };
}

export function buildHash(route: Route, params?: Record<string, string>): string {
  const parts = [route];
  if (params?.id) parts.push(params.id as Route);
  const base = `#/${parts.join('/')}`;
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (k !== 'id' && k !== 'sub') query.set(k, v);
    });
  }
  const qs = query.toString();
  return qs ? `${base}?${qs}` : base;
}

export function navigate(route: Route, params?: Record<string, string>) {
  window.location.hash = buildHash(route, params);
}

export function useNav(): NavState {
  const [nav, setNav] = useState<NavState>(() => parseHash());
  useEffect(() => {
    const onHash = () => {
      setNav(parseHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    if (!window.location.hash) window.location.hash = '#/landing';
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return nav;
}
