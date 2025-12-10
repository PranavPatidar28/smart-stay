"use client";

import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

// Better Auth doesn't require a session provider wrapper
// The authClient handles session state internally using nanostores
export default function AuthProvider({ children }: AuthProviderProps) {
  return <>{children}</>;
}