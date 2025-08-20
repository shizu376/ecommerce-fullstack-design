import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const SnackbarContext = createContext(null);

export function SnackbarProvider({ children }) {
  const [snacks, setSnacks] = useState([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(intervalId);
  }, []);

  const showSnackbar = useCallback((message, options = {}) => {
    const { type = "success", duration = 3000 } = options;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const createdAt = Date.now();
    setSnacks((prev) => [...prev, { id, message, type, duration, createdAt }]);
    window.setTimeout(() => {
      setSnacks((prev) => prev.filter((s) => s.id !== id));
    }, Math.max(1200, duration));
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 items-end">
        {snacks.map((s) => {
          const elapsed = Math.max(0, now - s.createdAt);
          const pct = Math.max(0, 1 - elapsed / (s.duration || 3000));
          // Derive title/subtitle for cart adds: "<Product> added to cart!"
          const trimmed = String(s.message || "").trim();
          const cartMatch = /^(.+?)\s+added to cart!?$/i.exec(trimmed);
          const title = cartMatch ? cartMatch[1] : trimmed;
          const subtitle = cartMatch ? "added to cart!" : "";
          return (
            <div
              key={s.id}
              role="status"
              className="relative pointer-events-auto w-[320px] max-w-[90vw] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-3 flex items-start gap-3">
                {/* Green check icon */}
                <div className="shrink-0 mt-0.5 text-emerald-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <path d="M8 12.5l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{title}</div>
                  {subtitle ? (
                    <div className="text-xs text-gray-600 mt-0.5">{subtitle}</div>
                  ) : null}
                </div>
              </div>
              {/* Progress bar */}
              <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-gray-100">
                <div
                  className="h-full bg-emerald-500 transition-[width] duration-100"
                  style={{ width: `${pct * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  return ctx || { showSnackbar: () => {} };
}


