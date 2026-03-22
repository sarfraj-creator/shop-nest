import { useEffect, useState } from "react";

/**
 * Returns true only after the component has mounted on the client.
 * Use this to prevent SSR/client hydration mismatches when reading
 * from zustand stores that are persisted to localStorage.
 *
 * Pattern: render a neutral/skeleton UI on server, then swap to real
 * content after hydration.
 */
export function useHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
