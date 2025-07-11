"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { User, Home } from "lucide-react";

export default function SelectRole() {
  const [selectedRole, setSelectedRole] = useState<"STUDENT" | "LANDLORD" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If user is not authenticated, redirect to signin
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    // If user already has a role, redirect to home
    if (session?.user?.role) {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (response.ok) {
        // Force session refresh by re-signing in (triggers session update)
        await signIn("google", { callbackUrl: "/" });
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update role");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-secondary-50)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-500)] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-secondary-50)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to SmartStay!</h1>
            <p className="text-gray-600 mb-4">Hi {session.user.name}, please select your role to continue</p>
            <p className="text-sm text-gray-500">You can change this later in your profile settings</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="space-y-4 mb-8">
            <button
              onClick={() => setSelectedRole("STUDENT")}
              className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                selectedRole === "STUDENT"
                  ? "border-[var(--color-primary-500)] bg-[var(--color-primary-50)]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">👨‍🎓</div>
                <div>
                  <div className="font-semibold text-lg">Student</div>
                  <div className="text-sm text-gray-600">I'm looking for accommodation</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole("LANDLORD")}
              className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                selectedRole === "LANDLORD"
                  ? "border-[var(--color-primary-500)] bg-[var(--color-primary-50)]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">🏠</div>
                <div>
                  <div className="font-semibold text-lg">Landlord</div>
                  <div className="text-sm text-gray-600">I'm renting out properties</div>
                </div>
              </div>
            </button>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleRoleSelection}
            disabled={!selectedRole || isLoading}
            className="w-full bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] text-white px-6 py-3 rounded-xl font-semibold hover:from-[var(--color-primary-600)] hover:to-[var(--color-secondary-600)] transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? "Setting up your account..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
} 