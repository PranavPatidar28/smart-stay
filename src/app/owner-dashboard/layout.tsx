import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";

/**
 * Server-side gate for the owner dashboard. The API routes already enforce
 * landlord-only access, but this prevents non-landlords (and anonymous users)
 * from loading the dashboard shell at all. Middleware only checks cookie
 * presence, so the real role check must happen here on the server.
 */
export default async function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  if (user.role !== "LANDLORD") {
    redirect("/");
  }

  return <>{children}</>;
}
