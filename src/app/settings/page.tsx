"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Bell,
  Shield,
  ExternalLink,
  Save,
  Loader2,
  Camera,
  CheckCircle2,
  UserCog,
  UserCheck,
  Building,
  GraduationCap,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Image from 'next/image';

// Form validation
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SettingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleToChange, setRoleToChange] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // New role modal component
  const RoleChangeModal = () => {
    if (!showRoleModal) return null;

    const handleConfirmRoleChange = async () => {
      if (!roleToChange) return;

      setRoleLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch('/api/auth/update-role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role: roleToChange }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to update role');
        }

        // Close modal and show success message
        setShowRoleModal(false);
        setSuccessMessage("Account role updated successfully! Refreshing session...");

        // Force session refresh by signing out and redirecting to sign in page
        // This ensures the session is completely refreshed with new role information
        setTimeout(async () => {
          // Use signOut with a redirect to force a complete session refresh
          await authClient.signOut();
          window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent('/settings')}&message=${encodeURIComponent('Please sign in again to apply your new account type')}`;
        }, 1500);
      } catch (error) {
        console.error('Error updating role:', error);
        setErrorMessage(error instanceof Error ? error.message : 'Failed to update role');
      } finally {
        setRoleLoading(false);
      }
    };

    const handleCancelRoleChange = () => {
      setShowRoleModal(false);
      setRoleToChange(null);
    };

    const getRoleIcon = (role: string) => {
      switch (role) {
        case "STUDENT":
          return <GraduationCap className="w-6 h-6" />;
        case "LANDLORD":
          return <Building className="w-6 h-6" />;
        case "ADMIN":
          return <ShieldCheck className="w-6 h-6" />;
        default:
          return <UserCog className="w-6 h-6" />;
      }
    };

    const getRoleName = (role: string) => {
      switch (role) {
        case "STUDENT":
          return "Student";
        case "LANDLORD":
          return "Property Owner/Landlord";
        case "ADMIN":
          return "Administrator";
        default:
          return role;
      }
    };

    return (
      <>
        {/* Modal backdrop */}
        <div className="fixed inset-0 bg-black/50 z-50" onClick={handleCancelRoleChange} />

        {/* Modal content */}
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl z-50 w-11/12 max-w-md p-6">
          <h3 className="text-xl font-bold mb-4 text-center">Change Account Type</h3>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
              {errorMessage}
            </div>
          )}

          <div className="mb-6">
            <p className="text-gray-600 mb-3">
              You are about to change your account type to:
            </p>

            <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-xl">
              {roleToChange && (
                <>
                  <div className="p-2 bg-white rounded-full">
                    {getRoleIcon(roleToChange)}
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">{getRoleName(roleToChange)}</h4>
                    <p className="text-sm text-gray-500">
                      {roleToChange === "LANDLORD"
                        ? "You'll be able to list and manage properties"
                        : roleToChange === "ADMIN"
                          ? "You'll have administrative access to the platform"
                          : "You'll be able to browse and book accommodations"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCancelRoleChange}
              className="flex-1 py-2.5 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={roleLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRoleChange}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] text-white rounded-xl font-semibold hover:from-[var(--color-primary-600)] hover:to-[var(--color-secondary-600)] transition-all duration-300 flex items-center justify-center gap-2"
              disabled={roleLoading}
            >
              {roleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserCheck className="w-4 h-4" />
              )}
              Confirm Change
            </button>
          </div>
        </div>
      </>
    );
  };

  // Delete Account Modal Component
  const DeleteAccountModal = () => {
    if (!deleteModalOpen) return null;

    const handleDeleteAccount = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch('/api/user/delete-account', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || 'Failed to delete account');
        }

        // Account deleted successfully, sign out and redirect
        setDeleteModalOpen(false);
        await authClient.signOut();
        window.location.href = '/';
      } catch (error) {
        console.error('Error deleting account:', error);
        setErrorMessage(error instanceof Error ? error.message : 'Failed to delete account');
      } finally {
        setLoading(false);
      }
    };

    const handleCancelDelete = () => {
      setDeleteModalOpen(false);
    };

    return (
      <>
        {/* Modal backdrop */}
        <div className="fixed inset-0 bg-black/50 z-50" onClick={handleCancelDelete} />

        {/* Modal content */}
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl z-50 w-11/12 max-w-md p-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Delete Account</h3>
            <p className="text-gray-600 mt-2">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
              {errorMessage}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleCancelDelete}
              className="flex-1 py-2.5 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
              Delete Account
            </button>
          </div>
        </div>
      </>
    );
  };

  // Form schemas first
  const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits").max(15).optional().or(z.literal("")),
  });

  const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  const notificationSchema = z.object({
    emailNotifications: z.boolean(),
    messageNotifications: z.boolean(),
    bookingNotifications: z.boolean(),
    marketingNotifications: z.boolean(),
  });

  // Form hooks
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: "",
    }
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
  });

  const {
    register: registerNotification,
    handleSubmit: handleNotificationSubmit,
    formState: { errors: notificationErrors },
    reset: resetNotification
  } = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      messageNotifications: true,
      bookingNotifications: true,
      marketingNotifications: false,
    }
  });

  // Redirect if not logged in
  useEffect(() => {
    if (isPending === false && !session) {
      router.push("/auth/signin");
    }
  }, [isPending, session, router]);

  // Fetch user data and notification preferences
  useEffect(() => {
    if (isPending === false && session?.user?.id) {
      // Set the initial selected role from session
      setSelectedRole(session?.user?.role || "STUDENT");

      // Fetch user profile data
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            resetProfile({
              name: data.name || "",
              email: data.email || "",
              phone: data.phone || "",
            });

            // Update selected role if it exists in the profile
            if (data.role) {
              setSelectedRole(data.role);
            }
          }
        })
        .catch(err => console.error('Error fetching profile:', err));

      // Fetch notification preferences
      fetch('/api/user/notifications')
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            resetNotification({
              emailNotifications: data.emailNotifications,
              messageNotifications: data.messageNotifications,
              bookingNotifications: data.bookingNotifications,
              marketingNotifications: data.marketingNotifications,
            });
          }
        })
        .catch(err => console.error('Error fetching notification settings:', err));
    }
  }, [isPending, session, resetProfile, resetNotification]);

  // Update profile info
  const onProfileSubmit = async (data: { name: string; email: string; phone?: string }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();

      // Profile updated - session will be refreshed on next page load

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const onPasswordSubmit = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update password');
      }

      setSuccessMessage("Password updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      resetPassword();
    } catch (error) {
      console.error('Error updating password:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update notification preferences
  const onNotificationSubmit = async (data: { emailNotifications: boolean; messageNotifications: boolean; bookingNotifications: boolean; marketingNotifications: boolean }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update notification settings');
      }

      setSuccessMessage("Notification settings updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error('Error updating notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update profile picture
  const handleProfilePictureUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    if (file.size > 1024 * 1024) {
      alert("File is too large. Maximum size is 1MB.");
      return;
    }

    setLoading(true);

    try {
      // In a real implementation, we would use FormData to upload the file
      // For now, we'll use FileReader to convert the file to a data URL
      const reader = new FileReader();

      reader.onload = async (event) => {
        if (!event.target?.result) {
          throw new Error("Failed to read file");
        }

        // Get image data as base64 string
        const imageData = event.target.result as string;

        // Send the image data to the server
        const response = await fetch('/api/user/upload-photo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageData: imageData,
            imageUrl: imageData, // For this demo, we'll use the data URL directly
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to upload profile picture');
        }

        if (result.image) {
          // Update session with new user data only if the image was actually changed
          // Profile picture updated

          setSuccessMessage("Profile picture updated successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        }
      };

      // Start reading the file
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert("Failed to upload profile picture. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for initiating role change
  const initiateRoleChange = (role: string) => {
    // Don't do anything if it's the same role
    if (role === selectedRole) return;

    setRoleToChange(role);
    setShowRoleModal(true);
  };

  // Loading state
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[var(--color-primary-500)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-700">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 animate-fade-in-up">
            <CheckCircle2 className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Role Change Modal */}
        {showRoleModal && <RoleChangeModal />}

        {/* Delete Account Modal */}
        {deleteModalOpen && <DeleteAccountModal />}

        <div className="grid md:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-fit p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${activeTab === "profile"
                  ? "border-1 border-[var(--color-primary-500)] bg-[var(--color-primary-900)] text-[var(--color-primary-400)] shadow-sm"
                  : "hover:bg-gray-50 hover:shadow-sm"
                  }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profile Information</span>
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${activeTab === "password"
                  ? "border-1 border-[var(--color-primary-500)] bg-[var(--color-primary-900)] text-[var(--color-primary-400)] shadow-sm"
                  : "hover:bg-gray-50 hover:shadow-sm"
                  }`}
              >
                <Lock className="w-5 h-5" />
                <span className="font-medium">Password & Security</span>
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${activeTab === "notifications"
                  ? "border-1 border-[var(--color-primary-500)] bg-[var(--color-primary-900)] text-[var(--color-primary-400)] shadow-sm"
                  : "hover:bg-gray-50 hover:shadow-sm"
                  }`}
              >
                <Bell className="w-5 h-5" />
                <span className="font-medium">Notifications</span>
              </button>
              <button
                onClick={() => setActiveTab("privacy")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${activeTab === "privacy"
                  ? "border-1 border-[var(--color-primary-500)] bg-[var(--color-primary-900)] text-[var(--color-primary-400)] shadow-sm"
                  : "hover:bg-gray-50 hover:shadow-sm"
                  }`}
              >
                <Shield className="w-5 h-5" />
                <span className="font-medium">Privacy & Data</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Profile Information Tab */}
            {activeTab === "profile" && (
              <div className="animate-fade-in-up">
                <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>

                {/* Profile Picture */}
                <div className="mb-8">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] flex items-center justify-center">
                        {session?.user?.image ? (
                          <Image
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            className="w-24 h-24 rounded-full object-cover"
                            width={96}
                            height={96}
                          />
                        ) : (
                          <span className="text-2xl font-bold text-white">
                            {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                          </span>
                        )}
                      </div>
                      <label
                        htmlFor="profile-picture"
                        className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md cursor-pointer hover:bg-gray-50 hover:shadow-lg hover:scale-110 transition-all duration-200"
                      >
                        <Camera className="w-4 h-4 text-gray-700" />
                        <input
                          type="file"
                          id="profile-picture"
                          className="hidden"
                          accept="image/*"
                          onChange={handleProfilePictureUpdate}
                        />
                      </label>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Profile Picture</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        JPG, PNG or GIF. 1MB max size.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name
                      </label>
                      <input
                        {...registerProfile("name")}
                        id="name"
                        type="text"
                        className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 hover:border-[var(--color-primary-300)] ${profileErrors.name
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-[var(--color-primary-500)]"
                          } focus:border-transparent focus:outline-none focus:ring-2`}
                        placeholder="Your name"
                      />
                      {profileErrors.name && (
                        <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        {...registerProfile("email")}
                        id="email"
                        type="email"
                        className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 hover:border-[var(--color-primary-300)] ${profileErrors.email
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-[var(--color-primary-500)]"
                          } focus:border-transparent focus:outline-none focus:ring-2`}
                        placeholder="your.email@example.com"
                        disabled
                      />
                      {profileErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Email address cannot be changed. Contact support for assistance.
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      {...registerProfile("phone")}
                      id="phone"
                      type="tel"
                      className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 hover:border-[var(--color-primary-300)] ${profileErrors.phone
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[var(--color-primary-500)]"
                        } focus:border-transparent focus:outline-none focus:ring-2`}
                      placeholder="Your phone number"
                    />
                    {profileErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.phone.message}</p>
                    )}
                  </div>

                  {/* User Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Account Type
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {/* Student Role Card */}
                      <div
                        className={`border rounded-xl p-4 flex flex-col gap-3 cursor-pointer transition-all duration-300 hover:border-[var(--color-primary-300)] hover:shadow-lg hover:scale-[1.02] ${selectedRole === "STUDENT"
                          ? "border-[var(--color-primary-500)] bg-gradient-to-br from-[var(--color-primary-800)] to-[var(--color-primary-900)] text-white shadow-lg"
                          : "border-gray-200 hover:bg-gray-50"
                          }`}
                        onClick={() => initiateRoleChange("STUDENT")}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full bg-gray-100`}>
                              <GraduationCap className={`w-5 h-5 ${selectedRole === "STUDENT"
                                ? "text-[var(--color-primary-400)]"
                                : "text-gray-600"
                                }`} />

                            </div>
                            <div>
                              <h3 className={`font-medium ${selectedRole === "STUDENT" ? "text-[var(--color-primary-400)]" : "text-gray-600"}`}>Student</h3>
                            </div>
                          </div>
                          <div>
                            {selectedRole === "STUDENT" && (
                              <span className="text-xs bg-[var(--color-primary-400)] text-white px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          Browse and book accommodations near your university
                        </p>
                      </div>

                      {/* Landlord Role Card */}
                      <div
                        className={`border rounded-xl p-4 flex flex-col gap-3 cursor-pointer transition-all duration-300 hover:border-[var(--color-primary-300)] hover:shadow-lg hover:scale-[1.02] ${selectedRole === "LANDLORD"
                          ? "border-[var(--color-primary-500)] bg-gradient-to-br from-[var(--color-primary-800)] to-[var(--color-primary-900)] text-white shadow-lg"
                          : "border-gray-200 hover:bg-gray-50"
                          }`}
                        onClick={() => initiateRoleChange("LANDLORD")}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full bg-gray-100`}>
                              <Building className={`w-5 h-5 ${selectedRole === "LANDLORD"
                                ? "text-[var(--color-primary-400)]"
                                : "text-gray-600"
                                }`} />

                            </div>
                            <div>
                              <h3 className={`font-medium ${selectedRole === "LANDLORD" ? "text-[var(--color-primary-400)]" : "text-gray-600"}`}>Property Owner</h3>
                            </div>
                          </div>
                          <div>
                            {selectedRole === "LANDLORD" && (
                              <span className="text-xs bg-[var(--color-primary-400)] text-white px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          List and manage your properties for student rental
                        </p>
                      </div>

                      {/* Admin Role Card - only show if user is already admin */}
                      {session?.user?.role === "ADMIN" && (
                        <div
                          className={`border rounded-xl p-4 flex flex-col gap-3 cursor-pointer transition-all duration-300 hover:border-[var(--color-primary-300)] hover:shadow-lg hover:scale-[1.02] ${selectedRole === "ADMIN"
                            ? "border-[var(--color-primary-500)] bg-[var(--color-primary-50)] shadow-lg"
                            : "border-gray-200 hover:bg-gray-50"
                            }`}
                          onClick={() => initiateRoleChange("ADMIN")}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${selectedRole === "ADMIN"
                              ? "bg-[var(--color-primary-100)]"
                              : "bg-gray-100"
                              }`}>
                              <ShieldCheck className={`w-5 h-5 ${selectedRole === "ADMIN"
                                ? "text-[var(--color-primary-700)]"
                                : "text-gray-600"
                                }`} />
                            </div>
                            <div>
                              <h3 className="font-medium">Administrator</h3>
                              {selectedRole === "ADMIN" && (
                                <span className="text-xs bg-[var(--color-primary-100)] text-[var(--color-primary-700)] px-2 py-0.5 rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">
                            Manage the platform and moderate content
                          </p>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-500">
                      Changing your account type will affect what you can do on the platform. Your data will be preserved across account types.
                    </p>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] text-white rounded-xl font-semibold hover:from-[var(--color-primary-600)] hover:to-[var(--color-secondary-600)] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Password & Security Tab */}
            {activeTab === "password" && (
              <div className="animate-fade-in-up">
                <h2 className="text-2xl font-semibold mb-6">Password & Security</h2>

                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Current Password
                    </label>
                    <input
                      {...registerPassword("currentPassword")}
                      id="currentPassword"
                      type="password"
                      className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 hover:border-[var(--color-primary-300)] ${passwordErrors.currentPassword
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[var(--color-primary-500)]"
                        } focus:border-transparent focus:outline-none focus:ring-2`}
                      placeholder="Enter your current password"
                    />
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      New Password
                    </label>
                    <input
                      {...registerPassword("newPassword")}
                      id="newPassword"
                      type="password"
                      className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 hover:border-[var(--color-primary-300)] ${passwordErrors.newPassword
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[var(--color-primary-500)]"
                        } focus:border-transparent focus:outline-none focus:ring-2`}
                      placeholder="Create new password"
                    />
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Password should be at least 8 characters with a mix of letters, numbers & symbols
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirm New Password
                    </label>
                    <input
                      {...registerPassword("confirmPassword")}
                      id="confirmPassword"
                      type="password"
                      className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 hover:border-[var(--color-primary-300)] ${passwordErrors.confirmPassword
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[var(--color-primary-500)]"
                        } focus:border-transparent focus:outline-none focus:ring-2`}
                      placeholder="Confirm your new password"
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* Login Sessions */}
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-medium mb-3">Active Sessions</h3>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[var(--color-primary-100)] rounded-full">
                            <User className="w-5 h-5 text-[var(--color-primary-700)]" />
                          </div>
                          <div>
                            <h4 className="font-medium">Current Device</h4>
                            <p className="text-sm text-gray-500">Windows · Chrome · Last active now</p>
                          </div>
                        </div>
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] text-white rounded-xl font-semibold hover:from-[var(--color-primary-600)] hover:to-[var(--color-secondary-600)] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="animate-fade-in-up">
                <h2 className="text-2xl font-semibold mb-6">Notification Settings</h2>
                <h3 className="text-lg font-medium mb-3 text-gray-500">NOTE: Notifications are currently under development and will be implemented in the future.</h3>

                <form onSubmit={handleNotificationSubmit(onNotificationSubmit)} className="space-y-8">
                  {/* Email Notifications */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-gray-500">Receive notifications via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            {...registerNotification("emailNotifications")}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary-500)] group-hover:bg-gray-300 peer-checked:group-hover:bg-[var(--color-primary-600)]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Booking Updates</h4>
                          <p className="text-sm text-gray-500">Get notified about your booking status</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            {...registerNotification("bookingNotifications")}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary-500)] group-hover:bg-gray-300 peer-checked:group-hover:bg-[var(--color-primary-600)]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">New Messages</h4>
                          <p className="text-sm text-gray-500">Get notified when you receive messages</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            {...registerNotification("messageNotifications")}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary-500)] group-hover:bg-gray-300 peer-checked:group-hover:bg-[var(--color-primary-600)]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Marketing & Promotions</h4>
                          <p className="text-sm text-gray-500">Receive offers and promotional content</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            {...registerNotification("marketingNotifications")}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary-500)] group-hover:bg-gray-300 peer-checked:group-hover:bg-[var(--color-primary-600)]"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] text-white rounded-xl font-semibold hover:from-[var(--color-primary-600)] hover:to-[var(--color-secondary-600)] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Preferences
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Privacy & Data Tab */}
            {activeTab === "privacy" && (
              <div className="animate-fade-in-up">
                <h2 className="text-2xl font-semibold mb-6">Privacy & Data</h2>

                <div className="space-y-8">
                  {/* Data Usage Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Data Usage & Privacy</h3>
                    <p className="text-gray-600 mb-4">
                      We're committed to protecting your personal information and being transparent about how we use your data.
                    </p>

                    <div className="space-y-3">
                      <Link
                        href="/privacy-policy"
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-[var(--color-primary-300)] hover:shadow-sm transition-all duration-200 group"
                      >
                        <span className="font-medium group-hover:text-[var(--color-primary-600)] transition-colors">Privacy Policy</span>
                        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-[var(--color-primary-500)] transition-colors" />
                      </Link>

                      <Link
                        href="/terms-of-service"
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-[var(--color-primary-300)] hover:shadow-sm transition-all duration-200 group"
                      >
                        <span className="font-medium group-hover:text-[var(--color-primary-600)] transition-colors">Terms of Service</span>
                        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-[var(--color-primary-500)] transition-colors" />
                      </Link>

                      <Link
                        href="/cookie-policy"
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-[var(--color-primary-300)] hover:shadow-sm transition-all duration-200 group"
                      >
                        <span className="font-medium group-hover:text-[var(--color-primary-600)] transition-colors">Cookie Policy</span>
                        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-[var(--color-primary-500)] transition-colors" />
                      </Link>
                    </div>
                  </div>

                  {/* Account Data Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Your Account Data</h3>

                    <div className="space-y-4">


                      <button
                        className="w-full text-left px-4 py-3 bg-gray-50 rounded-xl hover:bg-red-50 hover:border-red-200 hover:border hover:shadow-sm transition-all duration-200 group"
                        onClick={() => setDeleteModalOpen(true)}
                      >
                        <span className="font-medium text-red-600 group-hover:text-red-700 transition-colors">Delete Your Account</span>
                        <p className="text-sm text-gray-500 mt-1 group-hover:text-red-600 transition-colors">
                          Permanently delete your account and all associated data
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  )
}