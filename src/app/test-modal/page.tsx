"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/ui/Navbar";
import RoleRequiredModal from "@/components/ui/RoleRequiredModal";
import { Building2 } from "lucide-react";

export default function TestModalPage() {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Role Required Modal Test</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Current Session:</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-60">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Test Modal:</h2>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-[var(--color-primary-500)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-600)] transition-colors flex items-center gap-2"
              >
                <Building2 className="w-5 h-5" />
                Open Role Required Modal
              </button>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Instructions:</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Sign in with a student account</li>
                <li>Click the "List Property" link in the navbar</li>
                <li>The Role Required Modal should appear</li>
                <li>Click "Upgrade Account" to be redirected to the role selection page</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      
      <RoleRequiredModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        requiredRole="LANDLORD"
        currentRole={session?.user?.role}
        actionType="list properties"
      />
    </div>
  );
} 