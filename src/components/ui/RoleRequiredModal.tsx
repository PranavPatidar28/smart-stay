"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, AlertTriangle, ArrowRight, X } from "lucide-react";
import { Role, ROLES, getRoleLabel } from "@/types/role";

interface RoleRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredRole: Role;
  currentRole?: Role | null;
  actionType: string;
}

export default function RoleRequiredModal({
  isOpen,
  onClose,
  requiredRole,
  currentRole,
  actionType
}: RoleRequiredModalProps) {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
      // Start animation
      setIsAnimating(true);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    // Delay actual closing to allow animation to complete
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleUpgradeAccount = () => {
    router.push('/settings');
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 transition-all duration-300 ${isAnimating ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
          }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
            Account Role Required
          </h3>

          {/* Message */}
          <p className="text-gray-600 text-center mb-6">
            You need a <span className="font-semibold text-[var(--color-primary-600)]">{getRoleLabel(requiredRole).toLowerCase()}</span> account to {actionType}.
            {currentRole && (
              <> Your current role is <span className="font-semibold">{getRoleLabel(currentRole).toLowerCase()}</span>.</>
            )}
          </p>

          {/* Illustration */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-gray-500" />
                </div>
                <span className="text-sm text-gray-500 mt-2">{ROLES.STUDENT.label}</span>
              </div>

              <ArrowRight className="w-5 h-5 text-gray-400" />

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[var(--color-primary-600)]" />
                </div>
                <span className="text-sm text-[var(--color-primary-600)] font-medium mt-2">{ROLES.LANDLORD.label}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpgradeAccount}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] text-white rounded-xl font-medium hover:from-[var(--color-primary-600)] hover:to-[var(--color-secondary-600)] transition-colors"
            >
              Upgrade Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 