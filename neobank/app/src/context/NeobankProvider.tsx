"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useNeobank } from "@/hooks/useNeobank";

type NeobankContextType = ReturnType<typeof useNeobank>;

const NeobankContext = createContext<NeobankContextType | null>(null);

export function NeobankProvider({ children }: { children: ReactNode }) {
  const neobank = useNeobank();
  return (
    <NeobankContext.Provider value={neobank}>
      {children}
    </NeobankContext.Provider>
  );
}

export function useNeobankContext(): NeobankContextType {
  const ctx = useContext(NeobankContext);
  if (!ctx) throw new Error("useNeobankContext must be used inside NeobankProvider");
  return ctx;
}
