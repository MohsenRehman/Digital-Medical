"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  Suspense,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface NavigationContextType {
  isNavigating: boolean;
  navigatingHref: string | null;
  startNavigation: (href: string) => void;
  finishNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  navigatingHref: null,
  startNavigation: () => {},
  finishNavigation: () => {},
});

function SearchParamsWatcher({ onParamsChange }: { onParamsChange: () => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    onParamsChange();
  }, [searchParams, onParamsChange]);

  return null;
}

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [isNavigating, setIsNavigating] = useState(false);
  const [navigatingHref, setNavigatingHref] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const completeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startNavigation = useCallback((href: string) => {
    // If clicking same route, skip
    if (typeof window !== "undefined" && href === window.location.pathname + window.location.search) {
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);
    if (completeTimerRef.current) clearTimeout(completeTimerRef.current);

    setNavigatingHref(href);
    setIsNavigating(true);
    setVisible(true);
    setProgress(15);

    // Smoothly tick progress up to ~85%
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 85;
        }
        const step = Math.max(1, (85 - prev) * 0.15);
        return prev + step;
      });
    }, 120);
  }, []);

  const finishNavigation = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(100);
    setIsNavigating(false);
    setNavigatingHref(null);

    completeTimerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
  }, []);

  // When pathname changes, navigation finished
  useEffect(() => {
    finishNavigation();
  }, [pathname, finishNavigation]);

  // Global link click interceptor for internal doctor links
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      // Check if internal doctor link
      if (
        href &&
        href.startsWith("/doctor") &&
        !target.getAttribute("target") &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        startNavigation(href);
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [startNavigation]);

  return (
    <NavigationContext.Provider
      value={{
        isNavigating,
        navigatingHref,
        startNavigation,
        finishNavigation,
      }}
    >
      <Suspense fallback={null}>
        <SearchParamsWatcher onParamsChange={finishNavigation} />
      </Suspense>

      {/* 2.5px Global Top Progress Bar */}
      {visible && (
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label="Page navigation progress"
          className="fixed top-0 left-0 right-0 h-[2.5px] z-[9999] pointer-events-none bg-transparent"
        >
          <div
            style={{
              width: `${progress}%`,
              transition:
                progress === 100
                  ? "width 200ms ease-out, opacity 300ms ease 150ms"
                  : "width 180ms ease-out",
            }}
            className="h-full bg-gradient-to-r from-sky-500 via-teal-400 to-sky-600 shadow-[0_0_10px_rgba(14,165,233,0.7)]"
          />
        </div>
      )}
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationLoading() {
  return useContext(NavigationContext);
}
