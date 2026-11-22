import { useEffect, useState } from 'react';

export type Route =
  | { kind: 'home' }
  | { kind: 'doc'; key: string }
  | { kind: 'not-found' };

function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '').trim();
  if (path === '' || path === 'home') return { kind: 'home' };

  const [section, key] = path.split('/');
  if (section === 'components' && key) return { kind: 'doc', key };
  return { kind: 'not-found' };
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    parseHash(window.location.hash),
  );

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}

export function navigate(path: string): void {
  window.location.hash = path.startsWith('#') ? path : `#${path}`;
}
