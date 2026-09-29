import { useEffect, useState } from 'react';

export interface Session {
  signedIn: boolean;
}

/**
 * Sign-in state for the homepage.
 *
 * TODO(auth): wire this to the real customer session. The backend already has
 * `/api/auth` and customerMiddleware — this should read that session (Firebase
 * phone OTP per commerceClient.md) rather than assume signed-out. Until then
 * the page renders its signed-out surfaces: the sign-in strip shows, the
 * wallet tile shows "Sign in to view".
 */
export function useSession(): { session: Session; loading: boolean } {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session>({ signedIn: false });

  useEffect(() => {
    let cancelled = false;
    // Resolve on the next tick so consumers exercise their loading state.
    const id = window.setTimeout(() => {
      if (cancelled) return;
      setSession({ signedIn: false });
      setLoading(false);
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);

  return { session, loading };
}
